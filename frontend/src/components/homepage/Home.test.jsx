import React from 'react';
import { shallow } from 'enzyme'; // Import shallow rendering
import Button from './Button'; // Import your button component

describe('Button Component', () => {
  it('should call the onClick handler when clicked', () => {
    const mockClickHandler = jest.fn();
    const wrapper = shallow(<Button onClick={mockClickHandler}>Click Me</Button>);

    // Simulate a button click
    wrapper.find('button').simulate('click');

    // Check if the mockClickHandler was called
    expect(mockClickHandler).toHaveBeenCalled();
  });
});
