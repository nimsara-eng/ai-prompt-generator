# AI Prompt Generator Backend

A Node.js backend that generates detailed prompts across categories (wallpapers, videos, apps, websites, ChatGPT, short stories, etc.).

## Endpoints
- GET `/` → health check
- POST `/generate` → generate a prompt
  - Body: `{ "category": "website", "keyword": "minimalist portfolio" }`

## Run locally
```bash
npm install
npm start

