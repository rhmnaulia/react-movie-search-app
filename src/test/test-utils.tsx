import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import movieReducer from '../features/movies/movieSlice';

export function renderWithProviders(
  ui: ReactElement,
  preloadedState?: any
) {
  const store = configureStore({
    reducer: { movies: movieReducer },
    ...(preloadedState && { preloadedState }),
  });

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <BrowserRouter>{children}</BrowserRouter>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper }) };
}
