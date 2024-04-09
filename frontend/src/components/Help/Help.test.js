import { render, screen, fireEvent } from '@testing-library/react';
import Help from './Help';
import HelpContent from './HelpContent';

jest.mock('./HelpContent', () => jest.fn(() => null));

describe('Help Section Search Feature', () => {
  it('updates search results based on user input', () => {
    render(<Help />);
    const searchBar = screen.getByPlaceholderText('Search...'); // Assuming your SearchBar has a placeholder
    fireEvent.change(searchBar, { target: { value: 'translate' } });

    expect(HelpContent).toHaveBeenCalledWith(
      expect.objectContaining({ searchQuery: 'translate' }),
      expect.anything()
    );
  });
});

describe('Help Section Links', () => {
  it('renders valid links for resources', () => {
    render(<Help />);
    const links = screen.getAllByRole('link');
    
    expect(links).toHaveLength(2); // Adjust based on the number of links you expect
    links.forEach(link => {
      expect(link).toHaveAttribute('href');
      expect(link.getAttribute('href')).toMatch(/^https?:\/\/.+/); // Basic format validation
    });
  });
});

