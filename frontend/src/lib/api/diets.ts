import apiClient from './client';
import { Diet } from '@/types';

export const dietsApi = {
  async getByPatient(patientId: string): Promise<Diet[]> {
    const response = await apiClient.get(`/diets/patient/${patientId}`);
    return response.data;
  },

  async getById(id: string): Promise<Diet> {
    const response = await apiClient.get(`/diets/${id}`);
    return response.data;
  },

  async create(patientId: string): Promise<Diet> {
    const response = await apiClient.post('/diets', { patientId });
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/diets/${id}`);
  },

  async downloadPdf(id: string): Promise<Blob> {
    const response = await apiClient.get(`/diets/${id}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export const mealsApi = {
  async create(data: { name: string; order: number; dietId: string }) {
    const response = await apiClient.post('/meals', data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/meals/${id}`);
  },
};

export const mealFoodsApi = {
  async addFood(data: { mealId: string; foodId: string; quantity: number }) {
    const response = await apiClient.post('/mealfoods', data);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/mealfoods/${id}`);
  },
};