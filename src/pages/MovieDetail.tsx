import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { fetchMovieDetails, clearSelectedMovie } from '../features/movies/movieSlice';
import { PosterModal } from '../components/PosterModal';
import './MovieDetail.css';

export const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedMovie, loading, error } = useAppSelector((state) => state.movies);
  const [selectedPoster, setSelectedPoster] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  // Fetch movie details and cleanup on unmount
  useEffect(() => {
    if (id) {
      dispatch(fetchMovieDetails(id));
    }
    return () => {
      dispatch(clearSelectedMovie());
    };
  }, [id, dispatch]);

  const handleBackClick = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handlePosterClick = useCallback(() => {
    if (selectedMovie?.Poster && selectedMovie.Poster !== 'N/A' && !imageError) {
      setSelectedPoster(selectedMovie.Poster);
    }
  }, [selectedMovie, imageError]);

  const handleCloseModal = useCallback(() => {
    setSelectedPoster(null);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  if (loading) {
    return (
      <div className="movie-detail-page">
        <div className="loading-spinner" data-testid="loading-spinner">
          <div className="spinner"></div>
          <p>Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (error || !selectedMovie) {
    return (
      <div className="movie-detail-page">
        <button className="back-button" onClick={handleBackClick} data-testid="back-button">
          ← Back to Search
        </button>
        <div className="error-container">
          <div className="error-message" data-testid="error-message">
            <h2>⚠️ Error</h2>
            <p>{error || 'Movie not found'}</p>
            {error?.includes('Request limit') && (
              <div className="error-details">
                <p>The OMDB API request limit has been reached.</p>
                <p>Please try again later or contact support for an upgraded API key.</p>
              </div>
            )}
            <button className="retry-button" onClick={handleBackClick}>
              Back to Search
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="movie-detail-page">
      <button className="back-button" onClick={handleBackClick} data-testid="back-button">
        ← Back to Search
      </button>

      <div className="movie-detail-container">
        <div className="poster-section">
          {selectedMovie.Poster !== 'N/A' && !imageError ? (
            <img
              src={selectedMovie.Poster}
              alt={selectedMovie.Title}
              className="detail-poster"
              onClick={handlePosterClick}
              onError={handleImageError}
              data-testid="detail-poster"
            />
          ) : (
            <div className="detail-poster-placeholder">No Image</div>
          )}
        </div>

        <div className="info-section">
          <h1 className="detail-title">{selectedMovie.Title}</h1>

          <div className="detail-meta">
            <span className="meta-item">{selectedMovie.Year}</span>
            <span className="meta-divider">•</span>
            <span className="meta-item">{selectedMovie.Rated}</span>
            <span className="meta-divider">•</span>
            <span className="meta-item">{selectedMovie.Runtime}</span>
          </div>

          <div className="detail-genre">{selectedMovie.Genre}</div>

          <div className="detail-plot">
            <h2>Plot</h2>
            <p>{selectedMovie.Plot}</p>
          </div>

          <div className="detail-info-grid">
            <div className="info-item">
              <strong>Director:</strong>
              <span>{selectedMovie.Director}</span>
            </div>
            <div className="info-item">
              <strong>Writers:</strong>
              <span>{selectedMovie.Writer}</span>
            </div>
            <div className="info-item">
              <strong>Cast:</strong>
              <span>{selectedMovie.Actors}</span>
            </div>
            <div className="info-item">
              <strong>Language:</strong>
              <span>{selectedMovie.Language}</span>
            </div>
            <div className="info-item">
              <strong>Country:</strong>
              <span>{selectedMovie.Country}</span>
            </div>
            <div className="info-item">
              <strong>Awards:</strong>
              <span>{selectedMovie.Awards}</span>
            </div>
          </div>

          {selectedMovie.Ratings && selectedMovie.Ratings.length > 0 && (
            <div className="ratings-section">
              <h2>Ratings</h2>
              <div className="ratings-grid">
                {selectedMovie.Ratings.map((rating, index) => (
                  <div key={index} className="rating-item">
                    <strong>{rating.Source}</strong>
                    <span>{rating.Value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedMovie.BoxOffice && selectedMovie.BoxOffice !== 'N/A' && (
            <div className="box-office">
              <strong>Box Office:</strong> {selectedMovie.BoxOffice}
            </div>
          )}
        </div>
      </div>

      {selectedPoster && <PosterModal posterUrl={selectedPoster} onClose={handleCloseModal} />}
    </div>
  );
};
