import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const registerAPI = async (userData) => {
    return api.post("/auth/register", userData);
}

export const loginAPI = async (userData) => {
    return api.post("/auth/login", userData);
}