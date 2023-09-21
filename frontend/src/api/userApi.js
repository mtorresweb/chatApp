import axios from "axios";

const endpoint = import.meta.env.VITE_API_URL + "/api/user";

export const userLoginApi = async (credentials) => {
  try {
    let { data } = await axios.post(`${endpoint}/login`, credentials);
    sessionStorage.setItem("userInfo", JSON.stringify(data));
    return data;
  } catch {
    return {};
  }
};

export const userRegisterApi = async (userData) => {
  try {
    let { data } = await axios.post(`${endpoint}/register`, userData);
    sessionStorage.setItem("userInfo", JSON.stringify(data));
    return data;
  } catch {
    return {};
  }
};

export const userSearchApi = async (search, user) => {
  try {
    const { data } = await axios.get(`${endpoint}/listUsers?search=${search}`, {
      headers: {
        Authorization: "Bearer " + user.token,
      },
    });
    return data;
  } catch (e) {
    return [];
  }
};
