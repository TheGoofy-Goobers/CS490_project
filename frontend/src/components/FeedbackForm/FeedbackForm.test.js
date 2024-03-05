import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import FeedbackForm from './FeedbackForm';

jest.mock('axios');

describe('FeedbackForm Component', () => {
  test('submits feedback form with correct data', async () => {
    const mockResponse = { data: { success: true } };
    axios.post.mockResolvedValueOnce(mockResponse);

    const { getByText, getByLabelText } = render(<FeedbackForm />);

    // Fill in the feedback form
    fireEvent.change(getByLabelText('question1'), { target: { value: '5' } });
    fireEvent.change(getByLabelText('question2'), { target: { value: '4' } });
    fireEvent.change(getByLabelText('question3'), { target: { value: '3' } });
    fireEvent.change(getByLabelText('question4'), { target: { value: '2' } });
    fireEvent.change(getByLabelText('Other:'), { target: { value: 'Test feedback message' } });

    // Submit the feedback form
    fireEvent.click(getByText('Submit'));

    // Wait for the form submission
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(`${FLASK_URL}/submitFeedback`, {
        user_id: parseInt(sessionStorage.getItem("userId")),
        precision_rating: 5,
        ease_rating: 4,
        speed_rating: 3,
        future_use_rating: 2,
        note: 'Test feedback message'
      });
      expect(axios.post).toHaveBeenCalledTimes(1);
    });
  });

  test('limits character count for open-ended feedback', () => {
    const { getByLabelText, getByText } = render(<FeedbackForm />);

    const openEndedTextarea = getByLabelText('Other:');
    fireEvent.change(openEndedTextarea, { target: { value: 'a'.repeat(400) } });

    expect(openEndedTextarea.value.length).toBeLessThanOrEqual(300);
    expect(getByText('Character Count: 300/300')).toBeInTheDocument();
  });

  // Add more tests for rating change and other scenarios as needed
});
