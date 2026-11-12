import api from "./api";

export const getAllStations = async () => {
  const response = await api.get("/api/stations");
  return response?.data ?? response;
};

export const getStationById = async (id) => {
  const response = await api.get(`/api/stations/${encodeURIComponent(id)}`);
  return response?.data ?? response;
};

export const createStation = async (data) => {
  const response = await api.post("/api/stations", data);
  return response?.data ?? response;
};

export const updateStation = async (id, data) => {
  const response = await api.put(
    `/api/stations/${encodeURIComponent(id)}`,
    data
  );
  return response?.data ?? response;
};

export const deleteStation = async (id) => {
  const response = await api.delete(`/api/stations/${encodeURIComponent(id)}`);
  return response?.data ?? response;
};

export const stationService = {
  getAllStations,
  getStationById,
  createStation,
  updateStation,
  deleteStation
};

export default stationService;