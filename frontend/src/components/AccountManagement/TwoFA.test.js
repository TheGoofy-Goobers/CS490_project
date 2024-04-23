import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import TwoFA from './TwoFA';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
    useNavigate: () => jest.fn()
}));

describe('TwoFA Component', () => {
    beforeEach(() => {
        localStorage.clear();
        jest.resetAllMocks();
    });

    it('renders password verification form when password is not verified', () => {
        localStorage.setItem('passIsVerified', 'false');
        render(<TwoFA />);
        expect(screen.getByText(/Verify Password/)).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    it('renders 2FA setup form when password is verified', () => {
        localStorage.setItem('passIsVerified', 'true');
        localStorage.setItem('qrCode', 'exampleQrCode');
        render(<TwoFA />);
        expect(screen.getByText(/Set up 2-factor authentication/)).toBeInTheDocument();
        expect(screen.getAllByRole('textbox').length).toBe(6);
    });

    it('submits password and receives a QR code', async () => {
        const mockResponse = { data: { success: true, qr: 'exampleQrCode' } };
        axios.post.mockResolvedValue(mockResponse);

        localStorage.setItem('passIsVerified', 'false');
        render(<TwoFA />);
        const passwordInput = screen.getByLabelText('Password');
        const submitButton = screen.getByRole('button', { name: 'Submit' });

        userEvent.type(passwordInput, 'correctPassword');
        userEvent.click(submitButton);

        await waitFor(() => expect(axios.post).toHaveBeenCalled());
        expect(screen.queryByText(/Verify Password/)).not.toBeInTheDocument();
    });

    it('handles 2FA code submission correctly', async () => {
        const mockResponse = { data: { success: true } };
        axios.post.mockResolvedValueOnce(mockResponse);

        localStorage.setItem('passIsVerified', 'true');
        render(<TwoFA />);

        const digitInputs = screen.getAllByRole('textbox');
        digitInputs.forEach((input, index) => {
            fireEvent.change(input, { target: { value: '1' } });
        });

        const submitButton = screen.getByRole('button', { name: 'Submit' });
        userEvent.click(submitButton);

        await waitFor(() => expect(axios.post).toHaveBeenCalled());
        expect(screen.queryByText(/2FA setup successful!/)).toBeInTheDocument();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
});
