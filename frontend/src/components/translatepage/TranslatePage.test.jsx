import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TranslatePage from './TranslatePage';
import axios from 'axios';
import { FLASK_URL } from '../../vars';

// Mock Axios
jest.mock('axios');

// Mock for getBoundingClientRect
beforeAll(() => {
  Element.prototype.getBoundingClientRect = jest.fn(() => ({
    width: 100,
    height: 100,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  }));
});

beforeEach(() => {
  jest.clearAllMocks();
  axios.post.mockImplementation((url, data) => {
    if (url === `${FLASK_URL}/translate` && data.text && data.srcLang && data.toLang && data.sessionToken) {
      if (data.text.includes('function add(a, b)')) {
        return Promise.resolve({
          data: {
            success: true,
            output: 'def add(a, b):\n    return a + b',
            finish_reason: 'completed'
          }
        });
      }
    }
    return Promise.resolve({ data: {} });
  });
});

beforeAll(() => {
  delete window.location;
  window.location = { assign: jest.fn() };
});

beforeEach(() => {
  axios.get.mockResolvedValue({ data: { code: 200, reason: 'OK' } });
  Object.assign(navigator, {
    clipboard: {
      writeText: jest.fn().mockResolvedValue(),
    },
  });
});

beforeEach(() => {
  Storage.prototype.getItem = jest.fn(() => "true");
});

jest.mock('@uiw/react-codemirror', () => {
  const { useState } = require('react');
  return {
    __esModule: true,
    default: ({ value, onChange, testIdSuffix }) => {
      const [localValue, setLocalValue] = useState(value);
      
      function handleChange(event) {
        const newValue = event.target.value;
        setLocalValue(newValue); // Update local state
        onChange({ getValue: () => newValue });
      }
      
      return (
        <textarea
          value={localValue}
          onChange={handleChange}
          data-testid={`codemirror-input-${testIdSuffix}`}
        />
      );
    },
  };
});







