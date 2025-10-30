import { createSlice } from "@reduxjs/toolkit";
import { isAdmin } from "./adminThunk.js";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    loading: false,
    queries: null,
    error: null,
    isAdminThere: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(isAdmin.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(isAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAdminThere = true;
      })
      .addCase(isAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminSlice.reducer;
