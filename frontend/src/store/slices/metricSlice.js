import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  latest: null,
  history: [],
  loading: false,
  error: null
};

const metricSlice = createSlice({
  name: "metrics",
  initialState,
  reducers: {
    setLatestMetric: (state, action) => {
      state.latest = action.payload;
    },
    setMetricHistory: (state, action) => {
      state.history = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase("auth/logout", () => initialState);
  }
});

export const { setLatestMetric, setMetricHistory } = metricSlice.actions;
export default metricSlice.reducer;