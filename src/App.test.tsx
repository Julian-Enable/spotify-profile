import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login page on initial load', () => {
  render(<App />);
  const loginButton = screen.getByText(/Conectar con Spotify/i);
  expect(loginButton).toBeInTheDocument();
});
