import { describe, it, expect } from 'vitest';
import movieReducer, {
  setSearchQuery,
  resetMovies,
  clearSuggestions,
  clearSelectedMovie,
} from '../features/movies/movieSlice';
import type { MovieState } from '../types/movie';

describe('movieSlice', () => {
  const initialState: MovieState = {
    movies: [],
    searchQuery: '',
    currentPage: 1,
    totalResults: 0,
    loading: false,
    error: null,
    hasMore: true,
    selectedMovie: null,
    suggestions: [],
  };

  it('should return the initial state', () => {
    expect(movieReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setSearchQuery', () => {
    const actual = movieReducer(initialState, setSearchQuery('Batman'));
    expect(actual.searchQuery).toEqual('Batman');
  });

  it('should handle resetMovies', () => {
    const stateWithMovies: MovieState = {
      ...initialState,
      movies: [
        {
          imdbID: 'tt0372784',
          Title: 'Batman Begins',
          Year: '2005',
          Type: 'movie',
          Poster: 'test.jpg',
        },
      ],
      currentPage: 2,
      hasMore: false,
      error: 'Some error',
    };

    const actual = movieReducer(stateWithMovies, resetMovies());
    expect(actual.movies).toEqual([]);
    expect(actual.currentPage).toEqual(1);
    expect(actual.hasMore).toEqual(true);
    expect(actual.error).toBeNull();
  });

  it('should handle clearSuggestions', () => {
    const stateWithSuggestions: MovieState = {
      ...initialState,
      suggestions: [
        {
          imdbID: 'tt0372784',
          Title: 'Batman Begins',
          Year: '2005',
          Type: 'movie',
          Poster: 'test.jpg',
        },
      ],
    };

    const actual = movieReducer(stateWithSuggestions, clearSuggestions());
    expect(actual.suggestions).toEqual([]);
  });

  it('should handle clearSelectedMovie', () => {
    const stateWithSelectedMovie: MovieState = {
      ...initialState,
      selectedMovie: {
        imdbID: 'tt0372784',
        Title: 'Batman Begins',
        Year: '2005',
        Type: 'movie',
        Poster: 'test.jpg',
        Rated: 'PG-13',
        Released: '15 Jun 2005',
        Runtime: '140 min',
        Genre: 'Action',
        Director: 'Christopher Nolan',
        Writer: 'Bob Kane',
        Actors: 'Christian Bale',
        Plot: 'Test plot',
        Language: 'English',
        Country: 'USA',
        Awards: 'Test awards',
        Ratings: [],
        Metascore: '70',
        imdbRating: '8.2',
        imdbVotes: '1,000,000',
        DVD: 'N/A',
        BoxOffice: '$100,000,000',
        Production: 'Warner Bros',
        Website: 'N/A',
        Response: 'True',
      },
    };

    const actual = movieReducer(stateWithSelectedMovie, clearSelectedMovie());
    expect(actual.selectedMovie).toBeNull();
  });
});
