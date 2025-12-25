import { useEffect } from 'react';
import './PosterModal.css';

interface PosterModalProps {
  posterUrl: string;
  onClose: () => void;
}

export const PosterModal = ({ posterUrl, onClose }: PosterModalProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose} data-testid="modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} data-testid="modal-close">
          ×
        </button>
        <img src={posterUrl} alt="Movie Poster" className="modal-poster" data-testid="modal-poster" />
      </div>
    </div>
  );
};
