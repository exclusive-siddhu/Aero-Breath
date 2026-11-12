import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  loading: false,
  error: null,
  searchQuery: ""
};

const stationSlice = createSlice({
  name: "stations",
  initialState,
  reducers: {
    setStations: (state, action) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    addStation: (state, action) => {
      const index = state.items.findIndex(
        (station) => String(station.id) === String(action.payload.id)
      );

      if (index < 0) {
        state.items.push(action.payload);
      } else {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },
    removeStation: (state, action) => {
      state.items = state.items.filter(
        (station) => String(station.id) !== String(action.payload)
      );
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    }
  },
  extraReducers: (builder) => {
    builder.addCase("auth/logout", () => initialState);
  }
});

export const {
  setStations,
  addStation,
  removeStation,
  setSearchQuery,
  setLoading,
  setError
} = stationSlice.actions;

export default stationSlice.reducer;