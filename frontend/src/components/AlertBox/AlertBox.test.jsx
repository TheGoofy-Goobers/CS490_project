import React from 'react';
import { render, screen, act } from '@testing-library/react';
import AlertBox from './AlertBox'; // Adjust the import path as needed

describe('AlertBox', () => {
  jest.useFakeTimers();

  it('renders correctly when open', () => {
    render(<AlertBox message="test" isOpen={true} />);
    expect(screen.getByText("test")).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<AlertBox message="test" isOpen={false} />);
    expect(screen.queryByText("test")).toBeNull();
  });

  it('disappears after 2 seconds when open', () => {
    render(<AlertBox message="test" isOpen={true} />);

    act(() => {
      jest.advanceTimersByTime(2000); // Advance time by 2 seconds
    });

    expect(screen.queryByText("test")).toBeNull();
  });

  // Testing the different cases handled by handleResponse function
  const cases = [
    ['stop', 'Translation Success!!'],
    ['length', 'Unsuccessful Translation :((, input text is too long'],
    ['content_filter', 'Code content was flagged by openai content filters'],
    ['401', 'OpenAI API Authentication failed'],
    ['403', 'Country not supported with OpenAI'],
    ['429', 'Please wait you sent too many characters'],
    ['500', 'Unknown OpenAI server error'],
    ['503', 'OpenAI server is currently being overloaded, please before submitting again'],
    ['other', 'other']
  ];

  test.each(cases)(
    'displays correct response for message "%s"',
    (message, expectedResponse) => {
      render(<AlertBox message={message} isOpen={true} />);
      expect(screen.getByText((content) => content.trim() === expectedResponse.trim())).toBeInTheDocument();
    }
  );
});
