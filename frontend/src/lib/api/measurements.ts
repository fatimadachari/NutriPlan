import apiClient from './client';
import { WeightHistory, BodyMeasurement } from '@/types';

export const measurementsApi = {
  // Weight History
  async getWeightHistory(patientId: string): Promise<WeightHistory[]> {
    const response = await apiClient.get(`/weighthistory/patient/${patientId}`);
    return response.data;
  },

  async createWeightHistory(data: {
    patientId: string;
    weight: number;
    measurementDate: string;
    notes?: string;
  }): Promise<WeightHistory> {
    const response = await apiClient.post('/weighthistory', data);
    return response.data;
  },

  async deleteWeightHistory(id: string): Promise<void> {
    await apiClient.delete(`/weighthistory/${id}`);
  },

  // Body Measurements
  async getBodyMeasurements(patientId: string): Promise<BodyMeasurement[]> {
    const response = await apiClient.get(`/bodymeasurements/patient/${patientId}`);
    return response.data;
  },

  async createBodyMeasurement(data: {
    patientId: string;
    measurementDate: string;
    neck?: number;
    chest?: number;
    waist?: number;
    abdomen?: number;
    hip?: number;
    rightArm?: number;
    leftArm?: number;
    rightThigh?: number;
    leftThigh?: number;
    rightCalf?: number;
    leftCalf?: number;
    bodyFatPercentage?: number;
    muscleMassPercentage?: number;
    notes?: string;
  }): Promise<BodyMeasurement> {
    const response = await apiClient.post('/bodymeasurements', data);
    return response.data;
  },

  async deleteBodyMeasurement(id: string): Promise<void> {
    await apiClient.delete(`/bodymeasurements/${id}`);
  },
};