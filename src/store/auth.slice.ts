import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/types/auth.types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

const savedUser = localStorage.getItem('lf-user');
const initialState: AuthState = {
  user: savedUser ? (JSON.parse(savedUser) as User) : null,
  accessToken: null,
  isAuthenticated: !!savedUser,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (
      state,
      { payload }: PayloadAction<{ user: User; accessToken: string }>,
    ) => {
      state.user = payload.user;
      state.accessToken = payload.accessToken;
      state.isAuthenticated = true;
      localStorage.setItem('lf-user', JSON.stringify(payload.user));
    },
    setToken: (state, { payload }: PayloadAction<string>) => {
      state.accessToken = payload;
    },
    clearAuth: (state) => {
      Object.assign(state, { user: null, accessToken: null, isAuthenticated: false });
      localStorage.removeItem('lf-user');
    },
  },
});

export const { setAuth, setToken, clearAuth } = authSlice.actions;
export const authReducer = authSlice.reducer;

export const selectUser = (s: { auth: AuthState }) => s.auth.user;
export const selectIsAuthenticated = (s: { auth: AuthState }) => s.auth.isAuthenticated;
export const selectAccessToken = (s: { auth: AuthState }) => s.auth.accessToken;
