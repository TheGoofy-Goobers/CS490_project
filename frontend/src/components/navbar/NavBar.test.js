// NavBar.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import NavBar from './NavBar'; // Import your NavBar component

describe('NavBar', () => {
    it('renders navigation links', () => {
        render(<NavBar />);

        // Check if the navigation links are rendered
        const aboutLink = screen.getByText('About');
        const contactLink = screen.getByText('Contact');

        expect(aboutLink).toBeInTheDocument();
        expect(contactLink).toBeInTheDocument();
    });

    it('has correct href attributes', () => {
        render(<NavBar />);

        // Check if the href attributes are correct
        const aboutLink = screen.getByText('About');
        const contactLink = screen.getByText('Contact');

        expect(aboutLink).toHaveAttribute('href', '/about');
        expect(contactLink).toHaveAttribute('href', '/contact');
    });

    it('should render a home link with an image', () => {
        const wrapper = shallow(<NavBar />);  // Replace with your actual NavBar component

        // Find the home link
        const homeLink = wrapper.find(Link);

        // Assert that the home link exists
        expect(homeLink).toHaveLength(1);

        // Assert that the home link contains an image
        const homeImage = homeLink.find('img');
        expect(homeImage).toHaveLength(1);

        // Assert that the image has the correct src (replace with your actual image source)
        expect(homeImage.prop('src')).toEqual('logo3.png');
    });
});