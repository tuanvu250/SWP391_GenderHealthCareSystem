// src/api/profile.api.js
import apiClient from "./apiClient";

export const updateUserAvatarAPI = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return apiClient.put("/profile/me/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateUserProfileAPI = async (values) => {
  const userData = {
    fullName: values.fullName,
    phone: values.phone,
    gender: values.gender,
    birthDate: values.birthDate.format("YYYY-MM-DD"),
    address: values.address,
    email: values.email,
  };
  return apiClient.put("/profile/update", userData);
};


export const getConsultantProfile = async () => {
  const res = await apiClient.get("/consultant/profile");
  return res.data;
};

// PUT /api/consultant/profile
export const updateConsultantProfile = async (data) => {
  //console.log("Updating consultant profile with data:", data);
  return apiClient.put("/consultant/profile", data);
};