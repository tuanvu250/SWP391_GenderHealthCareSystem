import axios from "axios";
import { use } from "react";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

{
  /*Auth*/
}
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
  return api.post("/auth/register", userData);
};

export const loginAPI = async (values) => {
  const userData = {
    usernameOrEmail: values.username,
    password: values.password,
  };
  return api.post("/auth/login", userData);
};

//data của người dùng
export const getUserProfile = async () => {
  return api.get("/users/me");
};

export const forgotPasswordAPI = async (usernameOrEmail) => {
  return api.post("/auth/forgot-password", { usernameOrEmail });
};

export const verifyOTPAPI = async (values) => {
  const userData = {
    usernameOrEmail: values.usernameOrEmail,
    otp: values.otp,
  };
  return api.post("/auth/verify-otp", userData);
};

export const resetPasswordAPI = async (values) => {
  const userData = {
    usernameOrEmail: values.usernameOrEmail,
    newPassword: values.newPassword,
  };
  return api.post("/auth/reset-password", userData);
};

{
  /*Blog*/
}
export const blogHomeAPI = async () => {
  return api.get("/blog-posts/latest");
};

export const blogSearchAPI = async ({
  title = "",
  page = 0,
  size = 8,
  tag = "",
  sort = "",
}) => {
  const query = new URLSearchParams({
    title,
    page,
    size,
    tag,
    sort,
  }).toString();
  return api.get(`/blog-posts/search?${query}`);
};

export const blogDetailAPI = async (id) => {
  return api.get(`/blog-posts/${id}`);
};

export const postBlogAPI = async (values) => {
  const formData = new FormData();
  formData.append("title", values.title);
  formData.append("content", values.content);
  formData.append("tags", values.tags.join(", "));
  if (values.image) {
    formData.append("image", values.image);
  }

  return api.post("/blog-posts", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const viewMyBlogsAPI = async ({
  page = 0,
  size = 10,
  title = "",
  tag = "",
  sort = "",
  orderBy = "",
}) => {
  const query = new URLSearchParams({
    page,
    size,
    title,
    tag,
    sort,
    orderBy,
  }).toString();
  return api.get(`/blog-posts/my-posts?${query}`);
};

export const deleteBlogAPI = async (postId) => {
  return api.delete(`/blog-posts/${postId}`);
};

export const updateBlogAPI = async (postId, values) => {
  const formData = new FormData();
  formData.append("title", values.title);
  formData.append("content", values.content);
  formData.append("tags", values.tags.join(", "));
  if (values.image) {
    formData.append("image", values.image);
  }

  return api.put(`/blog-posts/${postId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

{
  /*User Profile*/
}
export const updateUserAvatarAPI = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.put("/profile/me/avatar", formData, {
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
  return api.put("/profile/update", userData);
};

{
  /*Health Tracker*/
}

export const healthTrackerAPI = async (values) => {
  return api.post("/menstrual/calculate", values);
};

{
  /*Booking Stis*/
}
export const bookStisAPI = async (values) => {
  const bookingData = {
    serviceId: values.packageId,
    bookingDate: values.appointmentDate,
    bookingTime: values.appointmentTime,
    note: values.notes,
    paymentMethod: values.paymentMethod,
  };

  //console.log(">>> Booking Data:", bookingData);
  return api.post("/stis-bookings", bookingData);
};

export const paymentAPI = async (amount, orderInfo, bookingID) => {
  return api.get("/payment/vn-pay", {
    params: {
      amount,
      orderInfo,
      bookingID,
    },
    responseType: "text", // Để nhận về URL
    maxRedirects: 0,
  });
};

export const createInvoiceAPI = async (query) => {
  return api.get(`/payment/create-invoice?${query}`);
};

export const getAllPillSchedules = () => {
  return api.get("/pills/schedule/all");
};

export const markPillTaken = (scheduleId, taken) => {
  return api.post(`/pills/schedule/${scheduleId}/mark?taken=${taken}`);
};

export const pillAPI = (values) => {
  return api.post("/pills", values);
};
