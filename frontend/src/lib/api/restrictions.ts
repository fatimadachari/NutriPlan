import apiClient from './client';
import { Allergy, HealthCondition, DietaryPreference } from '@/types';

export const restrictionsApi = {
  async getAllergies(): Promise<Allergy[]> {
    const response = await apiClient.get('/allergies');
    return response.data;
  },

  async getHealthConditions(): Promise<HealthCondition[]> {
    const response = await apiClient.get('/healthconditions');
    return response.data;
  },

  async getDietaryPreferences(): Promise<DietaryPreference[]> {
    const response = await apiClient.get('/dietarypreferences');
    return response.data;
  },

  async updatePatientRestrictions(
    patientId: string,
    data: {
      allergyIds: string[];
      healthConditionIds: string[];
      dietaryPreferenceIds: string[];
    }
  ): Promise<void> {
    await apiClient.put(`/patients/${patientId}/restrictions`, data);
  },
};