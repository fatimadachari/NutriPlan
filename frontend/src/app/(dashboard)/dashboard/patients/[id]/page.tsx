'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { patientsApi } from '@/lib/api/patients';
import { dietsApi } from '@/lib/api/diets';
import { Patient, Diet } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, FileDown, Edit, Trash2 } from 'lucide-react';

export default function PatientDietsPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [diets, setDiets] = useState<Diet[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadData();
  }, [patientId]);

  const loadData = async () => {
    try {
      const [patientData, dietsData] = await Promise.all([
        patientsApi.getById(patientId),
        dietsApi.getByPatient(patientId),
      ]);
      setPatient(patientData);
      setDiets(dietsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDiet = async () => {
    setCreating(true);
    try {
      const newDiet = await dietsApi.create(patientId);
      router.push(`/dashboard/diets/${newDiet.id}`);
    } catch (error) {
      console.error('Erro ao criar dieta:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteDiet = async (dietId: string) => {
    if (confirm('Tem certeza que deseja excluir esta dieta?')) {
      try {
        await dietsApi.delete(dietId);
        loadData();
      } catch (error) {
        console.error('Erro ao excluir dieta:', error);
      }
    }
  };

  const handleDownloadPdf = async (dietId: string) => {
    try {
      const blob = await dietsApi.downloadPdf(dietId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dieta-${dietId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao baixar PDF:', error);
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!patient) {
    return <div>Paciente não encontrado</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/dashboard/patients')}
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{patient.name}</h1>
            <p className="text-gray-600 mt-1">
              {patient.age} anos | {patient.weight}kg | {patient.height}cm | {patient.goal}
            </p>
          </div>
        </div>
        <Button onClick={handleCreateDiet} disabled={creating}>
          <Plus className="mr-2" size={20} />
          {creating ? 'Criando...' : 'Nova Dieta'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dietas do Paciente</CardTitle>
        </CardHeader>
        <CardContent>
          {diets.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Nenhuma dieta criada ainda.</p>
              <Button onClick={handleCreateDiet} disabled={creating}>
                <Plus className="mr-2" size={20} />
                {creating ? 'Criando...' : 'Criar Primeira Dieta'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {diets.map((diet) => (
                <Card key={diet.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500">
                          Criada em {new Date(diet.createdDate).toLocaleDateString('pt-BR')}
                        </p>
                        <div className="flex space-x-6 text-sm">
                          <div>
                            <span className="font-medium">Calorias:</span>{' '}
                            <span className="text-green-600 font-bold">
                              {diet.totalCalories.toFixed(1)} kcal
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">Proteínas:</span>{' '}
                            {diet.totalProtein.toFixed(1)}g
                          </div>
                          <div>
                            <span className="font-medium">Carboidratos:</span>{' '}
                            {diet.totalCarbs.toFixed(1)}g
                          </div>
                          <div>
                            <span className="font-medium">Gorduras:</span>{' '}
                            {diet.totalFat.toFixed(1)}g
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">
                          {diet.meals.length} refeição(ões)
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/dashboard/diets/${diet.id}`)}
                        >
                          <Edit size={16} className="mr-1" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadPdf(diet.id)}
                        >
                          <FileDown size={16} className="mr-1" />
                          PDF
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteDiet(diet.id)}
                        >
                          <Trash2 size={16} className="text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}