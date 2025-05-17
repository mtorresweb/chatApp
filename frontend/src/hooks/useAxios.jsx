import { useState } from "react";
import axios from "axios";

// Set the base URL from environment variables
// Use a default value for tests or when import.meta.env is not available
const API_URL = typeof import.meta !== 'undefined' 
  ? import.meta.env.VITE_API_URL + "/api/" 
  : "http://localhost:5000/api/";

axios.defaults.baseURL = API_URL;

/**
 * Custom hook for making API requests with axios
 * 
 * @param {Object} config - Configuration for the API request
 * @param {string} config.url - The endpoint URL to call
 * @param {string} config.method - HTTP method (get, post, put, delete)
 * @param {Object} [config.headers=null] - HTTP headers to include in the request
 * @returns {Object} Object containing response state, error state, loading state, and fetch function
 */
const useAxios = ({ url, method, headers = null }) => {
  // Store the API response
  const [response, setResponse] = useState(null);
  // Store any error that occurs
  const [error, setError] = useState("");
  // Track loading state
  const [loading, setloading] = useState(false);
  // Alert state for UI feedback
  const [alert, setAlert] = useState({
    active: false,
    message: "",
    severity: "warning",
  });

  /**
   * Resets the alert state
   */
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
    setloading(true);
    
    try {
      const response = await axios.request({
        method,
        url,
        headers,
        data: body,
      });
      
      setResponse(response.data);
      return response.data;
    } catch (err) {
      setError(err.response.data);
      setAlert({
        active: true,
        message: err.response.data.message,
        severity: "warning",
      });
      throw err;
    } finally {
      setloading(false);
    }
  };

  return { response, error, loading, fetchData, alert, resetAlert };
};

export default useAxios;
