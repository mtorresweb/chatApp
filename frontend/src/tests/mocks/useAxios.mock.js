// Mock for useAxios.jsx
jest.mock("../../src/hooks/useAxios", () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => {
      return {
        loading: false,
        error: null,
        fetchData: jest.fn().mockResolvedValue({ data: {} }),
      };
    }),
  };
});
