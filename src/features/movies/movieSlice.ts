import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { MovieState } from '../../types/movie';
import { omdbApi } from '../../services/omdbApi';

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

export const searchMovies = createAsyncThunk(
  'movies/search',
  async ({ query, page }: { query: string; page: number }, { rejectWithValue }) => {
    try {
      const response = await omdbApi.searchMovies(query, page);
      if (response.Response === 'False') {
        if (response.Error?.includes('Request limit')) {
          return rejectWithValue('API Request limit reached! Please try again later.');
        }
        return rejectWithValue(response.Error || 'No movies found');
      }
      return {
        movies: response.Search,
        totalResults: parseInt(response.totalResults, 10),
        page,
      };
    } catch (error: unknown) {
      // Type guard for axios errors
      if (error && typeof error === 'object') {
        const axiosError = error as {
          response?: { status?: number; data?: { Error?: string } };
          message?: string;
        };

        // Handle 401 Unauthorized
        if (axiosError.response?.status === 401) {
          return rejectWithValue('API key is invalid or unauthorized. Please check your API key.');
        }
        // Handle other response errors
        if (axiosError.response?.data?.Error) {
          return rejectWithValue(axiosError.response.data.Error);
        }
        // Handle network errors
        if (axiosError.message) {
          return rejectWithValue(`Network error: ${axiosError.message}`);
        }
      }
      return rejectWithValue('Failed to fetch movies. Please check your connection.');
    }
  }
);

export const fetchMovieDetails = createAsyncThunk(
  'movies/fetchDetails',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await omdbApi.getMovieById(id);
      if (response.Response === 'False') {
        return rejectWithValue('Movie not found');
      }
      return response;
    } catch {
      return rejectWithValue('Failed to fetch movie details');
    }
  }
);

export const fetchSuggestions = createAsyncThunk(
  'movies/fetchSuggestions',
  async (query: string) => {
    try {
      if (query.length < 2) {
        return [];
      }
      const response = await omdbApi.getSuggestions(query);
      if (response.Response === 'False') {
        return [];
      }
      return response.Search.slice(0, 5);
    } catch {
      return [];
    }
  }
);

const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    resetMovies: (state) => {
      state.movies = [];
      state.currentPage = 1;
      state.hasMore = true;
      state.error = null;
    },
    clearSuggestions: (state) => {
      state.suggestions = [];
    },
    clearSelectedMovie: (state) => {
      state.selectedMovie = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchMovies.fulfilled, (state, action) => {
        state.loading = false;
        const { movies, totalResults, page } = action.payload;

        if (page === 1) {
          state.movies = movies;
        } else {
          state.movies = [...state.movies, ...movies];
        }

        state.totalResults = totalResults;
        state.currentPage = page;
        state.hasMore = state.movies.length < totalResults;
      })
      .addCase(searchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.hasMore = false;
      })
      .addCase(fetchMovieDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovieDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedMovie = action.payload;
      })
      .addCase(fetchMovieDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchSuggestions.fulfilled, (state, action) => {
        state.suggestions = action.payload;
      });
  },
});

export const { setSearchQuery, resetMovies, clearSuggestions, clearSelectedMovie } = movieSlice.actions;
export default movieSlice.reducer;
