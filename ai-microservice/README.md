# AI Microservice

Production-ready AI microservice for advertising content generation using OpenAI API.

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/generate/copy` | Generate ad copy (JSON response) |
| `POST` | `/generate/copy/stream` | Generate ad copy (SSE streaming) |
| `POST` | `/generate/social` | Generate social media posts |
| `POST` | `/generate/hashtags` | Generate hashtag sets |
| `GET` | `/health` | Health check |

## Quick Start

```bash
cp .env.example .env
# Edit .env with your OPENAI_API_KEY

npm install
npm run dev
```

## Docker

```bash
docker compose up ai-microservice
```

## API Usage

### Generate Ad Copy (JSON)

```bash
curl -X POST http://localhost:5000/generate/copy \
  -H "Content-Type: application/json" \
  -d '{
    "product": "SaaS Analytics Platform",
    "description": "Real-time campaign analytics dashboard with AI-powered insights",
    "audience": "Marketing managers and agency owners aged 25-45",
    "tone": "professional",
    "format": "full_ad",
    "count": 3
  }'
```

### Generate Ad Copy (SSE Stream)

```bash
curl -N -X POST http://localhost:5000/generate/copy/stream \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -d '{
    "product": "Eco-Friendly Water Bottle",
    "description": "Self-cleaning water bottle using UV-C technology",
    "audience": "Health-conscious outdoor enthusiasts",
    "tone": "casual",
    "format": "headline",
    "count": 3
  }'
```

SSE Events:
```
event: start
data: {"message":"Generation started"}

event: token
data: {"token":" Here"}

event: token
data: {"token":"'s"}

event: done
data: {"message":"Generation completed","totalTokens":156}
```

### Generate Social Posts

```bash
curl -X POST http://localhost:5000/generate/social \
  -H "Content-Type: application/json" \
  -d '{
    "product": "TechStartup Inc",
    "message": "Launching our new AI-powered project management tool next week",
    "platform": "linkedin",
    "tone": "professional",
    "includeHashtags": true,
    "includeEmojis": false,
    "count": 2
  }'
```

### Generate Hashtags

```bash
curl -X POST http://localhost:5000/generate/hashtags \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Sustainable Fashion",
    "niche": "Eco-friendly streetwear",
    "platform": "instagram",
    "count": 25
  }'
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | Runtime environment |
| `PORT` | `5000` | Server port |
| `OPENAI_API_KEY` | — | OpenAI API key (required) |
| `OPENAI_MODEL` | `gpt-4o-mini` | Model to use |
| `OPENAI_MAX_TOKENS` | `2048` | Max tokens per response |
| `OPENAI_TEMPERATURE` | `0.8` | Creativity level (0-1) |
| `RATE_LIMIT_WINDOW_MS` | `60000` | Rate limit window |
| `RATE_LIMIT_MAX_REQUESTS` | `30` | Max requests per window |
| `LOG_LEVEL` | `info` | Logging level |
| `ALLOWED_ORIGINS` | `localhost:3000,5173` | CORS allowed origins |

## Structure

```
ai-microservice/
├── src/
│   ├── config/
│   │   ├── openai.js          # OpenAI client config
│   │   ├── logger.js          # Winston + request ID
│   │   └── prompts.js         # Prompt templates
│   ├── controllers/
│   │   └── generationController.js  # All generation logic
│   ├── middleware/
│   │   └── index.js           # Validation + SSE helpers
│   ├── validations/
│   │   └── index.js           # Zod schemas
│   ├── routes/
│   │   └── generate.js        # Route definitions
│   └── server.js              # Express app
├── Dockerfile
├── .env.example
└── package.json
```

## Production Notes

- Multi-stage Docker build (dev + prod targets)
- Non-root user in production container
- Health check endpoint
- Rate limiting at app level
- Structured JSON logging with request IDs
- Graceful error handling for OpenAI failures
- CORS restricted to allowed origins
