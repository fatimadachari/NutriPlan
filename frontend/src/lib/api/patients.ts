import apiClient from './client';
import { Patient } from '@/types';

export const patientsApi = {
  async getAll(): Promise<Patient[]> {
    const response = await apiClient.get('/patients');
    return response.data;
  },

  async getById(id: string): Promise<Patient> {
    const response = await apiClient.get(`/patients/${id}`);
    return response.data;
  },

  async create(data: Omit<Patient, 'id' | 'createdAt'>): Promise<Patient> {
    const response = await apiClient.post('/patients', data);
    return response.data;
  },

  async update(id: string, data: Omit<Patient, 'id' | 'createdAt' | 'nutritionistId'>): Promise<Patient> {
    const response = await apiClient.put(`/patients/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/patients/${id}`);
  },
};