// src/api/pill.api.js
import apiClient from "./apiClient";

export const getAllPillSchedules = () => {
  return apiClient.get("/pills/schedule/all");
};

export const markPillTaken = (scheduleId, taken) => {
  return apiClient.post(`/pills/schedule/${scheduleId}/mark?taken=${taken}`);
};

export const pillAPI = (values) => {
  return apiClient.post("/pills", values);
};
