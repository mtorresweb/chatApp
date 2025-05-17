// Mock the necessary modules and setup global values
// DO NOT use Jest directly in this file to avoid circular dependencies

// Export default values that will be used in tests
export const socketMock = {
  on: () => {},
  off: () => {},
  emit: () => {},
  connect: () => {},
  disconnect: () => {},
};

export const cloudinaryMock = {
  uploadImage: async () => ({
    secure_url: "https://example.com/test-image.jpg",
  }),
};

export const localStorageMock = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
};
