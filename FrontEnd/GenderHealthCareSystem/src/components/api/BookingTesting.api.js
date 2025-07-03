// src/api/booking.api.js
import apiClient from "./apiClient";
import dayjs from "dayjs";

export const getSTISPackagesAPI = async () => {
  return apiClient.get("/stis-services");
};

export const checkLimitTimeToBookAPI = async (serviceId, bookingDateTime) => {
  return apiClient.get(`/stis-bookings/check-limit`, {
    params: {
      serviceId,
      bookingDateTime,
    },
  }); 
};

export const bookStisAPI = async (values) => {
  const bookingData = {
    serviceId: values.packageId,
    bookingDate: values.appointmentDate,
    bookingTime: values.appointmentTime,
    note: values.notes,
    paymentMethod: values.paymentMethod,
  };
  console.log("Booking Data:", bookingData);
  return apiClient.post("/stis-bookings", bookingData);
};

export const historyBookingAPI = async ({
  page = 0,
  size = 5,
  status = "",
  sort = "",
}) => {
  const query = new URLSearchParams({
    page,
    size,
    status,
    sort,
  }).toString();
  return apiClient.get(`/stis-bookings/history?${query}`);
};

export const cancelBookingAPI = async (bookingId) => {
  return apiClient.put(`/stis-bookings/${bookingId}/mark-cancelled`);
};

export const manageBookingsAPI = async ({
  name = "",
  page = 0,
  size = 10,
  status = "",
  sort = "",
  startDate = "",
  endDate = "",
}) => {
  const query = new URLSearchParams({
    name,
    page,
    size,
    status,
    sort,
    startDate,
    endDate,
  }).toString();
  return apiClient.get(`/stis-bookings?${query}`);
};

export const markConfirmedBookingStisAPI = async (bookingId) => {
  return apiClient.put(`/stis-bookings/${bookingId}/mark-confirmed`);
};

export const markCompletedBookingStisAPI = async (bookingId) => {
  return apiClient.put(`/stis-bookings/${bookingId}/mark-completed`);
};

export const markDeniedBookingStisAPI = async (bookingId) => {
  return apiClient.put(`/stis-bookings/${bookingId}/mark-denied`);
};

export const markNoShowBookingStisAPI = async (bookingId) => {
  return apiClient.put(`/stis-bookings/${bookingId}/mark-no-show`);
};

export const enterResultStisAPI = async (bookingId, resultData) => {
  console.log("Result Data:", resultData);
  return apiClient.post(`/stis-results/return/${bookingId}`, resultData);
};

export const uploadStisAttachmentsAPI = async (bookingId, attachments) => {
  const formData = new FormData();
  formData.append("pdfFile", attachments);
  return apiClient.put(`/stis-results/upload-pdf/${bookingId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
