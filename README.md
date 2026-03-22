# SwipeScore

A QA review dashboard for auto-generated sports news stories. Browse AI-generated match stories, inspect their source data, and filter by quality issues.

## Tech Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS
- Lucide React icons

## Getting Started

```bash
npm install
npm run dev
```

The dev server starts at `http://localhost:5173`.

## How It Works

Story data lives in `public/data/stories.json`. Each entry contains:

- **source** — match metadata (teams, scores, venue, date, league, badges)
- **story** — generated content (headline, body, tags, mood, image query)
- **qa** — quality check results (pass/warn/fail status, issues list, score)

The app loads this data into a feed view with story cards. Select a card to see the raw source data in the sidebar. Use the "QA Issues Only" filter to surface stories that didn't pass quality checks.

## API

A custom Vite middleware exposes a `POST /api/save` endpoint during development. It writes the request body directly to `stories.json`, allowing external tools (e.g. n8n workflows) to push new story data into the dashboard.

## Project Structure

```
src/
  App.tsx              # Main layout, data loading, filtering
  types.ts             # TypeScript interfaces (MatchSource, StoryContent, QAStatus, StoryItem)
  components/
    Feed.tsx           # Scrollable story card list
    StoryCard.tsx      # Individual story card
    Sidebar.tsx        # Raw source data viewer
public/
  data/stories.json    # Story data file
```
