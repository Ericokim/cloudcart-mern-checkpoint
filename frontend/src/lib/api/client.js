import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE
  ? `${import.meta.env.VITE_API_BASE}/api`
  : "/api";

const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json"
  }
});

export function getErrorMessage(error, fallback = "Something went wrong.") {
  return error.response?.data?.message || error.message || fallback;
}

export default apiClient;

