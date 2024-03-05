import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TranslatePage from './TranslatePage'; // Adjust the import path as necessary


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

// Reset the clipboard mock before each test with improved setup
beforeEach(() => {
  Object.assign(navigator, {
    clipboard: {
      writeText: jest.fn().mockResolvedValue(), // Ensure it returns a resolved promise for chaining `.then()`
    },
  });
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
    expect(screen.getByLabelText('Source Language')).toBeInTheDocument();
    expect(screen.getByLabelText('Target Language')).toBeInTheDocument();
  });

  test('copies text to clipboard', async () => {
    render(<TranslatePage />);
    // Simulate input and translation logic as needed
    // Now, simulate clicking the copy button
    fireEvent.click(screen.getByTitle('Copy to Clipboard'));
  
    // Use await within waitFor to ensure the clipboard's writeText mock is awaited
    await waitFor(() => expect(navigator.clipboard.writeText).toHaveBeenCalled());
  });

  test('downloads the code', () => {
    // Mock for creating URLs
    global.URL.createObjectURL = jest.fn();
    global.URL.revokeObjectURL = jest.fn();

    render(<TranslatePage />);

    // Simulate setting some output text that should be downloaded
    // This may involve simulating user input or directly invoking the translation functionality
    // For simplicity, let's assume the output is directly set as part of the component's state
    const inputCodeMirror = screen.getByTestId('mockedCodeMirrorInput');
    fireEvent.change(inputCodeMirror, { target: { value: ';' } });
    const translateButton = screen.getByText('Translate');
    fireEvent.click(translateButton);

    // Simulate clicking the download button
    const downloadButton = screen.getByTitle('Download Code');
    fireEvent.click(downloadButton);

    // Assertions to check if the URL.createObjectURL was called can be made here
    // However, as mentioned, directly testing the download behavior can be challenging
    // Instead, ensure the createObjectURL was called which indirectly implies download was triggered
    expect(global.URL.createObjectURL).toHaveBeenCalled();

    // Cleanup mock to prevent leakage
    global.URL.createObjectURL.mockRestore();
    global.URL.revokeObjectURL.mockRestore();
  });

  test('allows code input and language selection', async () => {
    render(<TranslatePage />);
    const inputCodeMirror = screen.getByTestId('mockedCodeMirrorInput');
    const sourceLanguageSelect = screen.getByLabelText('Source Language');
    const targetLanguageSelect = screen.getByLabelText('Target Language');
  
    // Simulate typing into the input
    fireEvent.change(inputCodeMirror, { target: { value: 'function test() {}' } });
    expect(inputCodeMirror.value).toBe('function test() {}');
  
    // Change source language selection
    fireEvent.change(sourceLanguageSelect, { target: { value: 'Python' } });
    expect(sourceLanguageSelect.value).toBe('Python');
  
    // Change target language selection
    fireEvent.change(targetLanguageSelect, { target: { value: 'C++' } });
    expect(targetLanguageSelect.value).toBe('C++');
  });

  test('validates language selection and code input', async () => {
    render(<TranslatePage />);
    const inputCodeMirror = screen.getByTestId('mockedCodeMirrorInput');
  
    // Simulate typing into the input
    fireEvent.change(inputCodeMirror, { target: { value: 'console.log("Hello World");' } });
  
    // Ensure the input is correctly updated
    expect(inputCodeMirror.value).toBe('console.log("Hello World");');
  
    const translateButton = screen.getByText('Translate');
    fireEvent.click(translateButton);
  
    // Add further assertions as necessary
  });

  const longText = `This is a very long text. `.repeat(50); // Adjust repetition for desired length

  

  test('downloads long text as a file', () => {
    // Mock for creating URLs
    global.URL.createObjectURL = jest.fn();
    global.URL.revokeObjectURL = jest.fn();

    render(<TranslatePage />);

    // Set the long text in the component's state as if it was the result of translation
    const inputCodeMirror = screen.getByTestId('mockedCodeMirrorInput');
    fireEvent.change(inputCodeMirror, { target: { value: longText } });
    // You might need to simulate the translation action if your component works that way

    // Simulate clicking the download button
    const downloadButton = screen.getByTitle('Download Code');
    fireEvent.click(downloadButton);

    // Expect createObjectURL to have been called, implying a download was initiated
    expect(global.URL.createObjectURL).toHaveBeenCalled();

    // Cleanup
    global.URL.createObjectURL.mockRestore();
    global.URL.revokeObjectURL.mockRestore();
  });

  
  
  
  

  // Additional tests could include checking the file upload functionality,
  // copying to clipboard, downloading code, etc., depending on the level of detail you want to test.
});




