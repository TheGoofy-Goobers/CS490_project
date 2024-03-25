import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import axios from 'axios';
import Help from './Help';

jest.mock('axios');

describe('Help Component', () => {
  test('search functionality', async () => {
    const { getByPlaceholderText, getByText } = render(<Help />);

    // Enter a search query
    const searchInput = getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'Your search query' } });

    // Assert that search results are displayed
    expect(queryByText(/Search/i)).toBeInTheDocument(); // Use a regular expression to match part of the text
  });


  
  test('link accessibility', async () => {
    const { getByText } = render(<Help />);

    // Click on each link and assert it does not throw an error
    const links = getByText(/Resources/i).parentElement.getElementsByTagName('a');
    Array.from(links).forEach(link => {
      fireEvent.click(link);
      expect(global.window.location.href).toBe(link.href);
    });
  });

});
