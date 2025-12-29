'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { patientsApi } from '@/lib/api/patients';
import { measurementsApi } from '@/lib/api/measurements';
import { Patient, WeightHistory, BodyMeasurement } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, Trash2, TrendingDown, TrendingUp } from 'lucide-react';
import WeightChart from '@/components/measurements/WeightChart';
import AddWeightDialog from '@/components/measurements/AddWeightDialog';
import AddBodyMeasurementDialog from '@/components/measurements/AddBodyMeasurementDialog';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function PatientMeasurementsPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [weightHistory, setWeightHistory] = useState<WeightHistory[]>([]);
  const [bodyMeasurements, setBodyMeasurements] = useState<BodyMeasurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [weightDialogOpen, setWeightDialogOpen] = useState(false);
  const [measurementDialogOpen, setMeasurementDialogOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, [patientId]);

  const loadData = async () => {
    try {
      const [patientData, weightData, measurementData] = await Promise.all([
        patientsApi.getById(patientId),
        measurementsApi.getWeightHistory(patientId),
        measurementsApi.getBodyMeasurements(patientId),
      ]);

      setPatient(patientData);
      setWeightHistory(weightData);
      setBodyMeasurements(measurementData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWeight = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este registro?')) {
      try {
        await measurementsApi.deleteWeightHistory(id);
        loadData();
      } catch (error) {
        console.error('Erro ao excluir:', error);
      }
    }
  };

  const handleDeleteMeasurement = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este registro?')) {
      try {
        await measurementsApi.deleteBodyMeasurement(id);
        loadData();
      } catch (error) {
        console.error('Erro ao excluir:', error);
      }
    }
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { text: 'Abaixo do peso', color: 'text-blue-600' };
    if (bmi < 25) return { text: 'Peso normal', color: 'text-green-600' };
    if (bmi < 30) return { text: 'Sobrepeso', color: 'text-yellow-600' };
    return { text: 'Obesidade', color: 'text-red-600' };
  };

  const getWeightTrend = () => {
    if (weightHistory.length < 2) return null;
    const latest = weightHistory[0].weight;
    const previous = weightHistory[1].weight;
    const diff = latest - previous;

    return {
      value: Math.abs(diff).toFixed(1),
      isUp: diff > 0,
    };
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!patient) {
    return <div>Paciente não encontrado</div>;
  }

  const trend = getWeightTrend();
  const latestWeight = weightHistory[0];
  const latestMeasurement = bodyMeasurements[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Medições - {patient.name}
            </h1>
            <p className="text-gray-600 mt-1">Acompanhamento de peso e medidas corporais</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setWeightDialogOpen(true)}>
            <Plus className="mr-2" size={20} />
            Adicionar Peso
          </Button>
          <Button onClick={() => setMeasurementDialogOpen(true)}>
            <Plus className="mr-2" size={20} />
            Adicionar Medidas
          </Button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Peso Atual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <p className="text-3xl font-bold">{latestWeight?.weight.toFixed(1) || patient.weight} kg</p>
              {trend && (
                <div className={`flex items-center text-sm ${trend.isUp ? 'text-red-600' : 'text-green-600'}`}>
                  {trend.isUp ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
                  {trend.value} kg
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">IMC Atual</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{latestWeight?.bmi.toFixed(1) || '--'}</p>
            {latestWeight && (
              <p className={`text-sm mt-1 ${getBMICategory(latestWeight.bmi).color}`}>
                {getBMICategory(latestWeight.bmi).text}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total de Registros</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{weightHistory.length}</p>
            <p className="text-sm text-gray-600 mt-1">medições de peso</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Evolução */}
      <Card>
        <CardHeader>
          <CardTitle>Evolução do Peso</CardTitle>
        </CardHeader>
        <CardContent>
          <WeightChart data={weightHistory} />
        </CardContent>
      </Card>

      {/* Histórico de Peso */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Peso</CardTitle>
        </CardHeader>
        <CardContent>
          {weightHistory.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Nenhum registro de peso ainda</p>
          ) : (
            <div className="space-y-3">
              {weightHistory.map((weight) => (
                <div key={weight.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-semibold text-lg">{weight.weight.toFixed(1)} kg</p>
                        <p className="text-sm text-gray-600">
                          IMC: {weight.bmi.toFixed(1)} - {getBMICategory(weight.bmi).text}
                        </p>
                      </div>
                      <div className="text-sm text-gray-600">
                        {format(new Date(weight.measurementDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </div>
                    </div>
                    {weight.notes && (
                      <p className="text-sm text-gray-600 mt-2 italic">{weight.notes}</p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteWeight(weight.id)}
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Medidas Corporais */}
      <Card>
        <CardHeader>
          <CardTitle>Medidas Corporais</CardTitle>
        </CardHeader>
        <CardContent>
          {bodyMeasurements.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Nenhuma medida corporal registrada</p>
          ) : (
            <div className="space-y-4">
              {bodyMeasurements.map((measurement) => (
                <div key={measurement.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-semibold">
                      {format(new Date(measurement.measurementDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteMeasurement(measurement.id)}
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    {measurement.neck && <div><span className="text-gray-600">Pescoço:</span> <span className="font-medium">{measurement.neck} cm</span></div>}
                    {measurement.chest && <div><span className="text-gray-600">Peitoral:</span> <span className="font-medium">{measurement.chest} cm</span></div>}
                    {measurement.waist && <div><span className="text-gray-600">Cintura:</span> <span className="font-medium">{measurement.waist} cm</span></div>}
                    {measurement.abdomen && <div><span className="text-gray-600">Abdômen:</span> <span className="font-medium">{measurement.abdomen} cm</span></div>}
                    {measurement.hip && <div><span className="text-gray-600">Quadril:</span> <span className="font-medium">{measurement.hip} cm</span></div>}
                    {measurement.rightArm && <div><span className="text-gray-600">Braço D:</span> <span className="font-medium">{measurement.rightArm} cm</span></div>}
                    {measurement.leftArm && <div><span className="text-gray-600">Braço E:</span> <span className="font-medium">{measurement.leftArm} cm</span></div>}
                    {measurement.rightThigh && <div><span className="text-gray-600">Coxa D:</span> <span className="font-medium">{measurement.rightThigh} cm</span></div>}
                    {measurement.leftThigh && <div><span className="text-gray-600">Coxa E:</span> <span className="font-medium">{measurement.leftThigh} cm</span></div>}
                    {measurement.rightCalf && <div><span className="text-gray-600">Pant. D:</span> <span className="font-medium">{measurement.rightCalf} cm</span></div>}
                    {measurement.leftCalf && <div><span className="text-gray-600">Pant. E:</span> <span className="font-medium">{measurement.leftCalf} cm</span></div>}
                    {measurement.bodyFatPercentage && <div><span className="text-gray-600">% Gordura:</span> <span className="font-medium">{measurement.bodyFatPercentage}%</span></div>}
                    {measurement.muscleMassPercentage && <div><span className="text-gray-600">% Músculo:</span> <span className="font-medium">{measurement.muscleMassPercentage}%</span></div>}
                  </div>
                  {measurement.notes && (
                    <p className="text-sm text-gray-600 mt-3 italic">{measurement.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <AddWeightDialog
        open={weightDialogOpen}
        onOpenChange={setWeightDialogOpen}
        patientId={patientId}
        onSuccess={loadData}
      />

      <AddBodyMeasurementDialog
        open={measurementDialogOpen}
        onOpenChange={setMeasurementDialogOpen}
        patientId={patientId}
        onSuccess={loadData}
      />
    </div>
  );
}