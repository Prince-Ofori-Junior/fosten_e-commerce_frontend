// src/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://fosten-e-commerce-backend.onrender.com/", // adjust if backend URL changes
});

// Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
