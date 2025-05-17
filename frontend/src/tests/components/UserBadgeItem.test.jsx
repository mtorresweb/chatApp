import { render, screen, fireEvent } from '@testing-library/react';
import UserBadgeItem from '../../components/UserBadgeItem';
import React from 'react';

describe('UserBadgeItem Component', () => {
  const mockUser = {
    _id: '123',
    name: 'Test User',
    email: 'test@example.com'
  };
  
  const mockHandleFunction = jest.fn();
  
  test('renders user name correctly', () => {
    render(<UserBadgeItem user={mockUser} handleFunction={mockHandleFunction} />);
    
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });
  
  test('calls handleFunction when close button is clicked', () => {
    render(<UserBadgeItem user={mockUser} handleFunction={mockHandleFunction} />);
    
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    
    expect(mockHandleFunction).toHaveBeenCalledTimes(1);
  });
  
  test('renders with admin badge when user is admin', () => {
    render(<UserBadgeItem user={mockUser} handleFunction={mockHandleFunction} admin={true} />);
    
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });
  
  test('does not render admin badge when user is not admin', () => {
    render(<UserBadgeItem user={mockUser} handleFunction={mockHandleFunction} />);
    
    expect(screen.queryByText('Admin')).not.toBeInTheDocument();
  });
});
