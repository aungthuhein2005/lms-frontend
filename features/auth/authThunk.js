// features/auth/authThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Replace with your real API endpoint
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/auth/login", credentials);
      return response.data; // Should contain user and token
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);
