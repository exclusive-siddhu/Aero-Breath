import { createSlice } from "@reduxjs/toolkit";

const initialState = { logs: [], loading: false, error: null };

const healthSlice = createSlice({
  name: "health",
  initialState,
  reducers: {
    setLogs: (state, action) => {
      state.logs = action.payload;
    },
    addLog: (state, action) => {
      state.logs.unshift(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder.addCase("auth/logout", () => initialState);
  }
});

export const { setLogs, addLog } = healthSlice.actions;
export default healthSlice.reducer;