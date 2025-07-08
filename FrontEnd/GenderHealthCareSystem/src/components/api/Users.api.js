import apiClient from "./apiClient";

export const getAllUsersAPI = async ({
  name = "",
  phone = "",
  page = 1,
  size = 10,
  startDate = "",
  endDate = "",
  role = "",
  status = "",
}) => {
  const params = new URLSearchParams({
    name,
    phone,
    page,
    size,
    startDate,
    endDate,
    role,
    status,
  }).toString();
  return apiClient.get(`/users/Search?${params.toString()}`);
};
