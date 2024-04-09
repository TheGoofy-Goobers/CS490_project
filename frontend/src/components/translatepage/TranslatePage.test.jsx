import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TranslatePage from './TranslatePage'; // Adjust the import path as necessary
import axios from 'axios';
import { FLASK_URL } from '../../vars'

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
  // Adjust the mock implementation to check for the presence of required properties
  axios.post.mockImplementation((url, data) => {
    if (url === `${FLASK_URL}/translate` && data.text && data.srcLang && data.toLang && data.sessionToken) {
      // Check if the text to translate is the specific JavaScript function we expect
      if (data.text.includes('function add(a, b)')) {
        return Promise.resolve({
          data: {
            success: true,
            output: 'def add(a, b):\n    return a + b', // Simulated translation output
            finish_reason: 'completed'
          }
        });
      }
    }
    return Promise.resolve({ data: {} }); // Fallback for any other calls
  });
});

beforeAll(() => {
  // Mock the window.location.assign with a jest function
  delete window.location;
  window.location = { assign: jest.fn() };
});

// Reset the clipboard mock before each test with improved setup
beforeEach(() => {
  axios.get.mockResolvedValue({ data: { code: 200, reason: 'OK' } });
  Object.assign(navigator, {
    clipboard: {
      writeText: jest.fn().mockResolvedValue(), // Ensure it returns a resolved promise for chaining `.then()`
    },
  });
});

beforeEach(() => {
  Storage.prototype.getItem = jest.fn(() => "true"); // Adjust the returned value as needed for your tests
});

beforeEach(() => {
  // Mock both axios.get and axios.post calls
  axios.get.mockResolvedValue({ data: { code: 200, reason: 'OK' } });
  axios.post.mockResolvedValue({
    data: [] // Mock response for post requests, adjust according to what your component expects
  });

  // Mock navigator.clipboard.writeText
  Object.assign(navigator, {
    clipboard: {
      writeText: jest.fn().mockResolvedValue(),
    },
  });

  // Mock localStorage.getItem
  Storage.prototype.getItem = jest.fn(() => "true");
});

// Mock for react-codemirror2
jest.mock('react-codemirror2', () => ({
  UnControlled: ({ value, onChange, options }) => {
    const handleChange = (event) => onChange({ getValue: () => event.target.value });
    return <textarea value={value} onChange={handleChange} readOnly={options.readOnly} data-testid={options.readOnly ? 'mockedCodeMirrorOutput' : 'mockedCodeMirrorInput'} />;
  },
}));


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
    const inputCodeMirror = screen.getByTestId('mockedCodeMirrorInput');
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
    const inputCodeMirror = screen.getByTestId('mockedCodeMirrorInput');
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
    const inputCodeMirror = screen.getByTestId('mockedCodeMirrorInput');
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

  
});
//test

