import os
import asyncio
from gpt_researcher import GPTResearcher
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def analyze_url_with_researcher(url: str) -> dict:
    query = f"Analyze this website and determine its primary category and subcategories: {url}"
    researcher = GPTResearcher(query, "concise")
    await researcher.conduct_research()
    report = await researcher.write_report()
    sources = researcher.get_research_sources()
    
    return {
        "report": report,
        "sources": sources
    }
