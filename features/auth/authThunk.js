// features/auth/authThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Replace with your real API endpoint
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/auth/login", credentials);      
      localStorage.setItem("user",JSON.stringify(response.data.user))
      localStorage.setItem("token",response.data.token)
      return response.data; // Should contain user and token
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);


export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async(userData, {rejectWithValue}) => {
    try {
      const response = await axios.post("http://localhost:8080/api/auth/register", userData); // Adjust URL
      console.log(response.data.token);
      localStorage.setItem("user",JSON.stringify(response.data.user))
      localStorage.setItem("token",response.data.token)
      return response.data;
    } catch (error) {
       return rejectWithValue(error.response.data.message || "Registration failed");
    }
  }
)