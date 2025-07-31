import { configureStore } from '@reduxjs/toolkit';
import walletReducer from './walletSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    wallet: walletReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;