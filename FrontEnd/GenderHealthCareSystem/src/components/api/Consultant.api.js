import apiClient from "./apiClient";

export const getAllConsultants = async () => {
  try {
    const response = await apiClient.get("/consultant/profile/all");
    return response.data;
  } catch (error) {
    console.error("Error fetching consultants:", error);
    return [];
  }
};
