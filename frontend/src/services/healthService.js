import api from "./api";

export const getUserHistory = async () => {
  const response = await api.get("/api/health");
  return response?.data ?? response;
};

export const logSymptoms = async (symptomData) => {
  const response = await api.post("/api/health", symptomData);
  return response?.data ?? response;
};

export const healthService = {
  getUserHistory,
  logSymptoms
};

export default healthService;