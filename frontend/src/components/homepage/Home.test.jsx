import React from 'react';
import { render, screen } from '@testing-library/react';
import NavBar from './NavBar';  // Replace with your actual NavBar component
import { BrowserRouter } from 'react-router-dom';

describe('Home', () => {
    it('Makes sure the button works', () => {
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

});