import { getSender, getUser } from '../../chat methods';

describe('Chat utility methods', () => {
  const loggedUser = { _id: '123', name: 'Current User' };
  const users = [
    { _id: '456', name: 'User One' },
    { _id: '789', name: 'User Two' }
  ];

  test('getSender returns the correct sender name', () => {
    // When the user is the first in the array
    const chat1 = { users: [loggedUser, users[0]] };
    expect(getSender(loggedUser, chat1.users)).toBe('User One');

    // When the user is the second in the array
    const chat2 = { users: [users[0], loggedUser] };
    expect(getSender(loggedUser, chat2.users)).toBe('User One');
  });

  test('getUser returns the correct user object', () => {
    // When the user is the first in the array
    const chat1 = { users: [loggedUser, users[0]] };
    expect(getUser(loggedUser, chat1.users)).toEqual(users[0]);

    // When the user is the second in the array
    const chat2 = { users: [users[0], loggedUser] };
    expect(getUser(loggedUser, chat2.users)).toEqual(users[0]);
  });
});
