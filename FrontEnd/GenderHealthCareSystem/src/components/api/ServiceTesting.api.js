import apiClient from "./apiClient";

export const postServiceTestingAPI = async (values) => {
  const data = {
    serviceName: values.serviceName,
    price: values.price,
    duration: values.duration,
    description: values.description,
    tests: values.tests.join(", "),
    discount: values.discount,
    type: values.type,
    status: values.status,
  };
  return apiClient.post("/stis-services", data);
};

export const getServiceTestingAPI = async ({
  page = 0,
  size = 10,
  serviceName = "",
  status = "",
}) => {
  const query = new URLSearchParams({
    page,
    size,
    serviceName,
    status,
  }).toString();
  return apiClient.get(`/stis-services/all?${query}`);
};

export const editServiceTestingAPI = async (id, values) => {
  const data = {
    serviceName: values.serviceName,
    price: values.price,
    duration: values.duration,
    description: values.description,
    tests: values.tests.join(", "),
    discount: values.discount,
    type: values.type,
    status: values.status,
  };
  return apiClient.put(`/stis-services/${id}`, data);
}

export const deleteServiceTestingAPI = async (id) => {
  return apiClient.delete(`/stis-services/${id}`);
};

export const getServiceCombosAPI = async () => {
  return apiClient.get("/stis-services/combo");
}

export const getServiceSingleAPI = async () => {
  return apiClient.get(`/stis-services/single`);
}
