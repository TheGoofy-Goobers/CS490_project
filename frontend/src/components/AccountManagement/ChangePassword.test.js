import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import ChangePassword from './ChangePassword';

// Mock axios and toastify
jest.mock('axios');
jest.mock('react-toastify', () => {
  const actualToast = jest.requireActual('react-toastify');
  return {
    ...actualToast,
    toast: jest.fn(),
  };
});

describe('ChangePassword Component', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    test('shows error when new passwords do not match', async () => {
      render(
        <Router>
          <ChangePassword />
        </Router>
      );
  
      fireEvent.change(screen.getByTestId('currentPassword'), { target: { value: 'OldPass123!' } });
      fireEvent.change(screen.getByTestId('newPassword'), { target: { value: 'NewPass123!' } });
      fireEvent.change(screen.getByTestId('confirmPassword'), { target: { value: 'NewPass1234!' } });
      fireEvent.click(screen.getByText('Submit'));
  
      await waitFor(() => {
        expect(toast).toHaveBeenCalledWith('New and confirmed are different. Change it to match!', {"autoClose": 2000, "className": "fail"});
      });
    });
  
    test('shows error when new password does not meet requirements', async () => {
      render(
        <Router>
          <ChangePassword />
        </Router>
      );
  
      fireEvent.change(screen.getByTestId('currentPassword'), { target: { value: 'OldPass123!' } });
      fireEvent.change(screen.getByTestId('newPassword'), { target: { value: 'NewPass123!' } });
      fireEvent.change(screen.getByTestId('confirmPassword'), { target: { value: 'NewPass1234!' } });
      fireEvent.click(screen.getByText('Submit'));
  
      await waitFor(() => {
        expect(toast).toHaveBeenCalledWith('Password must be at least 8 characters long, have a special character, and number.', expect.anything());
      });
    });
  
    test('successful password change', async () => {
      axios.post.mockResolvedValue({ data: { success: true } });
  
      render(
        <Router>
          <ChangePassword />
        </Router>
      );
  
      fireEvent.change(screen.getByTestId('currentPassword'), { target: { value: 'OldPass123!' } });
      fireEvent.change(screen.getByTestId('newPassword'), { target: { value: 'NewPass123!' } });
      fireEvent.change(screen.getByTestId('confirmPassword'), { target: { value: 'NewPass1234!' } });
      fireEvent.click(screen.getByText('Submit'));
  
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
        expect(toast).toHaveBeenCalledWith('Password changed successfuly!', expect.anything());
      });
    });
  
    test('API failure response handling', async () => {
      axios.post.mockRejectedValue(new Error('API Error'));
  
      render(
        <Router>
          <ChangePassword />
        </Router>
      );
  
      fireEvent.change(screen.getByTestId('currentPassword'), { target: { value: 'OldPass123!' } });
      fireEvent.change(screen.getByTestId('newPassword'), { target: { value: 'NewPass123!' } });
      fireEvent.change(screen.getByTestId('confirmPassword'), { target: { value: 'NewPass1234!' } });
      fireEvent.click(screen.getByText('Submit'));
  
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
        expect(toast).toHaveBeenCalledWith('BACKEND FAILED contact support', expect.anything());
      });
    });
  });
  