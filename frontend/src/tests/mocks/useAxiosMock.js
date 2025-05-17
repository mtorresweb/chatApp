// Mock implementation of useAxios for tests
import { useState } from "react";

const useAxios = ({ url, method, headers = null }) => {
  // Use useState to create response state
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    active: false,
    message: "",
    severity: "warning",
  });

  /**
   * Resets the alert state
   */
  const resetAlert = () => {
    setAlert({
      active: false,
      message: "",
      severity: "warning",
    });
  };

  /**
   * Executes the API request
   *
   * @param {Object} [body=null] - Request body for POST/PUT requests
   * @returns {Promise} Promise that resolves when the request is complete
   */
  const fetchData = async (body = null) => {
    // Return mock data for tests
    const mockData = [{ _id: "1", name: "Test User" }];
    setResponse(mockData);
    return mockData;
  };

  return { response, error, loading, fetchData, alert, resetAlert };
};

export default useAxios;
