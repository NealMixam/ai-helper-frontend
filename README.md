# AI Helper — Frontend

React frontend for the AI Helper personal assistant app.

## Features

- ✅ **JWT Authentication** — login/register with token persistence
- ✅ **Chat with AI** — DeepSeek-powered chat with markdown rendering and syntax highlighting
- ✅ **Notes** — create, edit, delete notes with tags and client-side search
- ✅ **AI Note Analysis** — one-click summarization, auto-tagging, and task extraction
- ✅ **Weather** — track cities with current weather (temperature, humidity, wind)
- ✅ **Telegram Integration** — link your Telegram account via one-time code

## Tech Stack

- **Framework:** React 19
- **Build Tool:** Vite 8
- **Language:** JavaScript (JSX)
- **UI Library:** Material UI 7
- **State/Data:** React Query (TanStack Query v5)
- **Routing:** React Router v7
- **HTTP:** Axios
- **AI Chat:** react-markdown + react-syntax-highlighter

## Getting Started

### Prerequisites

- Node.js 18+
- Backend server running (see [ai-helper-backend](../ai-helper-backend))

### Setup

```bash
cd ai-helper

npm install
npm run dev
```

The app will start at `http://localhost:5173` and proxy API requests to the backend at `http://localhost:3001`.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

## Project Structure

```
src/
├── api.js            # Axios instance with JWT interceptor
├── components/       # Reusable components (ChatMessage, NoteEditor)
├── layouts/          # App shell with sidebar navigation
├── pages/            # Route pages (Auth, Chat, Notes, Weather, Profile)
└── assets/           # Static assets
```

## Pages

| Route | Page | Description |
|-------|------|-------------|
| `/auth` | AuthPage | Login / Registration |
| `/chat` | ChatPage | AI chat with DeepSeek |
| `/notes` | NotesPage | Notes CRUD with AI analysis |
| `/weather` | WeatherPage | Track cities and view weather |
| `/profile` | ProfilePage | Settings & Telegram linking |

## API Configuration

The API base URL is configured in `src/api.js`:

```js
export const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});
```

JWT tokens are automatically attached to every request via an Axios interceptor.