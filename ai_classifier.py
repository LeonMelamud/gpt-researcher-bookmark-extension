import os
import asyncio
import httpx
from bs4 import BeautifulSoup
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Dict, Any
import uvicorn
from dotenv import load_dotenv
import aisuite as ai
from config.http_config import (
    REQUEST_HEADERS,
    CLIENT_CONFIG,
    CONTENT_EXTRACTION,
    API_CONFIG,
    OPENAI_CONFIG,
    TIMEOUT_CONFIG,
    HEADERS
)
from config.prompt_config import (
    get_system_prompt,
    get_classification_prompt,
    EXAMPLE_RESPONSES
)
from config.cost_config import calculate_cost
import json
import time

# Load environment variables
load_dotenv()

# Initialize AISuite client
client = ai.Client()
client.api_key = os.getenv('OPENAI_API_KEY')

# Set the model to use
AI_MODEL = "openai:gpt-3.5-turbo"

# Initialize FastAPI with config
app = FastAPI(**API_CONFIG)

class URLRequest(BaseModel):
    urls: List[str] = Field(..., min_items=1, max_items=10, description="List of URLs to classify (max 10)")

    class Config:
        json_schema_extra = {
            "example": {
                "urls": ["https://openai.com/blog/chatgpt", "https://news.ycombinator.com"]
            }
        }

class ClassificationResponse(BaseModel):
    url: str
    category: str
    confidence: float
    explanation: str
    cost_usd: float = Field(description="Cost of the API call in USD")
    error: str = None

async def fetch_url_content(url: str) -> tuple[str, str]:
    """Fetch and extract text content from URL with secure headers"""
    try:
        timeout = httpx.Timeout(30.0, connect=30.0)
        headers = {
            **REQUEST_HEADERS,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
        }
        
        async with httpx.AsyncClient(timeout=timeout, follow_redirects=True) as client:
            response = await client.get(url, headers=headers)
            response.raise_for_status()
            
            # Extract text content
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Remove unwanted elements
            for elem in soup(['script', 'style', 'meta', 'noscript', 'iframe', 'header', 'footer', 'nav']):
                elem.decompose()
                
            # Get text and normalize whitespace
            text = ' '.join(soup.stripped_strings)
            
            if not text or len(text) < 100:  # Minimum content length
                return None, "Insufficient content found on the page"
                
            # Limit content length but ensure we don't cut in the middle of a word
            max_length = 1500
            if len(text) > max_length:
                text = text[:max_length].rsplit(' ', 1)[0]
            
            return text, None
            
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 403:
            try:
                soup = BeautifulSoup(e.response.text, 'html.parser')
                title = soup.title.string if soup.title else url
                return f"Page title: {title} (Note: Full content not accessible due to website restrictions)", None
            except:
                return None, f"Access forbidden (403) for URL: {url}"
        return None, f"HTTP error occurred: {str(e)}"
    except httpx.RequestError as e:
        return None, f"Request error occurred: {str(e)}"
    except Exception as e:
        return None, f"Error processing URL: {str(e)}"

async def analyze_url(url: str) -> Dict[str, Any]:
    """Analyze URL content and classify it using AISuite"""
    try:
        start_time = time.time()
        
        # Fetch content
        fetch_start = time.time()
        content, error = await fetch_url_content(url)
        fetch_time = time.time() - fetch_start
        
        if error:
            raise HTTPException(status_code=400, detail=error)
        if not content:
            raise HTTPException(status_code=400, detail="Failed to fetch URL content")

        # Prepare messages for classification
        messages = [
            {"role": "system", "content": get_system_prompt()},
            {"role": "user", "content": get_classification_prompt(content)}
        ]

        # Get classification using AISuite
        # Run in a thread pool since AISuite's client is synchronous
        loop = asyncio.get_event_loop()
        ai_start = time.time()
        try:
            response = await loop.run_in_executor(
                None,
                lambda: client.chat.completions.create(
                    model=AI_MODEL,
                    messages=messages,
                    temperature=OPENAI_CONFIG['temperature']
                )
            )
            ai_time = time.time() - ai_start
            
            # Parse response
            try:
                result = json.loads(response.choices[0].message.content)
            except json.JSONDecodeError:
                result = {
                    "category": "Other",
                    "confidence": 0.0,
                    "explanation": "Failed to parse AI response"
                }

            # Calculate cost using token counts from usage
            prompt_tokens = response.usage.prompt_tokens
            completion_tokens = response.usage.completion_tokens
            cost = calculate_cost(prompt_tokens, completion_tokens)

            total_time = time.time() - start_time
            return {
                "url": url,
                "category": result.get("category", "Other"),
                "confidence": result.get("confidence", 0.0),
                "explanation": result.get("explanation", "No explanation provided"),
                "tokens": prompt_tokens + completion_tokens,
                "cost": cost,
                "timing": {
                    "fetch_time": round(fetch_time, 3),
                    "ai_time": round(ai_time, 3),
                    "total_time": round(total_time, 3)
                }
            }
        except Exception as e:
            print("Error in chat completion:", str(e))
            raise

    except HTTPException as e:
        total_time = time.time() - start_time
        return {
            "url": url,
            "category": "Other",
            "confidence": 0.0,
            "explanation": "Could not determine category",
            "cost": 0.0,
            "error": f"{e.status_code}: {e.detail}",
            "timing": {
                "fetch_time": round(fetch_time, 3),
                "ai_time": 0,
                "total_time": round(total_time, 3)
            }
        }
    except Exception as e:
        total_time = time.time() - start_time
        return {
            "url": url,
            "category": "Other",
            "confidence": 0.0,
            "explanation": "Could not determine category",
            "cost": 0.0,
            "error": str(e),
            "timing": {
                "fetch_time": round(time.time() - start_time, 3),
                "ai_time": 0,
                "total_time": round(total_time, 3)
            }
        }

@app.post("/classify", response_model=List[Dict[str, Any]])
async def classify_urls(request: URLRequest):
    """Classify multiple URLs"""
    results = []
    total_cost = 0.0
    total_time = 0.0
    
    for url in request.urls:
        result = await analyze_url(url)
        results.append(result)
        total_cost += result.get('cost', 0.0)
        total_time += result.get('timing', {}).get('total_time', 0.0)
    
    # Add total cost and timing to the last item in the array
    if results:
        results.append({
            "total_cost": round(total_cost, 6),
            "total_time": round(total_time, 3)
        })
    
    return results

@app.middleware("http")
async def add_cost_header(request, call_next):
    """Add total cost header to response"""
    response = await call_next(request)
    if hasattr(app.state, 'response_headers'):
        for key, value in app.state.response_headers.items():
            response.headers[key] = value
        delattr(app.state, 'response_headers')
    return response

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8003)
