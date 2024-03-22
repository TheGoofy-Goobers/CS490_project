import { mount } from 'enzyme'; // Import Enzyme's mount function
import Home from './Home'; // Import your component
import { BrowserRouter } from 'react-router-dom';

describe('Button Redirect Test', () => {
  it('redirects when the button is clicked', () => {
    // Mount your component (replace with your actual component)
    const wrapper = mount(<Home />);

    // Find the button element by its class name or other selector
    const button = wrapper.find('translate_now');

    // Simulate a click on the button
    button.simulate('click');

    // Now, you can assert that the expected redirection occurs
    // For example, check if the window location has changed to the expected URL
    expect(window.location.href).toEqual('http://localhost:3000/translate');
  });
});
