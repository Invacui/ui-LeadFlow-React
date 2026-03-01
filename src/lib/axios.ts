import axios from 'axios';
import { store } from '@/store';
import { setToken, clearAuth } from '@/store/auth.slice';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api/v1',
  withCredentials: true,
  timeout: 15_000,
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Silent token refresh on 401
let isRefreshing = false;
let refreshQueue: Array<{ resolve: (t: string) => void; reject: (e: unknown) => void }> = [];

api.interceptors.response.use(
  (res) => res,
  async (err: unknown) => {
    if (!axios.isAxiosError(err)) return Promise.reject(err);
    const orig = err.config as typeof err.config & { _retry?: boolean };
    if (err.response?.status !== 401 || orig?._retry) return Promise.reject(err);

    if (isRefreshing) {
      return new Promise((resolve, reject) => refreshQueue.push({ resolve, reject })).then(
        (token) => {
          if (orig?.headers) orig.headers.Authorization = `Bearer ${token as string}`;
          return api(orig!);
        },
      );
    }

    orig!._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post<{ accessToken: string }>(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/refresh`,
        {},
        { withCredentials: true },
      );
      store.dispatch(setToken(data.accessToken));
      refreshQueue.forEach((q) => q.resolve(data.accessToken));
      if (orig?.headers) orig.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(orig!);
    } catch (e) {
      refreshQueue.forEach((q) => q.reject(e));
      store.dispatch(clearAuth());
      window.location.href = '/login?reason=session_expired';
      return Promise.reject(e);
    } finally {
      isRefreshing = false;
      refreshQueue = [];
    }
  },
);
