import axios from "axios";

const endpoint = import.meta.env.VITE_CLOUDINARY_URL;
const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const uploadUserAvatar = async (userData) => {
  try {
    if (userData.pic[0]) {
      const picData = new FormData();

      picData.append("file", userData.pic[0]);
      picData.append("upload_preset", uploadPreset);
      picData.append("cloud_name", cloudName);

      let { data } = await axios.post(endpoint, picData);
      userData.pic = data.url;

      return;
    }

    delete userData.pic;
  } catch {
    delete userData.pic;
  }
};
