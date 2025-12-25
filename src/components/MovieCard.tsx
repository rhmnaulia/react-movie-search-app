import { useState } from 'react';
import type { Movie } from '../types/movie';
import './MovieCard.css';

interface MovieCardProps {
  movie: Movie;
  onPosterClick: (posterUrl: string) => void;
  onCardClick: (id: string) => void;
}

export const MovieCard = ({ movie, onPosterClick, onCardClick }: MovieCardProps) => {
  const [imageError, setImageError] = useState(false);

  const handlePosterClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (movie.Poster !== 'N/A' && !imageError) {
      onPosterClick(movie.Poster);
    }
  };

  const handleCardClick = () => {
    onCardClick(movie.imdbID);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="movie-card" onClick={handleCardClick} data-testid="movie-card">
      <div className="movie-poster-container" onClick={handlePosterClick}>
        {movie.Poster !== 'N/A' && !imageError ? (
          <img
            src={movie.Poster}
            alt={movie.Title}
            className="movie-poster"
            onError={handleImageError}
            data-testid="movie-poster"
          />
        ) : (
          <div className="movie-poster-placeholder" data-testid="poster-placeholder">
            No Image
          </div>
        )}
      </div>
      <div className="movie-info">
        <h3 className="movie-title">{movie.Title}</h3>
        <p className="movie-year">{movie.Year}</p>
        <p className="movie-type">{movie.Type}</p>
      </div>
    </div>
  );
};
