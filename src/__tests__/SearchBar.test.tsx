import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SearchBar } from '../components/SearchBar';
import type { Movie } from '../types/movie';

describe('SearchBar', () => {
  const mockOnSearch = vi.fn();
  const mockOnSuggestionsFetch = vi.fn();
  const mockOnClearSuggestions = vi.fn();
  const mockOnMovieSelect = vi.fn();

  const mockSuggestions: Movie[] = [
    {
      imdbID: 'tt0372784',
      Title: 'Batman Begins',
      Year: '2005',
      Type: 'movie',
      Poster: 'https://example.com/poster.jpg',
    },
  ];

  it('renders search input and button', () => {
    render(
      <SearchBar
        onSearch={mockOnSearch}
        onSuggestionsFetch={mockOnSuggestionsFetch}
        suggestions={[]}
        onClearSuggestions={mockOnClearSuggestions}
        onMovieSelect={mockOnMovieSelect}
      />
    );

    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('search-button')).toBeInTheDocument();
  });

  it('calls onSearch when form is submitted', () => {
    render(
      <SearchBar
        onSearch={mockOnSearch}
        onSuggestionsFetch={mockOnSuggestionsFetch}
        suggestions={[]}
        onClearSuggestions={mockOnClearSuggestions}
        onMovieSelect={mockOnMovieSelect}
      />
    );

    const input = screen.getByTestId('search-input');
    fireEvent.change(input, { target: { value: 'Batman' } });
    fireEvent.click(screen.getByTestId('search-button'));

    expect(mockOnSearch).toHaveBeenCalledWith('Batman');
  });

  it('fetches suggestions after debounce delay', async () => {
    render(
      <SearchBar
        onSearch={mockOnSearch}
        onSuggestionsFetch={mockOnSuggestionsFetch}
        suggestions={[]}
        onClearSuggestions={mockOnClearSuggestions}
        onMovieSelect={mockOnMovieSelect}
      />
    );

    const input = screen.getByTestId('search-input');
    fireEvent.change(input, { target: { value: 'Batman' } });

    await waitFor(
      () => {
        expect(mockOnSuggestionsFetch).toHaveBeenCalledWith('Batman');
      },
      { timeout: 500 }
    );
  });

  it('displays suggestions when available', async () => {
    render(
      <SearchBar
        onSearch={mockOnSearch}
        onSuggestionsFetch={mockOnSuggestionsFetch}
        suggestions={mockSuggestions}
        onClearSuggestions={mockOnClearSuggestions}
        onMovieSelect={mockOnMovieSelect}
      />
    );

    const input = screen.getByTestId('search-input');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Bat' } });

    await waitFor(() => {
      expect(screen.getByTestId('suggestions-dropdown')).toBeInTheDocument();
    });
    expect(screen.getByText('Batman Begins')).toBeInTheDocument();
  });

  it('calls onMovieSelect when suggestion is clicked', async () => {
    render(
      <SearchBar
        onSearch={mockOnSearch}
        onSuggestionsFetch={mockOnSuggestionsFetch}
        suggestions={mockSuggestions}
        onClearSuggestions={mockOnClearSuggestions}
        onMovieSelect={mockOnMovieSelect}
      />
    );

    const input = screen.getByTestId('search-input');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Bat' } });

    const suggestionItem = await screen.findByTestId('suggestion-item');
    fireEvent.click(suggestionItem);

    expect(mockOnMovieSelect).toHaveBeenCalledWith('tt0372784');
  });
});
