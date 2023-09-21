import axios from "axios";

const endpoint = import.meta.env.VITE_CLOUDINARY_URL;

export const uploadUserAvatarApi = async (picData) => {
  try {
    let { data } = await axios.post(endpoint, picData);

    return data;
  } catch {
    return {};
  }
};
