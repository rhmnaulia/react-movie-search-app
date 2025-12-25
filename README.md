# Movie Search Application

A React application for searching and browsing movies using the OMDB API.

## Features

- Search movies by title
- Autocomplete suggestions with thumbnails
- Infinite scroll pagination
- Movie detail view with full information
- Image modal for posters
- Error handling and fallback states
- Unit tests with Vitest

## Tech Stack

- React 19
- TypeScript
- Redux Toolkit
- React Router
- Axios
- Vite
- Vitest & React Testing Library

## Project Structure

```
src/
├── components/      # UI components
├── features/        # Redux slices
├── hooks/           # Custom hooks
├── pages/           # Page components
├── services/        # API client
├── store/           # Redux store
├── types/           # TypeScript types
└── __tests__/       # Unit tests
```

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env and add your OMDB API key
```

### Development

```bash
# Start dev server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Implementation Details

### Infinite Scroll
- Custom hook using Intersection Observer API
- Monitors last element visibility to trigger pagination
- No external libraries

### Search
- Debounced autocomplete (300ms delay)
- Shows 5 suggestions with thumbnails
- Redux state management

### Error Handling
- ErrorBoundary component for React errors
- Image fallback for broken posters
- API error messages

## Environment Variables

Configuration is managed through environment variables:

```env
VITE_OMDB_API_KEY=your_api_key_here
VITE_OMDB_API_URL=http://www.omdbapi.com
```

- API keys stored in `.env` (gitignored)
- `.env.example` provided as template
- Runtime validation on startup

## Testing

```bash
npm test              # Run tests
npm run test:ui       # Test with UI
npm run test:coverage # Coverage report
```

Tests cover:
- Component rendering and interactions
- Redux state management
- API integration

## Requirements

✅ ReactJS with Redux Toolkit
✅ Axios for HTTP requests
✅ React Hooks (useState, useEffect, useCallback, custom hooks)
✅ Custom infinite scroll (no plugins)
✅ Autocomplete search
✅ Movie details page
✅ Poster modal
✅ Unit tests
✅ Structured file organization


