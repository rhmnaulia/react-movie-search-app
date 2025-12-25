import { useState, useRef, useEffect } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import type { Movie } from '../types/movie';
import './SearchBar.css';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onSuggestionsFetch: (query: string) => void;
  suggestions: Movie[];
  onClearSuggestions: () => void;
  onMovieSelect: (id: string) => void;
}

export const SearchBar = ({
  onSearch,
  onSuggestionsFetch,
  suggestions,
  onClearSuggestions,
  onMovieSelect,
}: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [hideSuggestions, setHideSuggestions] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const debouncedQuery = useDebounce(query, 300);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Fetch suggestions when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim().length >= 2) {
      onSuggestionsFetch(debouncedQuery);
    } else {
      onClearSuggestions();
    }
  }, [debouncedQuery, onSuggestionsFetch, onClearSuggestions]);

  // Handle click outside to hide suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setHideSuggestions(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setHideSuggestions(false);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
  };

  const handleSuggestionClick = (id: string) => {
    setHideSuggestions(true);
    onMovieSelect(id);
  };

  const handleImageError = (movieId: string) => {
    setImageErrors((prev) => new Set(prev).add(movieId));
  };

  // Derive showSuggestions from state - only show when focused, not hidden, and have results
  const showSuggestions =
    isFocused &&
    !hideSuggestions &&
    debouncedQuery.trim().length >= 2 &&
    suggestions.length > 0;

  return (
    <div className="search-bar-wrapper" ref={wrapperRef}>
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder="Search for movies..."
          className="search-input"
          data-testid="search-input"
        />
        <button type="submit" className="search-button" data-testid="search-button">
          Search
        </button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="suggestions-dropdown" data-testid="suggestions-dropdown">
          {suggestions.map((movie) => (
            <div
              key={movie.imdbID}
              className="suggestion-item"
              onClick={() => handleSuggestionClick(movie.imdbID)}
              data-testid="suggestion-item"
            >
              {movie.Poster !== 'N/A' && !imageErrors.has(movie.imdbID) ? (
                <img
                  src={movie.Poster}
                  alt={movie.Title}
                  className="suggestion-poster"
                  onError={() => handleImageError(movie.imdbID)}
                />
              ) : (
                <div className="suggestion-poster-placeholder">N/A</div>
              )}
              <div className="suggestion-info">
                <div className="suggestion-title">{movie.Title}</div>
                <div className="suggestion-year">{movie.Year}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
