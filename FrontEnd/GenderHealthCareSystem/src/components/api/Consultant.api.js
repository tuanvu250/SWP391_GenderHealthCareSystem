import axios from "axios";

export const getAllConsultants = async () => {
  const res = await axios.get("/consultant/profile/all");
  return res.data;
};
