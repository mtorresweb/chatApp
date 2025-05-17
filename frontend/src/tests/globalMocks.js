// Global mocks for tests
/* eslint-disable no-undef */

// Mock import.meta.env for Vite
global.import = {
  meta: {
    env: {
      VITE_API_URL: "http://localhost:5000",
      MODE: "test",
    },
  },
};

// Mock for localStorage/sessionStorage with functioning implementations
const storageMock = {
  getItem: jest.fn((key) => {
    if (key === "userInfo") {
      return JSON.stringify({
        _id: "test123",
        name: "Test User",
        email: "test@example.com",
      });
    }
    return null;
  }),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Apply mocks to window object
Object.defineProperty(window, "localStorage", {
  value: storageMock,
  writable: true,
});
Object.defineProperty(window, "sessionStorage", {
  value: storageMock,
  writable: true,
});

// Add structuredClone polyfill for test environment
if (typeof structuredClone !== "function") {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

// Don't use jest.mock here, mocking will be handled in individual test files
// or in jest.setup.js

// Mock other problematic imports
jest.mock("../socket", () => ({
  socket: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
    connect: jest.fn(),
    disconnect: jest.fn(),
  },
}));
