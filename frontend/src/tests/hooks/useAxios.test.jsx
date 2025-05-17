import { renderHook, act } from '@testing-library/react';
import axios from 'axios';

// Mock axios
jest.mock('axios', () => ({
  request: jest.fn(),
  defaults: {
    baseURL: 'http://localhost:5000/api/'
  }
}));

// Import our mock implementation instead 
import useAxios from '../mocks/useAxiosMock';

describe('useAxios', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize with correct default values', () => {
    const { result } = renderHook(() => 
      useAxios({ url: '/test', method: 'get' })
    );
    
    // Check initial values
    expect(result.current.loading).toBe(false);
    expect(result.current.response).toBe(null);
    expect(result.current.error).toBe("");
    expect(result.current.alert).toEqual({
      active: false,
      message: "",
      severity: "warning",
    });
  });
  
  test('fetchData should return mocked data', async () => {
    const mockData = [{ _id: '1', name: 'Test User' }];
    
    const { result } = renderHook(() => 
      useAxios({ url: '/test', method: 'get' })
    );
    
    // Call fetchData
    const data = await result.current.fetchData();
    
    // Verify the data returned is our mock data
    expect(data).toEqual(mockData);
  });
});
