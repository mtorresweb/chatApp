import { useState } from "react";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_URL + "/api/";

const useAxios = ({ url, method, headers = null }) => {
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

  const fetchData = (body = null) => {
    setloading(true);
    axios
      .request({
        method,
        url,
        headers,
        data: body,
      })
      .then((res) => {
        setResponse(res.data);
      })
      .catch((err) => {
        setError(err.response.data);
        setAlert({
          active: true,
          message: err.response.data.message,
          severity: "warning",
        });
      })
      .finally(() => {
        setloading(false);
      });
  };

  return { response, error, loading, fetchData, alert, resetAlert };
};

export default useAxios;
