import axios from "axios";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "cv1pmbl0";
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "qontak_sales";
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;


export const uploadImageToCloudinary = async (file, options = {}) => {
  const { folder = "", maxBytes = 5 * 1024 * 1024 } = options;

  if (!file) throw new Error("Tidak ada file yang dipilih.");
  if (file.size > maxBytes) {
    throw new Error(`Ukuran gambar melebihi ${Math.round(maxBytes / 1024)} KB.`);
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  if (folder) formData.append("folder", folder);

  let response;
  try {
    response = await axios.post(UPLOAD_URL, formData, { timeout: 60000 });
  } catch (error) {
    const detail = error.response?.data?.error?.message;
    throw new Error(detail || "Gagal mengunggah gambar.");
  }

  const url = response.data?.secure_url;
  if (!url) throw new Error("Server gambar tidak mengembalikan URL.");
  return url;
};
