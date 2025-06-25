// src/api/auth.api.js
import apiClient from "./apiClient";

export const registerAPI = async (values) => {
  const userData = {
    fullName: values.fullName,
    phone: values.phone,
    gender: values.gender,
    birthDate: values.birthDate ? values.birthDate.format("YYYY-MM-DD") : null,
    address: values.address,
    email: values.email,
    userName: values.username,
    password: values.password,
    roleId: 4,
  };
  return apiClient.post("/auth/register", userData);
};

export const loginAPI = async (values) => {
  const userData = {
    usernameOrEmail: values.username,
    password: values.password,
  };
  return apiClient.post("/auth/login", userData);
};

export const getUserByIdAPI = async (userId) => {
  return apiClient.get(`/users/${userId}`);
};

export const getUserProfile = async () => {
  return apiClient.get("/users/me");
};

export const forgotPasswordAPI = async (usernameOrEmail) => {
  return apiClient.post("/auth/forgot-password", { usernameOrEmail });
};

export const verifyOTPAPI = async (values) => {
  const userData = {
    usernameOrEmail: values.usernameOrEmail,
    otp: values.otp,
  };
  return apiClient.post("/auth/verify-otp", userData);
};

export const resetPasswordAPI = async (values) => {
  const userData = {
    usernameOrEmail: values.usernameOrEmail,
    newPassword: values.newPassword,
  };
  return apiClient.post("/auth/reset-password", userData);
};