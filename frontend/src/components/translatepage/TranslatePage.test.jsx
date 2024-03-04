import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import TranslatePage from './TranslatePage';

beforeAll(() => {
  Element.prototype.getBoundingClientRect = jest.fn(() => {
    return { width: 120, height: 120, top: 0, left: 0, bottom: 0, right: 0 };
  });
});

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});



describe('TranslatePage', () => {
  test('renders TranslatePage component', () => {
    render(<TranslatePage />);
    expect(screen.getByText(/input/i)).toBeInTheDocument();
    expect(screen.getByText(/output/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /translate/i })).toBeInTheDocument();
  });

  test('allows code input to be typed', () => {
    render(<TranslatePage />);
    const input = screen.getByRole('textbox', { name: /code input/i });
    userEvent.type(input, 'console.log("Hello, World!");');
    expect(input.value).toContain('console.log("Hello, World!");');
  });

  test('validates language selection from dropdowns', () => {
    render(<TranslatePage />);
    const sourceLanguageDropdown = screen.getByLabelText(/source language/i);
    const targetLanguageDropdown = screen.getByLabelText(/target language/i);

    // Select JavaScript as source language
    userEvent.selectOptions(sourceLanguageDropdown, 'JavaScript');
    expect(sourceLanguageDropdown.value).toBe('JavaScript');

    // Select Python as target language
    userEvent.selectOptions(targetLanguageDropdown, 'Python');
    expect(targetLanguageDropdown.value).toBe('Python');
  });

  test('does not allow invalid file extensions for upload', () => {
    render(<TranslatePage />);
    const fileInput = screen.getByLabelText(/upload file/i);
    const jsFile = new File(['console.log("Hello, World!")'], 'hello.txt', { type: 'text/plain' });
    userEvent.upload(fileInput, jsFile);
    expect(fileInput.files[0].name).not.toMatch(/\.js$/);
    expect(fileInput.files).toHaveLength(1);
  });

  test('shows error alert when invalid JavaScript code is submitted', () => {
    window.alert = jest.fn();
    render(<TranslatePage />);
    const input = screen.getByRole('textbox', { name: /code input/i });
    const translateButton = screen.getByRole('button', { name: /translate/i });

    // Type invalid JavaScript code
    userEvent.type(input, 'This is not valid JavaScript code');
    fireEvent.click(translateButton);
    
    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Invalid JavaScript code'));
  });

  test('copies text to clipboard', async () => {
    render(<TranslatePage />);
    const copyButton = screen.getByTitle(/copy to clipboard/i);
    navigator.clipboard.writeText = jest.fn();

    // Assume some text is already in the output
    const output = screen.getByRole('textbox', { name: /code output/i });
    userEvent.type(output, 'console.log("Hello, World!");');

    userEvent.click(copyButton);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('console.log("Hello, World!");');
  });

  test('downloads the code', () => {
    render(<TranslatePage />);
    const downloadButton = screen.getByTitle(/download code/i);
    Object.defineProperty(global, 'Blob', { value: jest.fn(() => ({ size: 100 })) });
    global.URL.createObjectURL = jest.fn();
    global.URL.revokeObjectURL = jest.fn();

    // Assume some text is already in the output
    const output = screen.getByRole('textbox', { name: /code output/i });
    userEvent.type(output, 'console.log("Hello, World!");');

    userEvent.click(downloadButton);
    expect(global.Blob).toHaveBeenCalledWith(['console.log("Hello, World!");'], { type: 'text/plain' });
    expect(global.URL.createObjectURL).toHaveBeenCalled();
  });
});
