/** @format */

import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

/* 🔥 ADD THIS (VERY IMPORTANT) */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  // console.log("TOKEN SENT:", token); // ✅ debug

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
