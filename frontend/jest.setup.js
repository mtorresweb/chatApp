import "@testing-library/jest-dom";
import { configure } from "@testing-library/react";
import "./src/tests/globalMocks";

// Set up a faster timeout for testing
configure({ asyncUtilTimeout: 5000 });

// Mock the socket module - using mockSocket prefix to avoid Jest errors
jest.mock("./src/socket", () => ({
  socket: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
    connect: jest.fn(),
    disconnect: jest.fn(),
  },
}));

// Mock cloudinary API - using mockCloudinary prefix to avoid Jest errors
jest.mock("./src/api/cloudinaryApi", () => ({
  uploadImage: jest.fn().mockResolvedValue({
    secure_url: "https://example.com/test-image.jpg",
  }),
}));

// Mock local storage and session storage
const storageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, "localStorage", { value: storageMock });
Object.defineProperty(window, "sessionStorage", { value: storageMock });

// Mock structuredClone if it doesn't exist
if (typeof global.structuredClone !== "function") {
  global.structuredClone = jest.fn((obj) => JSON.parse(JSON.stringify(obj)));
}

// Mock import.meta.env for Vite
if (typeof window.import === "undefined") {
  window.import = {
    meta: {
      env: {
        VITE_API_URL: "http://localhost:5000",
        MODE: "test",
      },
    },
  };
}
