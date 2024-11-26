from typing import Dict
from .http_config import CATEGORIES

def get_system_prompt() -> str:
    """Get the system prompt with category information"""
    categories_str = ', '.join(f'"{cat}"' for cat in CATEGORIES)
    return f"""You are a website classifier that provides concise categorizations in JSON format.
You must classify websites into one of these categories: [{categories_str}].

Guidelines for classification:
1. AI/Machine Learning: Content about artificial intelligence, machine learning, deep learning, or AI applications
2. Technology: General tech content, programming, software, hardware, or digital innovation
3. Business: Business news, entrepreneurship, finance, or corporate content
4. Education: Learning resources, tutorials, courses, or academic content
5. Entertainment: Media, games, movies, music, or leisure activities
6. News: Current events, journalism, or news reporting
7. Shopping: E-commerce, product reviews, or online stores
8. Social Media: Social networking, community platforms, or social content
9. Other: Content that doesn't fit into the above categories

Always respond with valid JSON containing:
- category: Must be one of the listed categories
- confidence: Number between 0 and 1
- explanation: Brief reason for classification (max 100 chars)"""

def get_classification_prompt(content: str) -> str:
    """Get the classification prompt with the content to analyze"""
    categories_str = ', '.join(f'"{cat}"' for cat in CATEGORIES)
    return f"""Analyze this website content and classify it into a category. 
Content: {content}

Respond with a JSON object containing:
1. category: Choose from [{categories_str}]
2. confidence: A number between 0 and 1
3. explanation: A brief explanation (max 100 chars)

Example response:
{{"category": "AI/Machine Learning", "confidence": 0.95, "explanation": "AI research and development blog post"}}"""

# Example responses for different scenarios
EXAMPLE_RESPONSES: Dict[str, dict] = {
    'success': {
        "category": "AI/Machine Learning",
        "confidence": 0.95,
        "explanation": "AI research and development blog post"
    },
    'insufficient_content': {
        "category": "Other",
        "confidence": 0.3,
        "explanation": "Insufficient content to determine accurate category"
    },
    'error': {
        "category": "Other",
        "confidence": 0.0,
        "explanation": "Could not determine category",
        "error": "Error processing content"
    }
}
