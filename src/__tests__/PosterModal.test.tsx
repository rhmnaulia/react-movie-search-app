import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PosterModal } from '../components/PosterModal';

describe('PosterModal', () => {
  const mockOnClose = vi.fn();
  const mockPosterUrl = 'https://example.com/poster.jpg';

  it('renders modal with poster image', () => {
    render(<PosterModal posterUrl={mockPosterUrl} onClose={mockOnClose} />);

    expect(screen.getByTestId('modal-overlay')).toBeInTheDocument();
    expect(screen.getByTestId('modal-poster')).toBeInTheDocument();
    expect(screen.getByTestId('modal-poster')).toHaveAttribute('src', mockPosterUrl);
  });

  it('calls onClose when overlay is clicked', () => {
    render(<PosterModal posterUrl={mockPosterUrl} onClose={mockOnClose} />);

    fireEvent.click(screen.getByTestId('modal-overlay'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onClose when close button is clicked', () => {
    render(<PosterModal posterUrl={mockPosterUrl} onClose={mockOnClose} />);

    fireEvent.click(screen.getByTestId('modal-close'));
    expect(mockOnClose).toHaveBeenCalled();
  });

});
