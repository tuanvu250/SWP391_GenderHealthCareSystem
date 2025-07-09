import apiClient from "./apiClient";

export const getAllUsersAPI = async ({
  name = "",
  phone = "",
  email = "",
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
    email,
    page,
    size,
    startDate,
    endDate,
    role,
    status,
  }).toString();
  return apiClient.get(`/users/Search?${params.toString()}`);
};

export const createUserAPI = async (userData) => {
  //userData.account.usename = userData.usename;
  console.log(">>> userData", userData);
  return apiClient.post("/users/create", userData);
}

export const editUserAPI = async (userId, userData) => {
  return apiClient.put(`/users/${userId}`, userData);
}

export const pathStatusUserAPI = async (accountsId, status) => {
  const accountStatus = status
  return apiClient.patch(`/accounts/${accountsId}/status`, { accountStatus });
}
