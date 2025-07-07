// src/components/api/ConsultantBooking.api.js
import apiClient from "./apiClient";

/* ----------------------------- BOOKING CRUD ----------------------------- */

// Tạo booking mới (customer)
export const createConsultationBooking = (payload) =>
  apiClient.post("/bookings", payload);          // → .then(res => res.data)

// Lịch tư vấn của chính consultant đăng nhập (dùng JWT)
export const getConsultantSchedule = () =>
  apiClient.get("/bookings/consultant/schedule"); // → .then(res => res.data)

// Calendar (slot rảnh/đã đặt) của một consultant bất kỳ
export const getConsultantCalendar = (consultantId) =>
  apiClient.get(`/bookings/calendar/${consultantId}`); // → .then(res => res.data)

// Lịch sử booking của customer (lọc & phân trang qua params)
export const getBookingHistory = (params) =>
  apiClient.get("/bookings/history", { params }); // → .then(res => res.data)

// Hủy booking đã thanh toán
export const cancelBooking = (bookingId) =>
  apiClient.put(`/bookings/cancel/${bookingId}`); // → .then(res => res.data)

// Đổi lịch booking đã thanh toán
export const rescheduleBooking = (payload) =>
  apiClient.put("/bookings/reschedule", payload); // → .then(res => res.data)

/* ---------------------------- PAYMENT RETURN ---------------------------- */

// Backend trả về sau khi thanh toán (VNPay / PayPal)
export const confirmPayment = (params) =>
  apiClient.get("/bookings/payment-return", { params }); // → .then(res => res.data)
