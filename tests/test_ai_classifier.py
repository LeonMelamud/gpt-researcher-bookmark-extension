import pytest
from fastapi.testclient import TestClient
import sys
import os

# Add parent directory to path to import ai_classifier
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from ai_classifier import app

client = TestClient(app)

def test_classify_url_endpoint():
    # Test with valid URL
    response = client.post(
        "/classify",
        json={"url": "https://openai.com/blog/chatgpt"}
    )
    assert response.status_code == 200
    assert "report" in response.json()
    assert "sources" in response.json()

def test_classify_url_missing_url():
    # Test without URL
    response = client.post("/classify", json={})
    assert response.status_code == 200
    assert "error" in response.json()
    assert response.json()["error"] == "URL is required"

def test_classify_url_invalid_url():
    # Test with invalid URL
    response = client.post(
        "/classify",
        json={"url": "not-a-valid-url"}
    )
    assert response.status_code == 200
    assert "error" in response.json()

@pytest.mark.asyncio
async def test_analyze_url():
    from ai_classifier import analyze_url
    
    # Test with AI-related URL
    result = await analyze_url("https://openai.com")
    assert isinstance(result, dict)
    assert "report" in result
    assert "sources" in result

def test_environment_variables():
    # Test that required environment variables are set
    assert 'OPENAI_API_KEY' in os.environ
    assert 'TAVILY_API_KEY' in os.environ

if __name__ == "__main__":
    pytest.main([__file__])
