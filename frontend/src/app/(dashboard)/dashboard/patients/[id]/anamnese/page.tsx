'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AnamneseWizard from '@/components/anamnese/AnamneseWizard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import axios from 'axios';
import anamneseService from '@/services/anamnese.service';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function AnamnesePage() {
    const params = useParams();
    const router = useRouter();
    const patientId = params.id as string;
    const [patientName, setPatientName] = useState('');
    const [loading, setLoading] = useState(true);
    const [hasAnamnese, setHasAnamnese] = useState(false);
    const [anamnese, setAnamnese] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');

                // Buscar dados do paciente
                const patientResponse = await axios.get(
                    `${API_BASE_URL}/api/Patients/${patientId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setPatientName(patientResponse.data.name);

                // Verificar se já tem anamnese
                try {
                    const anamneseData = await anamneseService.getByPatientId(patientId);
                    setHasAnamnese(true);
                    setAnamnese(anamneseData);
                } catch (error: any) {
                    if (error.response?.status === 404) {
                        setHasAnamnese(false);
                    }
                }
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [patientId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <div className="mb-6">
                <Button
                    variant="ghost"
                    onClick={() => router.push(`/dashboard/patients/${patientId}`)}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para Paciente
                </Button>
            </div>

            {hasAnamnese ? (
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-bold mb-4">Anamnese de {patientName}</h2>
                    <p className="text-gray-600 mb-4">
                        Anamnese já cadastrada em{' '}
                        {new Date(anamnese.createdAt).toLocaleDateString('pt-BR')}
                    </p>

                    {/* Visualização simplificada */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-lg">Queixa Principal:</h3>
                            <p>{anamnese.mainComplaint}</p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg">Objetivo:</h3>
                            <p>{anamnese.consultationGoal}</p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg">Refeições por Dia:</h3>
                            <p>{anamnese.mealsPerDay}</p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg">Consumo de Água:</h3>
                            <p>{anamnese.waterIntakeLiters}L por dia</p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg">Horas de Sono:</h3>
                            <p>{anamnese.sleepHoursPerDay}h por dia</p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg">Nível de Estresse:</h3>
                            <p>{anamnese.stressLevel}/10</p>
                        </div>

                        {anamnese.physicalActivity && (
                            <div>
                                <h3 className="font-semibold text-lg">Atividade Física:</h3>
                                <p>{anamnese.physicalActivity}</p>
                            </div>
                        )}
                    </div>

                    <Button className="mt-6" variant="outline">
                        Editar Anamnese (em breve)
                    </Button>
                </div>
            ) : (
                <AnamneseWizard patientId={patientId} patientName={patientName} />
            )}
        </div>
    );
}