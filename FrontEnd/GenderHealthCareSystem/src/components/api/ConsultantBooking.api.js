import apiClient from "./apiClient";

export const createConsultationBooking = (payload) =>
  apiClient.post("/bookings", payload);

export const getConsultantSchedule = ({
  page = 0,
  size = 10,
  status = "",
  customerName = "",
  startDate = "",
  endDate = "",
}) => {
  const params = new URLSearchParams({
    page,
    size,
    status,
    customerName,
    startDate,
    endDate,
  }).toString();
  return apiClient.get(`/bookings/consultant/schedule/search?${params}`);
};

export const getConsultantCalendar = (consultantId) =>
  apiClient.get(`/bookings/calendar/${consultantId}`);

export const getBookingHistory = ({ page = 0, size = 10 }) => {
  const params = new URLSearchParams({
    page,
    size,
  }).toString();
  return apiClient.get(`/bookings/history?${params}`);
};

export const cancelBooking = (bookingId) =>
  apiClient.put(`/bookings/cancel/${bookingId}`);

export const rescheduleBooking = ({ bookingId, newDate }) =>
  apiClient.put("/bookings/reschedule", {
    bookingId,
    newBookingDate: newDate,
  });

export const confirmPayment = (params) =>
  apiClient.get("/bookings/payment-return", { params });

export const updateBookingStatus = (bookingId, status) =>
  apiClient.put(`/bookings/${bookingId}/status`, null, {
    params: { status },
  });

export const getAllBookings = ({
  page = 0,
  size = 10,
  status = "",
  consultantName = "",
  startDate = "",
  endDate = "",
}) => {
  const params = new URLSearchParams({
    page,
    size,
    status,
    consultantName,
    startDate,
    endDate,
  }).toString();
  return apiClient.get(`/bookings/search?${params}`);
};

export const updateBookingMeetLink = (bookingId, meetLink) => {
  return apiClient.put(`/bookings/update-meeting-link/${bookingId}?meetingLink=${meetLink}`);
};
