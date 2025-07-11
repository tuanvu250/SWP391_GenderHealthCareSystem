import apiClient from "./apiClient";

export const getAllConsultants = async () => {
  try {
    const response = await apiClient.get("/consultant/profile/active");
    return response.data;
  } catch (error) {
    console.error("Error fetching consultants:", error);
    return [];
  }
};

export const createConsultantProfileAPI = async (data) => {
  return apiClient.post("/consultant/profile", data);
}

export const getConsultantProfileAPI = async (consultantId) => {
  return apiClient.get(`/consultant/profile/${consultantId}`);
}

export const editHourlyRateAPI = async (consultantId, hourlyRate) => {
  return apiClient.put(`/consultant/profile/${consultantId}/hourly-rate?hourlyRate=${hourlyRate}`);
}

export const editEmploymentStatusAPI = async (consultantId, employmentStatus) => {
  return apiClient.put(`/consultant/profile/${consultantId}/employment-status?employmentStatus=${employmentStatus}`);
}
