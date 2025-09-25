# AI Prompt Generator

This is a backend service that generates detailed prompts for:

- Wallpaper
- Video
- App
- Website
- ChatGPT
- Short stories, etc.

## API Endpoint

`POST /api/generate`

- Body (JSON):

```json
{
  "category": "video",
  "keyword": "motivational anime intro"
}
```

- Response (JSON):

```json
{
  "prompt": "Generated detailed prompt..."
}
```

## Deployment

1. Push this repo to GitHub
2. Import repo to Vercel
3. Set environment variable `OPENAI_API_KEY` with your key
