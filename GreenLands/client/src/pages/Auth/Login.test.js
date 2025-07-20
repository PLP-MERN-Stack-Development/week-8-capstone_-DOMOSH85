import React from 'react';
import { render, screen } from '@testing-library/react';
import Login from './Login';

describe('Login', () => {
  it('renders the login form', () => {
    render(<Login />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });
}); 