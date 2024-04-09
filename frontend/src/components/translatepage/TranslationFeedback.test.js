import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import TranslationFeedback from './TranslationFeedback'; // Update the import path as necessary

jest.mock('axios');

// Mock localStorage
const mockLocalStorage = (() => {
    let store = {};
    return {
        getItem: key => store[key] || null,
        setItem: (key, value) => {
            store[key] = value.toString();
        },
        clear: () => {
            store = {};
        }
    };
})();

beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorage,
        writable: true
    });
    mockLocalStorage.setItem("sessionToken", "12345");

    // Mock window.alert
    window.alert = jest.fn();
});

afterEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
});

describe('TranslationFeedback component', () => {
    test('renders correctly', () => {
        render(<TranslationFeedback />);
        expect(screen.getByText(/Rate Translation:/i)).toBeInTheDocument();
    });

    test('clicking star updates rating', () => {
        render(<TranslationFeedback />);
        const firstStar = screen.getAllByText('☆')[0];
        fireEvent.click(firstStar);
        expect(screen.getAllByText('★').length).toBe(1);
    });

    test('handles textarea input', () => {
        render(<TranslationFeedback />);
        const textarea = screen.getByPlaceholderText(/Type here/i);
        fireEvent.change(textarea, { target: { value: 'Great job!' } });
        expect(textarea).toHaveValue('Great job!');
    });

    test('submits form and sends post request', async () => {
        axios.post.mockResolvedValue({ data: { success: true } });
        render(<TranslationFeedback />);

        // Simulate clicking on the first star
        const firstStar = screen.getAllByText('☆')[0];
        fireEvent.click(firstStar);

        // Simulate form submission
        const submitButton = screen.getByText(/Submit/i);
        fireEvent.click(submitButton);

        // Assert the expected behavior and data sent in the POST request
        expect(axios.post).toHaveBeenCalled();
        expect(axios.post).toHaveBeenCalledWith(expect.stringContaining("/translationFeedback"), {
            sessionToken: "12345",
            star_rating: 1, // Because we clicked the first star
            note: '' // Because we haven't typed anything in the textarea
        });
    });
});
