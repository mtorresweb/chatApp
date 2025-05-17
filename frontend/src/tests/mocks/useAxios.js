// Mock implementation for useAxios.jsx
import { useState } from "react";

// Create a mock version of useAxios
const useAxios = ({ url, method }) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setloading] = useState(false);
  const [alert, setAlert] = useState({
    active: false,
    message: "",
    severity: "warning",
  });

  const resetAlert = () => {
    setAlert({
      active: false,
      message: "",
      severity: "warning",
    });
  };

  const fetchData = async (body = null) => {
    setloading(true);

    try {
      // Mock response based on URL
      const mockResponse = {
        data: { success: true },
      };

      setResponse(mockResponse.data);
      setloading(false);
      return mockResponse.data;
    } catch (err) {
      setError("Mock error");
      setAlert({
        active: true,
        message: "Mock error message",
        severity: "warning",
      });
      setloading(false);
      throw err;
    }
  };

  return { response, error, loading, fetchData, alert, resetAlert };
};

export default useAxios;
