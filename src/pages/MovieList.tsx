import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import {
  searchMovies,
  setSearchQuery,
  resetMovies,
  fetchSuggestions,
  clearSuggestions,
} from '../features/movies/movieSlice';
import { SearchBar } from '../components/SearchBar';
import { MovieCard } from '../components/MovieCard';
import { PosterModal } from '../components/PosterModal';
import './MovieList.css';

export const MovieList = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { movies, loading, error, hasMore, currentPage, suggestions, searchQuery } = useAppSelector(
    (state) => state.movies
  );

  const [selectedPoster, setSelectedPoster] = useState<string | null>(null);

  // Load initial search on mount
  useEffect(() => {
    if (!searchQuery) {
      dispatch(setSearchQuery('Batman'));
      dispatch(searchMovies({ query: 'Batman', page: 1 }));
    }
  }, [dispatch, searchQuery]);

  // Memoize only callbacks passed to child components to prevent re-renders
  const handleSearch = useCallback((query: string) => {
    dispatch(setSearchQuery(query));
    dispatch(resetMovies());
    dispatch(searchMovies({ query, page: 1 }));
  }, [dispatch]);

  const handleSuggestionsFetch = useCallback((query: string) => {
    dispatch(fetchSuggestions(query));
  }, [dispatch]);

  const handleClearSuggestions = useCallback(() => {
    dispatch(clearSuggestions());
  }, [dispatch]);

  const handleMovieSelect = useCallback((id: string) => {
    navigate(`/movie/${id}`);
  }, [navigate]);

  const handlePosterClick = useCallback((posterUrl: string) => {
    setSelectedPoster(posterUrl);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedPoster(null);
  }, []);

  // Load more function for infinite scroll
  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore && searchQuery) {
      dispatch(searchMovies({ query: searchQuery, page: currentPage + 1 }));
    }
  }, [dispatch, loading, hasMore, searchQuery, currentPage]);

  const { lastElementRef } = useInfiniteScroll({
    loading,
    hasMore,
    onLoadMore: handleLoadMore,
  });

  return (
    <div className="movie-list-page">
      <header className="page-header">
        <h1 className="page-title">Movie Search</h1>
        <SearchBar
          onSearch={handleSearch}
          onSuggestionsFetch={handleSuggestionsFetch}
          suggestions={suggestions}
          onClearSuggestions={handleClearSuggestions}
          onMovieSelect={handleMovieSelect}
        />
      </header>

      <main className="movies-container">
        {error && (
          <div className="error-container">
            <div className="error-message" data-testid="error-message">
              <h2>⚠️ Error</h2>
              <p>{error}</p>
              {(error.includes('Request limit') || error.includes('unauthorized') || error.includes('API key')) && (
                <div className="error-details">
                  <p><strong>API Configuration Issue:</strong></p>
                  <p>The OMDB API key may be invalid, unauthorized, or the request limit has been reached.</p>
                  <p>Please check the API key in <code>src/services/omdbApi.ts</code> or try again later.</p>
                </div>
              )}
              <button className="retry-button" onClick={() => handleSearch(searchQuery || 'Batman')}>
                Retry
              </button>
            </div>
          </div>
        )}

        {!error && movies.length > 0 && (
          <div className="movies-grid">
            {movies.map((movie, index) => (
              <div
                key={`${movie.imdbID}-${index}`}
                ref={index === movies.length - 1 ? lastElementRef : null}
              >
                <MovieCard
                  movie={movie}
                  onPosterClick={handlePosterClick}
                  onCardClick={handleMovieSelect}
                />
              </div>
            ))}
          </div>
        )}

        {loading && (
          <div className="loading-spinner" data-testid="loading-spinner">
            <div className="spinner"></div>
            <p>Loading movies...</p>
          </div>
        )}

        {!loading && !error && movies.length === 0 && searchQuery && (
          <div className="no-results">
            <h2>No movies found</h2>
            <p>Try searching for a different title.</p>
          </div>
        )}
      </main>

      {selectedPoster && <PosterModal posterUrl={selectedPoster} onClose={handleCloseModal} />}
    </div>
  );
};
