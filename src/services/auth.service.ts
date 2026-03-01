import { api } from '@/lib/axios';
import type { LoginDto, SignupDto, ForgotPasswordDto, ResetPasswordDto, AuthResponse } from '@/types/auth.types';

export const authService = {
  me: () => api.get<AuthResponse['user']>('/auth/me'),
  login: (dto: LoginDto) => api.post<AuthResponse>('/auth/login', dto),
  signup: (dto: SignupDto) => api.post<AuthResponse>('/auth/signup', dto),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (dto: ForgotPasswordDto) => api.post('/auth/forgot-password', dto),
  resetPassword: (dto: ResetPasswordDto) => api.post('/auth/reset-password', dto),
  verifyEmail: (token: string) => api.post('/auth/verify-email', { token }),
  refresh: () =>
    api.post<{ accessToken: string }>('/auth/refresh', {}, { withCredentials: true }),
};
