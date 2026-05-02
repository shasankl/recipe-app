# AI Recipe App

A simple Next.js web app that generates recipes from:
- Ingredients
- Available cook time (minutes)

The app calls an OpenAI-compatible chat completion endpoint and returns a structured recipe with detailed steps.

## Setup

1. Install dependencies:
   - `npm install` (or your preferred package manager)
2. Create env file:
   - `cp .env.example .env`
3. Add your API key in `.env`:
   - `OPENAI_API_KEY=...`
4. Start the app:
   - `npm run dev`

## Request/Response

`POST /api/recipe`

Request:
- `ingredients: string[]`
- `cookTimeMinutes: number`

Response:
- `title: string`
- `servings: number`
- `totalTimeMinutes: number`
- `ingredients: string[]`
- `steps: string[]`
- `tips?: string[]`

## Scripts

- `npm run dev` - Start local dev server
- `npm run build` - Create production build
- `npm run start` - Run production server
- `npm run lint` - Run lint checks
- `npm run test` - Run Vitest tests