describe('TranslatePage Component', () => {
  test('renders correctly', () => {
    render(<TranslatePage />);
    expect(screen.getByText('Input')).toBeInTheDocument();
    expect(screen.getByText('Output')).toBeInTheDocument();
    expect(screen.getByText('Source Language')).toBeInTheDocument();
    expect(screen.getByText('Target Language')).toBeInTheDocument();
  });
  

  test('copies text to clipboard', async () => {
    render(<TranslatePage />);
    fireEvent.click(screen.getByTitle('Copy to Clipboard'));
    await waitFor(() => expect(navigator.clipboard.writeText).toHaveBeenCalled());
  });

  test('downloads the code', () => {
    global.URL.createObjectURL = jest.fn();
    global.URL.revokeObjectURL = jest.fn();
    render(<TranslatePage />);
    const translateButton = screen.getByText('Get Translation');
    fireEvent.click(translateButton);
    const downloadButton = screen.getByTitle('Download Code');
    fireEvent.click(downloadButton);
    expect(global.URL.createObjectURL).toHaveBeenCalled();
    global.URL.createObjectURL.mockRestore();
    global.URL.revokeObjectURL.mockRestore();
  });

  test('allows code input and language selection', async () => {
    render(<TranslatePage />);
    const inputCodeMirror = screen.getByTestId('codemirror-input-input');
    fireEvent.change(inputCodeMirror, { target: { value: 'function test() {}' } });
    expect(inputCodeMirror.value).toBe('function test() {}');
  
    // Use getByLabelText to target the select elements directly by their associated labels.
    const sourceLanguageSelect = screen.getByLabelText('Source Language');
    fireEvent.change(sourceLanguageSelect, { target: { value: 'Python' } });
    expect(sourceLanguageSelect.value).toBe('Python');
  
    const targetLanguageSelect = screen.getByLabelText('Target Language');
    fireEvent.change(targetLanguageSelect, { target: { value: 'C++' } });
    expect(targetLanguageSelect.value).toBe('C++');
  });

  test('validates language selection and code input', async () => {
    render(<TranslatePage />);
    const inputCodeMirror = screen.getByTestId('codemirror-input-input');
    fireEvent.change(inputCodeMirror, { target: { value: 'console.log("Hello World");' } });
    expect(inputCodeMirror.value).toBe('console.log("Hello World");');
    const translateButton = screen.getByText('Get Translation');
    fireEvent.click(translateButton);
  });

  const longText = `This is a very long text. `.repeat(50);

  test('downloads long text as a file', () => {
    global.URL.createObjectURL = jest.fn();
    global.URL.revokeObjectURL = jest.fn();
    render(<TranslatePage />);
    const inputCodeMirror = screen.getByTestId('codemirror-input-input');
    fireEvent.change(inputCodeMirror, { target: { value: longText } });
    const downloadButton = screen.getByTitle('Download Code');
    fireEvent.click(downloadButton);
    expect(global.URL.createObjectURL).toHaveBeenCalled();
    global.URL.createObjectURL.mockRestore();
    global.URL.revokeObjectURL.mockRestore();
  });

  test('triggers file input when upload button is clicked', () => {
    render(<TranslatePage />);
    const fileInput = screen.getByTestId('fileInput');
    const clickSpy = jest.spyOn(fileInput, 'click');
    const uploadButton = screen.getByTitle('Upload File');
    fireEvent.click(uploadButton);
    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
  });

  

  test('filters translation history by date and language', async () => {
    // Arrange
    const historyData = [
      {
        original_code: 'console.log("Hello, world!");',
        translated_code: 'print("Hello, world!")',
        source_language: 'JavaScript',
        target_language: 'Python',
        submission_date: new Date().toISOString() // Assuming the date is today
      },
      // ... additional history data if needed for a more comprehensive test
    ];
  
    axios.get.mockResolvedValueOnce({ data: historyData });
  
    // Act
    render(<TranslatePage />);
    fireEvent.click(screen.getByTestId('history-button')); // Open the history sidebar
  
    // Assert 'Today' section is present after the initial render
    let todaySection = await screen.findByText('Today');
    expect(todaySection).toBeInTheDocument();
  
    // Select 'Today' from the date filter dropdown
    const dateFilterDropdown = screen.getByLabelText('Date:');
    fireEvent.change(dateFilterDropdown, { target: { value: 'Today' } });
  
    // Assert 'Today' section is still present after applying 'Today' filter
    todaySection = await screen.findByText('Today');
    expect(todaySection).toBeInTheDocument();
  
  });

  test('filters translation history by source language', async () => {
    // Arrange
    const historyData = [
      {
        original_code: 'console.log("Hello, world!");',
        translated_code: 'print("Hello, world!")',
        source_language: 'JavaScript',
        target_language: 'Python',
        submission_date: new Date().toISOString() // Assuming the date is today
      },
      // ...additional history data if needed for a more comprehensive test
    ];
  
    axios.get.mockResolvedValueOnce({ data: historyData });

    // Act
    render(<TranslatePage />);

    // Open the history sidebar to make the filter controls visible
    fireEvent.click(screen.getByTestId('history-button'));

    // Select 'JavaScript' from the source language filter dropdown
    const sourceLanguageFilterDropdown = screen.getByLabelText('Source Language:');
    fireEvent.change(sourceLanguageFilterDropdown, { target: { value: 'JavaScript' } });

    // Wait for filter application by checking that items for 'JavaScript' are present
    await waitFor(() => {
      const sourceLanguageItems = screen.getAllByText(/JavaScript/);
      expect(sourceLanguageItems.length).toBeGreaterThan(0); // Check there's at least one 'JavaScript' item
    });

  
  });

  test('filters translation history by target language', async () => {
    // Arrange
    const historyData = [
      {
        original_code: 'console.log("Hello, world!");',
        translated_code: 'print("Hello, world!")',
        source_language: 'JavaScript',
        target_language: 'Python',
        submission_date: new Date().toISOString() // Assuming the date is today
      },
      // ...additional history data if needed for a more comprehensive test
    ];
  
    axios.get.mockResolvedValueOnce({ data: historyData });
  
    // Act
    render(<TranslatePage />);
  
    // Open the history sidebar to make the filter controls visible
    fireEvent.click(screen.getByTestId('history-button'));
  
    // Select 'Python' from the target language filter dropdown
    const targetLanguageFilterDropdown = screen.getByLabelText('Target Language:');
    fireEvent.change(targetLanguageFilterDropdown, { target: { value: 'Python' } });
  
    // Wait for filter application by checking that items for 'Python' are present
    await waitFor(() => {
      const targetLanguageItems = screen.getAllByText(/Python/);
      expect(targetLanguageItems.length).toBeGreaterThan(0); // Check there's at least one 'Python' item
    });
  });

  describe('TranslatePage - Deletion Tests', () => {
    beforeEach(() => {
      jest.clearAllMocks(); // Clear mocks before each test
    });
  
    test('deletes a single translation from history', async () => {
      // Arrange: Mock data for the test
      const historyData = [
        {
          translation_id: 1,
          original_code: 'console.log("Hello, world!");',
          translated_code: 'print("Hello, world!")',
          source_language: 'JavaScript',
          target_language: 'Python',
          submission_date: new Date().toISOString(),
        },
        {
          translation_id: 2,
          original_code: 'console.log("Another code snippet");',
          translated_code: 'print("Another code snippet")',
          source_language: 'JavaScript',
          target_language: 'Python',
          submission_date: new Date().toISOString(),
        },
      ];
  
      // Mock the axios response to simulate initial history data
      axios.post.mockResolvedValueOnce({ data: { success: true, rows: historyData } });
  
      // Act: Render the component and open the sidebar
      render(<TranslatePage />);
      fireEvent.click(screen.getByTestId('history-button')); // Open the sidebar
  
      // Delete the first item and re-check
      const deleteIcons = await screen.findAllByTestId(/^delete-button-/); // Corrected identifier
      fireEvent.click(deleteIcons[0]); // Delete the first translation
      render(<TranslatePage />); // Refresh
  
      // Re-open the sidebar after refresh and check that the deleted item is gone
      fireEvent.click(screen.getByTestId('history-button')); // Re-open the sidebar
      await waitFor(() => {
        const deletedItem = screen.queryByText('Hello, world!'); // Ensure the deleted item is gone
        expect(deletedItem).toBeNull(); // Confirm it's deleted
      });
  
      // Ensure that the second item still exists
      const remainingItem = await screen.findByText('Another code snippet'); // Confirm the existing item still exists
      expect(remainingItem).toBeInTheDocument();
    });
  
    test('clears all translation history', async () => {
      // Arrange: Mock data for the test
      const historyData = [
        {
          translation_id: 1,
          original_code: 'console.log("Hello, world!");',
          translated_code: 'print("Hello, world!")',
          source_language: 'JavaScript',
          target_language: 'Python',
          submission_date: new Date().toISOString(),
        },
        {
          translation_id: 2,
          original_code: 'console.log("Another code snippet");',
          translated_code: 'print("Another code snippet")',
          source_language: 'JavaScript',
          target_language: 'Python',
          submission_date: new Date().toISOString(),
        },
      ];
  
      // Mock the axios response to simulate initial history data
      axios.post.mockResolvedValueOnce({ data: { success: true, rows: historyData } });
  
      // Act: Render the component and open the sidebar
      render(<TranslatePage />);
      fireEvent.click(screen.getByTestId('history-button')); // Open the sidebar
  
      // Click the "Clear Translation History" icon
      const clearAllIcon = await screen.findByTestId(/^clear-all-icon$/); // Locate the clear-all icon
      fireEvent.click(clearAllIcon); // Click to clear all translations
  
      // Refresh and re-open the sidebar to check the history is empty
      render(<TranslatePage />); // Refresh after clearing all translations
      fireEvent.click(screen.getByTestId('history-button')); // Re-open the sidebar after refresh
  
      // Wait for the history to be cleared
      await waitFor(() => {
        const historyItems = screen.queryAllByTestId(/^history-item-/); // No history items should remain
        expect(historyItems.length).tobe(0); // Confirm history is empty
      });
    });
  });
  
  

  
});
//test

