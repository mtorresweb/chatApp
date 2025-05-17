import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProtectedRoute from '../../components/ProtectedRoute';
import { ChatContext } from '../../Context/ChatProvider';
// React is needed for JSX
// eslint-disable-next-line no-unused-vars
import React from 'react';

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('ProtectedRoute', () => {
  const mockNavigate = jest.fn();
  
  beforeEach(() => {
    // Setup mocks
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
    // Reset mock navigate
    mockNavigate.mockReset();
  });  test('renders children when user is authenticated', () => {
    // Set user in context with _id property to pass the auth check
    // Mock localStorage to return a valid user
    window.sessionStorage.getItem.mockImplementation(() => JSON.stringify({ _id: '123', name: 'Test User' }));
    
    render(
      <ChatContext.Provider value={{ user: { _id: '123', name: 'Test User' }, setUser: jest.fn() }}>
        <BrowserRouter>
          <ProtectedRoute>
            <div data-testid="protected-content">Protected Content</div>
          </ProtectedRoute>
        </BrowserRouter>
      </ChatContext.Provider>
    );
    
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });test('redirects to login when user is not authenticated', () => {
    // Mock sessionStorage.getItem to return null explicitly for this test
    const sessionStorageMock = window.sessionStorage.getItem;
    window.sessionStorage.getItem.mockImplementation(() => null);
    
    // Set empty user in context
    render(
      <ChatContext.Provider value={{ user: null, setUser: jest.fn() }}>
        <BrowserRouter>
          <ProtectedRoute>
            <div data-testid="protected-content">Protected Content</div>
          </ProtectedRoute>
        </BrowserRouter>
      </ChatContext.Provider>
    );
    
    // Just verify that navigation was triggered at all
    expect(mockNavigate).toHaveBeenCalled();

    // Clean up mock (using the correct reference)
    sessionStorageMock.mockClear();
  });
});
