import { createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import api from "../../../utils/axios.js";

export const isAdmin = createAsyncThunk(
  "auth/isAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/is-admin");
      return response.data.success;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
