// NavBar.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import NavBar from './NavBar';  // Replace with your actual NavBar component
import { BrowserRouter } from 'react-router-dom';

describe('NavBar', () => {
    it('renders the logo image with src correctly', () => {
        render(<BrowserRouter>
            <NavBar />
          </BrowserRouter>);

        // Find the logo image
        const logoImg = screen.getByAltText('Logo');
        const link = screen.getByTestId('lin')

        // Assert that the image src matches your expected value
        expect(logoImg.src).toContain('logo3.png');
        expect(link.href).toContain('/');
    });

    it('has correct href attributes for Translate and Feedback links', () => {
        render(<BrowserRouter>
            <NavBar />
          </BrowserRouter>);

        // Find the Translate and Feedback links
        const transLink = screen.getByTestId('translink');

        // Assert that the href attributes are correct
        expect(transLink.href).toContain('/translate');
    });

    it('has correct href attributes for Translate and Feedback links', () => {
        render(<BrowserRouter>
            <NavBar />
          </BrowserRouter>);

        // Find the Translate and Feedback links
        const feedLink = screen.getByTestId('feedlink');

        // Assert that the href attributes are correct
        expect(feedLink.href).toContain('/feedback');
    });

    it('renders the profile image and sees it has link', () => {
        render(<BrowserRouter>
            <NavBar />
          </BrowserRouter>);

        // Find the logo image
        const logoImg = screen.getByAltText('Profile');
        const link = screen.getByTestId('prof');

        // Assert that the image src matches your expected value
        expect(logoImg.src).toContain('Profile.png');
        expect(link.href).toContain('/login');
    });

    it('renders refernce page correctly', () => {
        render(<BrowserRouter>
            <NavBar />
          </BrowserRouter>);

        // Find the logo image
        
        const link = screen.getByTestId('reflink')

        // Assert that the image src matches your expected value
        expect(link.href).toContain('/');
    });
});