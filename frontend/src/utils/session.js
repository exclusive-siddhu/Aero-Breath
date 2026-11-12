const AUTH_KEYS = ["user", "role", "token"];

export const getStored = (key) => {
  for (const name of ["sessionStorage", "localStorage"]) {
    try {
      const value = window[name].getItem(key);
      if (value !== null) return value;
    } catch {}
  }
  return null;
};

export const clearSession = () => {
  for (const name of ["localStorage", "sessionStorage"]) {
    try {
      AUTH_KEYS.forEach((key) => window[name].removeItem(key));
    } catch {}
  }
};

export const readUser = () => {
  try {
    if (!getStored("token")) return null;
    const user = JSON.parse(getStored("user"));
    return user && typeof user === "object" ? user : null;
  } catch {
    return null;
  }
};

export const saveSession = (user, token, remember) => {
  clearSession();

  try {
    const storage = remember ? window.localStorage : window.sessionStorage;
    storage.setItem("user", JSON.stringify(user));
    storage.setItem("role", user.role);
    storage.setItem("token", token);
  } catch {
    clearSession();
    throw new Error(
      "Your browser could not save the session. Allow site storage and try again."
    );
  }
};

export const canManageStations = (role) =>
  ["SYSTEM_ADMIN", "ENVIRONMENTAL_OFFICER", "ADMIN"].includes(role);

export const roleLabel = (role) =>
  String(role || "CITIZEN")
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

export const errorMessage = (
  error,
  fallback = "Something went wrong. Please try again."
) => {
  const status = error?.response?.status;

  if (status === 401) {
    return "Your session has expired. Please sign in again.";
  }
  if (status === 403) {
    return "Your account does not have permission to perform this action.";
  }
  if (!error?.response && error?.isAxiosError) {
    return "Unable to reach the server. Check your connection and try again.";
  }

  const message = error?.response?.data?.message;
  return typeof message === "string" ? message : error?.message || fallback;
};

export const asList = (value) => {
  const data = value?.data ?? value;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  return [];
};

export const finiteNumber = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const number = typeof value === "number" ? value : Number.parseFloat(value);
  return Number.isFinite(number) ? number : null;
};