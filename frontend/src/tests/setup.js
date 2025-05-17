// This file defines common ESLint globals for test files
/* eslint-env jest */
/* global describe, test, expect, beforeEach, afterEach, beforeAll, afterAll, jest */

// This ensures that 'React' is available for JSX in all test files
import React from "react";
global.React = React;

// Mock import.meta.env values for Vite
global.import = {
  meta: {
    env: {
      VITE_API_URL: "http://localhost:5000",
      MODE: "test",
    },
  },
};

// Mock for localStorage that uses jest.fn()
Object.defineProperty(window, "localStorage", {
  value: {
    getItem: jest.fn().mockImplementation((key) => {
      return key === "userInfo"
        ? JSON.stringify({ name: "Test User", email: "test@example.com" })
        : null;
    }),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true,
});
