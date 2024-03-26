import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RegistrationPage from './RegistrationPage'; // Assuming this is the component you want to test

describe('Registration Form', () => {
  test('validates email format', async () => {
    render(<RegistrationPage />);
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalidemail' } });
    fireEvent.submit(screen.getByRole('button', { name: /register/i }));
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  test('validates password strength', async () => {
    render(<RegistrationPage />);
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(passwordInput, { target: { value: 'weak' } });
    fireEvent.submit(screen.getByRole('button', { name: /register/i }));
    await waitFor(() => {
      expect(screen.getByText(/password must be at least 8 characters long/i)).toBeInTheDocument();
    });
  });

  test('matches password confirmation', async () => {
    render(<RegistrationPage />);
    const passwordInput = screen.getByLabelText(/password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } });
    fireEvent.submit(screen.getByRole('button', { name: /register/i }));
    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  test('handles successful registration', async () => {
    // Mock axios post to simulate successful registration
    jest.mock('axios', () => ({
      post: jest.fn(() => Promise.resolve({ data: { success: true, user_id: 123 } })),
    }));

    render(<RegistrationPage />);
    fireEvent.submit(screen.getByRole('button', { name: /register/i }));
    await waitFor(() => {
      expect(screen.getByText(/registration success/i)).toBeInTheDocument();
    });
  });

  test('handles failed registration', async () => {
    // Mock axios post to simulate failed registration
    jest.mock('axios', () => ({
      post: jest.fn(() => Promise.resolve({ data: { success: false, errorMessage: 'Registration failed' } })),
    }));

    render(<RegistrationPage />);
    fireEvent.submit(screen.getByRole('button', { name: /register/i }));
    await waitFor(() => {
      expect(screen.getByText(/registration failed/i)).toBeInTheDocument();
    });
  });
});
