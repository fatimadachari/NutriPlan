import apiClient from './client';
import {
  DashboardStats,
  PatientsByGoal,
  PatientProgress,
  InactivePatient,
  BMIDistribution,
} from '@/types';

export const analyticsApi = {
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await apiClient.get('/analytics/dashboard');
    return response.data;
  },

  async getPatientsByGoal(): Promise<PatientsByGoal[]> {
    const response = await apiClient.get('/analytics/patients-by-goal');
    return response.data;
  },

  async getTopProgress(limit: number = 10): Promise<PatientProgress[]> {
    const response = await apiClient.get(`/analytics/top-progress?limit=${limit}`);
    return response.data;
  },

  async getInactivePatients(daysThreshold: number = 30): Promise<InactivePatient[]> {
    const response = await apiClient.get(`/analytics/inactive-patients?daysThreshold=${daysThreshold}`);
    return response.data;
  },

  async getBMIDistribution(): Promise<BMIDistribution[]> {
    const response = await apiClient.get('/analytics/bmi-distribution');
    return response.data;
  },
};