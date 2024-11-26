from typing import Dict, List

# HTTP Request Configuration
REQUEST_HEADERS: Dict[str, str] = {
    # Browser Identification
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    
    # Content Negotiation
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    
    # Security Headers
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Ch-Ua-Platform': '"macOS"',
    
    # Connection Management
    'Connection': 'keep-alive',
    'DNT': '1',  # Do Not Track
    'Upgrade-Insecure-Requests': '1',
    
    # Cache Control
    'Cache-Control': 'max-age=0',
    'Pragma': 'no-cache'
}

# HTTP Client Configuration
CLIENT_CONFIG = {
    'follow_redirects': True,
    'timeout': 30.0,
    'verify': True  # Enforce SSL verification
}

# Timeout Configuration for Extension
TIMEOUT_CONFIG = {
    'timeout': 30.0
}

# Headers for Extension
HEADERS = REQUEST_HEADERS

# Content Extraction Configuration
CONTENT_EXTRACTION = {
    'remove_elements': ['script', 'style', 'meta', 'link', 'noscript'],
    'content_classes': ['content', 'main', 'article', 'post', 'blog-post'],
    'content_tags': ['article', 'main', 'div', 'section'],
    'min_content_length': 100,
    'max_content_length': 1500
}

# Category Configuration
CATEGORIES: List[str] = [
    'AI/Machine Learning',
    'Technology',
    'Business',
    'Education',
    'Entertainment',
    'News',
    'Shopping',
    'Social Media',
    'Other'
]

# API Configuration
API_CONFIG = {
    'title': 'Bookmark Classifier API',
    'description': 'API for classifying bookmarks using AI content analysis',
    'version': '1.0.0',
    'docs_url': '/docs',
    'redoc_url': '/redoc'
}

# OpenAI Configuration
OPENAI_CONFIG = {
    'model': 'gpt-3.5-turbo',
    'max_tokens': 150,
    'temperature': 0.3
}
