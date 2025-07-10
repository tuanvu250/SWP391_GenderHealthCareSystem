import apiClient from "./apiClient";

export const getUserAndBookingStatsAPI = async () => {
    return apiClient.get("/report/user-and-booking");
}

export const getRevenueStatsAPI = async () => {
    return apiClient.get("/report/monthly-revenue");
}