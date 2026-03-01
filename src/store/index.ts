import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './auth.slice';
import { uiReducer } from './ui.slice';
import { demoReducer } from './demo.slice';

export const store = configureStore({
  reducer: { auth: authReducer, ui: uiReducer, demo: demoReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
