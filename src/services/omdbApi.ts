import axios from 'axios';
import type { SearchResponse, MovieDetail } from '../types/movie';

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_OMDB_API_URL || 'https://www.omdbapi.com';

// Use Cloudflare Worker proxy in production to avoid CORS issues
// In development, use direct API calls
const isProduction = import.meta.env.PROD;
const API_ENDPOINT = isProduction ? '/api' : BASE_URL;

// Validate that API key is configured (only for development)
if (!isProduction && !API_KEY) {
  throw new Error(
    'VITE_OMDB_API_KEY is not defined. Please create a .env file with your OMDB API key.'
  );
}

const apiClient = axios.create({
  baseURL: API_ENDPOINT,
  params: isProduction ? {} : {
    apikey: API_KEY,
  },
});

export const omdbApi = {
  searchMovies: async (query: string, page: number = 1): Promise<SearchResponse> => {
    const response = await apiClient.get<SearchResponse>('/', {
      params: {
        s: query,
        page,
      },
    });
    return response.data;
  },

  getMovieById: async (id: string): Promise<MovieDetail> => {
    const response = await apiClient.get<MovieDetail>('/', {
      params: {
        i: id,
        plot: 'full',
      },
    });
    return response.data;
  },

  getSuggestions: async (query: string): Promise<SearchResponse> => {
    const response = await apiClient.get<SearchResponse>('/', {
      params: {
        s: query,
        page: 1,
      },
    });
    return response.data;
  },
};
