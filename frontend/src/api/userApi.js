import axios from "axios";

const endpoint = import.meta.env.VITE_API_URL + "/api/user";

export const userLogin = async (credentials) => {
  try {
    let { data } = await axios.post(`${endpoint}/login`, credentials);
    sessionStorage.setItem("userInfo", JSON.stringify(data));
    return data;
  } catch {
    return {};
  }
};

export const userRegister = async (userData) => {
  try {
    let { data } = await axios.post(`${endpoint}/register`, userData);
    sessionStorage.setItem("userInfo", JSON.stringify(data));
    return data;
  } catch {
    return {};
  }
};
