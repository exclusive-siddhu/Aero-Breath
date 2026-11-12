import api from "./api";

export const getLatestMetric = async (city) => {
  const cityName = String(city ?? "").trim();

  if (!cityName) return null;

  const response = await api.get(
    `/api/metrics/latest/${encodeURIComponent(cityName)}`
  );

  return response.data || null;
};

export const recordMetric = async (metricData) => {
  const response = await api.post("/api/metrics", metricData);
  return response.data;
};

export const metricService = {
  getLatestMetric,
  recordMetric
};

export default metricService;