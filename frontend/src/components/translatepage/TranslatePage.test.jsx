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
    const translateButton = screen.getByText('Translate');
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
    const translateButton = screen.getByText('Translate');
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

  // Mock the API post call for translation
  axios.post.mockImplementation((url) => {
    console.log('URL called:', url); // Add this to ensure the correct URL is called
    if (url === `${FLASK_URL}/translate`) {
      return Promise.resolve({
        data: {
          success: true,
          output: "print('Hello')",
        }
      });
    }
    return Promise.reject(new Error('not found'));
  });
  
  

});


//comment to push


