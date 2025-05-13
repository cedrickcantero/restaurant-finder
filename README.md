# Restaurant Finder App

An LLM-driven restaurant search application that converts natural language queries into structured data for the Foursquare Places API.

## Features

- Natural language processing using OpenRouter AI
- Integration with Foursquare Places API
- Clean and responsive UI
- API endpoint for backend processing
- Secure handling of API keys

## Technology Stack

- Next.js 14 with App Router
- TypeScript
- OpenRouter AI API (DeepSeek model)
- Foursquare Places API
- Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- OpenRouter API key (get one at [openrouter.ai](https://openrouter.ai))
- Foursquare API key (get one at [developer.foursquare.com](https://developer.foursquare.com))

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory with the following variables:
   ```
   # Server-side environment variables (secure)
   OPENROUTER_API_KEY=your_openrouter_api_key
   FOURSQUARE_API_KEY=your_foursquare_api_key
   ```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Security

This application follows security best practices for handling API keys:

- API keys are stored as server-side environment variables
- API requests are made from server-side API routes, not client-side code
- Environment variables are not exposed to the client
- Error messages are sanitized to prevent information leakage

## API Endpoint

The application provides an API endpoint for processing restaurant search requests:

```
POST /api/execute
```

Request body:
```json
{
  "message": "Find me a cheap sushi restaurant in downtown Los Angeles that's open now"
}
```

Response:
```json
{
  "query": {
    "action": "restaurant_search",
    "parameters": {
      "query": "sushi",
      "near": "downtown Los Angeles",
      "price": "1",
      "open_now": true
    }
  },
  "results": [
    // Array of restaurant data from Foursquare
  ]
}
```

## How It Works

1. User enters a natural language query
2. The query is sent to OpenRouter AI which converts it to structured JSON
3. The structured JSON is used to search for restaurants via Foursquare Places API
4. Results are displayed to the user with details such as name, address, categories, etc.

## Assumptions and Limitations

### Assumptions
- The application assumes that users will enter queries related to restaurant search.
- Environment variables are used for API keys to maintain security.
- API keys are kept secure by using server-side environment variables and API routes.

### Limitations
- The free tier of OpenRouter API has rate limits and token limits which may affect query processing.
- The Foursquare Places API has limitations on the number of requests per day on free accounts.
- Currently, the application only searches for restaurants and does not support other venue types.
- Error handling is basic and could be enhanced for production use.
- The search is limited to the parameters supported by the Foursquare API (location, query, price, open_now).

## License

MIT
