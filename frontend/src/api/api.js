import axios from "axios";

// Normalize base URL and ensure we always hit the Express "/api" prefix
const rawBase = process.env.REACT_APP_API_URL || "";
const trimmedBase = rawBase.replace(/\/+$/, "");

const API = axios.create({
  baseURL: `${trimmedBase}/api`,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
