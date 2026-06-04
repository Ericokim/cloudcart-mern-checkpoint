import apiClient from "./client";

export async function register(payload) {
  const { data } = await apiClient.post("/auth/register", payload);
  return data;
}

export async function login(payload) {
  const { data } = await apiClient.post("/auth/login", payload);
  return data;
}

export async function getProfile() {
  const { data } = await apiClient.get("/auth/profile");
  return data;
}

export async function updateProfile(payload) {
  const { data } = await apiClient.put("/auth/profile", payload);
  return data;
}

export async function changePassword(payload) {
  const { data } = await apiClient.put("/auth/password", payload);
  return data;
}
