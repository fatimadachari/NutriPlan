import apiClient from './client';
import { LoginDto, RegisterDto, User } from '@/types';

export const authApi = {
  async login(data: LoginDto): Promise<User> {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  async register(data: RegisterDto): Promise<User> {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },
};