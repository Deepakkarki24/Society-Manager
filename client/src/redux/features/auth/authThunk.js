import api from "../../../utils/axios.js";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", userData, {
        withCredentials: true,
      });
      return response.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/register", userData, {
        withCredentials: true,
      });
      return response.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Register failed");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );
      return response.data.message;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to logout");
    }
  }
);

export const loadUser = createAsyncThunk(
  "auth/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/me", {
        withCredentials: true,
      });

      return response.data.user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load user"
      );
    }
  }
);
