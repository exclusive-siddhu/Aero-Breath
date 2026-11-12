import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import stationReducer from './slices/stationSlice';
import healthReducer from './slices/healthSlice';
import metricReducer from './slices/metricSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        stations: stationReducer,
        health: healthReducer,
        metrics: metricReducer,
    },
});

export default store;