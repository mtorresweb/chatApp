import { renderHook } from '@testing-library/react';
import { ChatContext } from '../../Context/ChatProvider';
import React from 'react';

// Mock useAxios module with fixed response - simplify to avoid memory issues
jest.mock('../../hooks/useAxios', () => {
  return jest.fn(() => ({
    loading: false,
    response: [{ _id: '1', name: 'Test User' }],
    error: null,
    fetchData: jest.fn().mockResolvedValue([{ _id: '1', name: 'Test User' }]),
    alert: { active: false },
    resetAlert: jest.fn(),
  }));
});

// Now we can safely import useUserSearch which uses the mocked useAxios
import useUserSearch from '../../hooks/useUserSearch';

// Wrapper component to provide context
const wrapper = ({ children }) => (
  <ChatContext.Provider
    value={{
      user: { token: 'test-token' },
      setUser: jest.fn(),
      selectedChat: {},
      setSelectedChat: jest.fn(),
      chats: [],
      setChats: jest.fn(),
      notifications: [],
      setNotifications: jest.fn()
    }}
  >
    {children}
  </ChatContext.Provider>
);

describe('useUserSearch hook', () => {
  test('should have search results and loading state', () => {
    const { result } = renderHook(() => useUserSearch(), { wrapper });
    
    // Check initial state
    expect(result.current.searchResults).toEqual([{ _id: '1', name: 'Test User' }]);
    expect(result.current.loading).toBe(false);
  });
});
