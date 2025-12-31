import axios from 'axios';
import { CreateAnamneseDto, UpdateAnamneseDto, AnamneseResponseDto } from '@/types/anamnese';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

class AnamneseService {
    private getAuthHeader() {
        const token = localStorage.getItem('token');
        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    }

    async getAll(): Promise<AnamneseResponseDto[]> {
        const response = await axios.get(
            `${API_BASE_URL}/Anamnese`,
            this.getAuthHeader()
        );
        return response.data;
    }

    async getById(id: string): Promise<AnamneseResponseDto> {
        const response = await axios.get(
            `${API_BASE_URL}/Anamnese/${id}`,
            this.getAuthHeader()
        );
        return response.data;
    }

    async getByPatientId(patientId: string): Promise<AnamneseResponseDto> {
        const response = await axios.get(
            `${API_BASE_URL}/Anamnese/patient/${patientId}`,
            this.getAuthHeader()
        );
        return response.data;
    }

    async create(data: CreateAnamneseDto): Promise<AnamneseResponseDto> {
        const response = await axios.post(
            `${API_BASE_URL}/Anamnese`,
            data,
            this.getAuthHeader()
        );
        return response.data;
    }

    async update(id: string, data: UpdateAnamneseDto): Promise<AnamneseResponseDto> {
        const response = await axios.put(
            `${API_BASE_URL}/Anamnese/${id}`,
            data,
            this.getAuthHeader()
        );
        return response.data;
    }

    async delete(id: string): Promise<void> {
        await axios.delete(
            `${API_BASE_URL}/Anamnese/${id}`,
            this.getAuthHeader()
        );
    }
}

export default new AnamneseService();