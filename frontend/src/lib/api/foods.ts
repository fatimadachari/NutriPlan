import apiClient from './client';
import { Food } from '@/types';

export const foodsApi = {
  async getAll(search?: string): Promise<Food[]> {
    const response = await apiClient.get('/foods', {
      params: { search },
    });
    return response.data;
  },
};