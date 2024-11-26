# GPT Researcher Bookmark Organizer

A Chrome extension that automatically organizes your bookmarks into categories using AI-powered content analysis.

## Features

- Automatically categorizes new bookmarks as they are created
- Bulk organization of existing bookmarks
- Smart category detection based on page content and GPT analysis
- Clean and intuitive user interface
- RESTful API for bookmark classification

## Prerequisites

- Node.js and npm
- Python 3.8 or higher
- Chrome browser
- OpenAI API key
- Tavily API key

## Installation

1. Clone this repository:
   ```bash
   git clone git@github.com:LeonMelamud/gpt-researcher-bookmark-extension.git
   cd gpt-researcher-bookmark-extension
   ```

2. Create and activate a Python virtual environment:
   ```bash
   # Create virtual environment
   python3 -m venv venv

   # Activate virtual environment
   # On macOS/Linux:
   source venv/bin/activate
   # On Windows:
   .\venv\Scripts\activate
   ```

3. Install Python dependencies:
   ```bash
   python3 -m pip install -r requirements.txt
   ```

4. Set up environment variables:
   Create a `.env` file in the project root with:
   ```
   OPENAI_API_KEY=your_openai_api_key
   TAVILY_API_KEY=your_tavily_api_key
   ```

5. Install Node.js dependencies:
   ```bash
   npm install
   ```

## Development

1. Start the development server:
   ```bash
   # On macOS/Linux:
   npm run dev

   # On Windows:
   npm run dev:windows
   ```
   This will start the FastAPI server with hot-reloading enabled. The server will restart automatically when you make changes to Python files.

2. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right corner
   - Click "Load unpacked" and select the extension directory

3. Run tests:
   ```bash
   npm test
   ```

## API Documentation

The API will be available at `http://127.0.0.1:8000` with the following documentation endpoints:
- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

## Usage

### Automatic Organization
When you create a new bookmark, the extension will automatically analyze its content and move it to an appropriate category folder.

### Manual Organization
1. Click the extension icon in your Chrome toolbar
2. Click "Organize All Bookmarks" to categorize all existing bookmarks

## API Endpoints

### POST /classify
Classifies a URL using GPT Researcher

Request:
```json
{
  "url": "https://example.com/article"
}
```

Response:
```json
{
  "category": "Technology",
  "subcategory": "Artificial Intelligence",
  "summary": "Brief summary of the content..."
}
```

## Project Structure

```
.
├── ai_classifier.py      # FastAPI backend server
├── config/              # Configuration files
├── static/             # Static assets
├── templates/          # HTML templates
└── tests/             # Test files
```

## Categories

The extension organizes bookmarks into the following categories:
- AI/Machine Learning
- AI Tools
- AI Research
- AI Development
- Technology
- News
- Shopping
- Social
- Education
- Entertainment
- Business
- Travel
- Health
- Uncategorized

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
