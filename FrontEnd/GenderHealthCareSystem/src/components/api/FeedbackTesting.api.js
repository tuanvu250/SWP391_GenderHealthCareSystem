// src/api/feedback.api.js
import apiClient from "./apiClient";

export const postFeedbackTestingAPI = async (bookingId, rating, comment) => {
  const feedbackData = {
    bookingId,
    rating,
    comment,
  };
  return apiClient.post("/stis-feedback", feedbackData);
};

export const getAllFeedbackTestingAPI = async ({
  page = 0,
  size = 10,
  sort = "",
  serviceId = "",
  rating = "",
}) => {
  const query = new URLSearchParams({
    page,
    size,
    sort,
    serviceId,
    rating,
  }).toString();
  return apiClient.get(`/stis-feedback/public-feedback?${query}`);
};

export const getMyFeedbackTestingAPI = async ({
  page = 0,
  size = 10,
  sort = "",
}) => {
  const query = new URLSearchParams({
    page,
    size,
    sort,
  }).toString();
  return apiClient.get(`/stis-feedback/history?${query}`);
};

export const editFeedbackTestingAPI = async (feedbackId, rating, comment) => {
  const feedbackData = {
    rating,
    comment,
  };
  return apiClient.put(`/stis-feedback/${feedbackId}`, feedbackData);
};

export const deleteFeedbackTestingAPI = async (feedbackId) => {
  return apiClient.delete(`/stis-feedback/delete/${feedbackId}`);
};

export const hideFeedbackTestingAPI = async (feedbackId) => {
  return apiClient.put(`/stis-feedback/${feedbackId}/hide`);
};