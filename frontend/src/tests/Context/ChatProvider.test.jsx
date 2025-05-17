/* eslint-disable no-undef */
import { render, screen, act } from '@testing-library/react';
import ChatProvider, { ChatState } from '../../Context/ChatProvider';
// We need React for JSX even if not explicitly used
import React from 'react';

// Create a test component to consume the context
const TestComponent = () => {
  const { user, setUser } = ChatState();
  return (
    <div>
      <span data-testid="username">{user?.name || 'No user'}</span>
      <button onClick={() => setUser({ name: 'Test User' })}>Set User</button>
    </div>
  );
};

describe('ChatProvider', () => {
  test('provides context values to children', () => {
    render(
      <ChatProvider>
        <TestComponent />
      </ChatProvider>
    );

    // Initially no user
    expect(screen.getByTestId('username')).toHaveTextContent('No user');
  });
  test('allows updating context values', () => {
    render(
      <ChatProvider>
        <TestComponent />
      </ChatProvider>
    );

    // Click the button to update user
    act(() => {
      screen.getByRole('button').click();
    });
    
    // Should show the new username
    expect(screen.getByTestId('username')).toHaveTextContent('Test User');
  });
});
