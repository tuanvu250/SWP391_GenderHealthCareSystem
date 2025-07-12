import apiClient from "./apiClient";

export const postFeedbackConsultantAPI = async (values) => {
  const data = {
    consultantId: values.consultantId,
    bookingId: values.bookingId,
    rating: values.rating,
    comment: values.content,
  };
  console.log("Data to post feedback:", data);
  return apiClient.post("/consultant-feedback", data);
};

export const editFeedbackConsultantAPI = async (feedbackId, rating, comment, consultantId, bookingId) => {
  const data = {
    rating,
    comment,
    consultantId,
    bookingId,
  };
  console.log("Data to edit feedback:", data);
  return apiClient.put(`/consultant-feedback/${feedbackId}`, data);
};

export const getHistoryFeedbackConsultantAPI = async ({
  page = 0,
  size = 10,
}) => {
  const queryParams = new URLSearchParams({
    page,
    size,
  }).toString();
  return apiClient.get(
    `/consultant-feedback/my-posted-feedback?${queryParams}`
  );
};

export const getMyFeedbackConsultantAPI = async ({
  page = 0,
  size = 10,
  rating = "",
  search = "",
}) => {
  const queryParams = new URLSearchParams({
    page,
    size,
    rating,
    search,
  }).toString();
  return apiClient.get(`/consultant-feedback/my-feedback?${queryParams}`);
};

export const getAllFeedbackConsultantAPI = async ({
  page = 0,
  size = 10,
  rating = "",
  consultantId = "",
  search = "",
}) => {
  const queryParams = new URLSearchParams({
    page,
    size,
    rating,
    consultantId,
    search,
  }).toString();
  return apiClient.get(`/consultant-feedback?${queryParams}`);
};

export const getAverageRatingConsultantAPI = async () => {
  return apiClient.get("/consultant-feedback/total-average");
};

export const getAverageRatingByConsultantAPI = async (consultantId) => {
  return apiClient.get(`/consultant-feedback/average/${consultantId}`);
};

export const getStatisticsFeedbackConsultantAPI = async () => {
  return apiClient.get("/consultant-feedback/rating-statistics");
};