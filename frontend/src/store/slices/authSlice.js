import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.token = action.payload?.token || null;
      state.loading = false;
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase("auth/login/fulfilled", (state, action) => {
      state.user = action.payload;
      state.token = action.payload?.token || null;
    });
  }
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;