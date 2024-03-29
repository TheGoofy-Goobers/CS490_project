import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './LoginPage';

describe('LoginPage Component', () => {
  test('submits login form with correct credentials', async () => {
    // Mock successful login response
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({ success: true, user_id: '123' })
    });

    //const { getByLabelText, getByText } = render(<LoginPage />);
    const { getByLabelText, getByText } = render(<Router><LoginPage /></Router>);

    fireEvent.change(getByLabelText('Username or Email:'), { target: { value: 'testuser' } });
    fireEvent.change(getByLabelText('Password:'), { target: { value: 'testpassword' } });
    fireEvent.click(getByText('Login'));

    await waitFor(() => {
      // Assert that user is logged in
      expect(sessionStorage.getItem('isLoggedIn')).toBe('true');
      expect(sessionStorage.getItem('userId')).toBe('123');
      expect(sessionStorage.getItem('sessionToken')).toBeDefined();
    });
  });

  test('displays error message with incorrect credentials', async () => {
    // Mock unsuccessful login response
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({ success: false })
    });

    const { getByLabelText, getByText } = render(<LoginPage />);

    fireEvent.change(getByLabelText('Username or Email:'), { target: { value: 'invaliduser' } });
    fireEvent.change(getByLabelText('Password:'), { target: { value: 'invalidpassword' } });
    fireEvent.click(getByText('Login'));

    await waitFor(() => {
      // Assert that user is not logged in and error message is displayed
      expect(sessionStorage.getItem('isLoggedIn')).toBeNull();
      expect(getByText('Invalid credentials. Please try again.')).toBeInTheDocument();
    });
  });

  test('logs user out', async () => {
    // Mock successful logout
    const sessionStorageSpy = jest.spyOn(window.sessionStorage.__proto__, 'clear');
    sessionStorageSpy.mockImplementation(() => {});

    const { getByText } = render(<LoginPage />);
    fireEvent.click(getByText('Logout'));

    // Assert that sessionStorage.clear() is called
    expect(sessionStorageSpy).toHaveBeenCalled();
  });
});

// despite configuring Jest and Babel according to best practices, the tests are still failing due to unexpected token errors
// reviewed Jest and Babel configurations, checked for syntax errors, verified dependencies, and attempted to clear the Jest cache
// unexpected token errors can occur due to configuration mismatches, incompatible versions, file path issues, or conflicts within the project setup
// 