import apiClient from "./apiClient";

export const createConsultationBooking = (payload) =>
  apiClient.post("/bookings", payload);        


export const getConsultantSchedule = () =>
  apiClient.get("/bookings/consultant/schedule"); 

export const getConsultantCalendar = (consultantId) =>
  apiClient.get(`/bookings/calendar/${consultantId}`); 

export const getBookingHistory = (params) =>
  apiClient.get("/bookings/history", { params }); 

export const cancelBooking = (bookingId) =>
  apiClient.put(`/bookings/cancel/${bookingId}`); 


export const rescheduleBooking = ({ bookingId, newDate }) =>
  apiClient.put("/bookings/reschedule", {
    bookingId,
    newBookingDate: newDate, 
  });



export const confirmPayment = (params) =>
  apiClient.get("/bookings/payment-return", { params }); 
