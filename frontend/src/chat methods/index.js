/**
 * Gets the name of the sender in a one-on-one chat
 *
 * @param {Object} loggedUser - The currently logged-in user
 * @param {Array} users - Array of users in the chat (typically 2 users)
 * @returns {string} The name of the other user in the chat
 */
export const getSender = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

/**
 * Gets the user object of the other participant in a one-on-one chat
 *
 * @param {Object} loggedUser - The currently logged-in user
 * @param {Array} users - Array of users in the chat (typically 2 users)
 * @returns {Object} The user object of the other user in the chat
 */
export const getUser = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};

/**
 * Determines if the current message is from a different sender than the next message
 * Used for grouping consecutive messages from the same sender
 *
 * @param {Array} messages - Array of all messages in the chat
 * @param {Object} currentMessage - The current message being evaluated
 * @param {number} index - The index of the current message in the messages array
 * @param {string} userId - The ID of the logged-in user
 * @returns {boolean} True if the message is from a different sender than the next message
 */
export const isSameSender = (messages, currentMessage, index, userId) => {
  return (
    index < messages.length - 1 &&
    (messages[index + 1].sender._id !== currentMessage.sender._id ||
      messages[index + 1].sender._id === undefined) &&
    messages[index].sender._id !== userId
  );
};

/**
 * Checks if the message is the last one in the chat and not from the current user
 *
 * @param {Array} messages - Array of all messages in the chat
 * @param {number} index - The index of the current message in the messages array
 * @param {string} userId - The ID of the logged-in user
 * @returns {boolean} True if the message is the last one and not from the current user
 */
export const isLastMessage = (messages, index, userId) => {
  return (
    index === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

/**
 * Checks if the current message is from the same sender as the previous message
 * Used for grouping consecutive messages from the same sender
 *
 * @param {Array} messages - Array of all messages in the chat
 * @param {Object} message - The current message being evaluated
 * @param {number} index - The index of the current message in the messages array
 * @returns {boolean} True if the message is from the same sender as the previous message
 */
export const isSameUser = (messages, message, index) => {
  return index > 0 && messages[index - 1].sender._id === message.sender._id;
};

/**
 * Calculates the margin for message alignment based on sender
 * Used to properly align messages in the chat UI
 *
 * @param {Array} messages - Array of all messages in the chat
 * @param {Object} message - The current message being evaluated
 * @param {number} index - The index of the current message in the messages array
 * @param {string} userId - The ID of the logged-in user
 * @returns {string} The margin value to be used for the message (e.g., "40px", "0", "auto")
 */
export const isSameSenderMargin = (messages, message, index, userId) => {
  if (
    index < messages.length - 1 &&
    messages[index + 1].sender._id === message.sender._id &&
    messages[index].sender._id !== userId
  )
    return "40px";
  else if (
    (index < messages.length - 1 &&
      messages[index + 1].sender._id !== message.sender._id &&
      messages[index].sender._id !== userId) ||
    (index === messages.length - 1 && messages[index].sender._id !== userId)
  )
    return "0";
  else return "auto";
};
