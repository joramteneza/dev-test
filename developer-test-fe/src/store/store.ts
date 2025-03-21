// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { usersApi } from '../features/usersSlice'; // Import users API slice

export const store = configureStore({
  reducer: {
    [usersApi.reducerPath]: usersApi.reducer, // Register users API slice in the store
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(usersApi.middleware), // Add API middleware
});
