'use client';

import { useState } from 'react';

interface Category {
  category: string;
  confidence: number;
  explanation?: string;
}

export default function URLChecker() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<Category | null>(null);

  const checkURL = async () => {
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);
    setError(null);
    setCategory(null);

    try {
      const response = await fetch('http://localhost:8000/classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze URL');
      }

      const data = await response.json();
      setCategory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      checkURL();
    }
  };

  return (
    <div className="flex flex-col space-y-4 w-full">
      <div className="input-container">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter URL to check"
          disabled={loading}
          className="url-input"
        />
        <button
          onClick={checkURL}
          disabled={loading}
          className="check-button"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              <span>Analyzing</span>
            </>
          ) : (
            "Check"
          )}
        </button>
      </div>

      {error && (
        <div className="error-container">
          <div className="flex items-start">
            <svg className="h-5 w-5 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="ml-3 text-sm">{error}</p>
          </div>
        </div>
      )}

      {category && (
        <div className="result-container">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <svg className="h-5 w-5 text-[#10a37f]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-base font-medium">
                {category.category}
              </span>
            </div>
            <span className={`confidence-badge ${
              category.confidence > 0.8
                ? 'confidence-high'
                : category.confidence > 0.6
                ? 'confidence-medium'
                : 'confidence-low'
            }`}>
              {Math.round(category.confidence * 100)}% confident
            </span>
          </div>
          {category.explanation && (
            <p className="text-sm text-gray-600 mt-2">{category.explanation}</p>
          )}
        </div>
      )}
    </div>
  );
}
