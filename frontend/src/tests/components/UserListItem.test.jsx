import { render, screen, fireEvent } from '@testing-library/react';
import UserListItem from '../../components/UserListItem';
import React from 'react';

describe('UserListItem', () => {
  const mockUser = {
    _id: '123',
    name: 'Test User',
    email: 'test@example.com',
    picture: 'https://example.com/avatar.jpg'
  };
  
  const mockHandleFunction = jest.fn();
  
  test('renders user information correctly', () => {
    render(<UserListItem user={mockUser} handleFunction={mockHandleFunction} />);
    
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });
    test('calls handleFunction when clicked', () => {
    render(<UserListItem user={mockUser} handleClick={mockHandleFunction} />);
    
    // Click on the list item
    fireEvent.click(screen.getByText('Test User'));
    
    expect(mockHandleFunction).toHaveBeenCalledTimes(1);
  });
    test('displays avatar correctly', () => {
    const userWithoutPicture = { ...mockUser, picture: null };
    render(<UserListItem user={userWithoutPicture} handleClick={mockHandleFunction} />);
    
    // Check if Avatar component is rendered, we can't check the exact content 
    // since Material-UI doesn't expose the text content directly
    const avatarElement = document.querySelector('.MuiAvatar-root');
    expect(avatarElement).toBeInTheDocument();
  });
});
