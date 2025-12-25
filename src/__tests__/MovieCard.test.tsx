import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MovieCard } from '../components/MovieCard';
import type { Movie } from '../types/movie';

describe('MovieCard', () => {
  const mockMovie: Movie = {
    imdbID: 'tt0372784',
    Title: 'Batman Begins',
    Year: '2005',
    Type: 'movie',
    Poster: 'https://example.com/poster.jpg',
  };

  const mockOnPosterClick = vi.fn();
  const mockOnCardClick = vi.fn();

  it('renders movie information correctly', () => {
    render(
      <MovieCard
        movie={mockMovie}
        onPosterClick={mockOnPosterClick}
        onCardClick={mockOnCardClick}
      />
    );

    expect(screen.getByText('Batman Begins')).toBeInTheDocument();
    expect(screen.getByText('2005')).toBeInTheDocument();
    expect(screen.getByText('movie')).toBeInTheDocument();
  });

  it('displays poster image when available', () => {
    render(
      <MovieCard
        movie={mockMovie}
        onPosterClick={mockOnPosterClick}
        onCardClick={mockOnCardClick}
      />
    );

    const poster = screen.getByTestId('movie-poster');
    expect(poster).toBeInTheDocument();
    expect(poster).toHaveAttribute('src', 'https://example.com/poster.jpg');
  });

  it('displays placeholder when poster is not available', () => {
    const movieWithoutPoster = { ...mockMovie, Poster: 'N/A' };
    render(
      <MovieCard
        movie={movieWithoutPoster}
        onPosterClick={mockOnPosterClick}
        onCardClick={mockOnCardClick}
      />
    );

    expect(screen.getByTestId('poster-placeholder')).toBeInTheDocument();
    expect(screen.getByText('No Image')).toBeInTheDocument();
  });

  it('calls onCardClick when card is clicked', () => {
    render(
      <MovieCard
        movie={mockMovie}
        onPosterClick={mockOnPosterClick}
        onCardClick={mockOnCardClick}
      />
    );

    fireEvent.click(screen.getByTestId('movie-card'));
    expect(mockOnCardClick).toHaveBeenCalledWith('tt0372784');
  });

  it('calls onPosterClick when poster is clicked', () => {
    render(
      <MovieCard
        movie={mockMovie}
        onPosterClick={mockOnPosterClick}
        onCardClick={mockOnCardClick}
      />
    );

    fireEvent.click(screen.getByTestId('movie-poster'));
    expect(mockOnPosterClick).toHaveBeenCalledWith('https://example.com/poster.jpg');
  });
});
