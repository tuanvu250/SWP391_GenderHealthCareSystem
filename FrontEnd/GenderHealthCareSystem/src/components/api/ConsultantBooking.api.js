// src/components/api/ConsultantBooking.api.js
import apiClient from "./apiClient";

export const createConsultationBooking = async (data) =>
  (await apiClient.post("/bookings", data)).data;

export const getConsultantSchedule = async (consultantId) =>
  (await apiClient.get(`/bookings/consultant/${consultantId}/schedule`)).data;

export const confirmPayment = async (params) =>
  (await apiClient.get("/bookings/payment-return", { params })).data;
