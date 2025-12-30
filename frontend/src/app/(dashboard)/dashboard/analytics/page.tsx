'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { analyticsApi } from '@/lib/api/analytics';
import {
  DashboardStats,
  PatientsByGoal,
  PatientProgress,
  InactivePatient,
  BMIDistribution,
} from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  FileText,
  Scale,
  Activity,
  Target,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  BarChart3,
} from 'lucide-react';
import PatientsByGoalChart from '@/components/dashboard/PatientsByGoalChart';
import BMIDistributionChart from '@/components/dashboard/BMIDistributionChart';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function AnalyticsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [patientsByGoal, setPatientsByGoal] = useState<PatientsByGoal[]>([]);
  const [topProgress, setTopProgress] = useState<PatientProgress[]>([]);
  const [inactivePatients, setInactivePatients] = useState<InactivePatient[]>([]);
  const [bmiDistribution, setBmiDistribution] = useState<BMIDistribution[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, goalData, progressData, inactiveData, bmiData] = await Promise.all([
        analyticsApi.getDashboardStats(),
        analyticsApi.getPatientsByGoal(),
        analyticsApi.getTopProgress(5),
        analyticsApi.getInactivePatients(30),
        analyticsApi.getBMIDistribution(),
      ]);

      setStats(statsData);
      setPatientsByGoal(goalData);
      setTopProgress(progressData);
      setInactivePatients(inactiveData);
      setBmiDistribution(bmiData);
    } catch (error) {
      console.error('Erro ao carregar analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Analytics</h1>
        <p className="text-gray-600 mt-1">Visão geral do seu consultório</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Users className="mr-2 h-4 w-4 text-blue-500" />
              Total de Pacientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.totalPatients || 0}</p>
            <p className="text-xs text-gray-600 mt-1">
              {stats?.activePatientsThisMonth || 0} ativos nos últimos 30 dias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <FileText className="mr-2 h-4 w-4 text-green-500" />
              Total de Dietas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.totalDiets || 0}</p>
            <p className="text-xs text-gray-600 mt-1">
              Dietas criadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Scale className="mr-2 h-4 w-4 text-purple-500" />
              Medições de Peso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.totalWeightMeasurements || 0}</p>
            <p className="text-xs text-gray-600 mt-1">
              Registros de peso
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Activity className="mr-2 h-4 w-4 text-orange-500" />
              Medidas Corporais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.totalBodyMeasurements || 0}</p>
            <p className="text-xs text-gray-600 mt-1">
              Avaliações corporais
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Target className="mr-2 h-4 w-4 text-red-500" />
              Pacientes com Metas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.patientsWithGoals || 0}</p>
            <p className="text-xs text-gray-600 mt-1">
              Definidas
            </p>
          </CardContent>
        </Card>

        <Card className={inactivePatients.length > 0 ? 'border-orange-200 bg-orange-50' : ''}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <AlertTriangle className="mr-2 h-4 w-4 text-orange-500" />
              Pacientes Inativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-600">{inactivePatients.length}</p>
            <p className="text-xs text-gray-600 mt-1">
              Sem medições há +30 dias
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-blue-600" />
              Pacientes por Objetivo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PatientsByGoalChart data={patientsByGoal} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5 text-green-600" />
              Distribuição de IMC
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BMIDistributionChart data={bmiDistribution} />
          </CardContent>
        </Card>
      </div>

      {/* Top Progresso */}
      {topProgress.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingDown className="mr-2 h-5 w-5 text-green-600" />
              Melhores Resultados (Evolução de Peso)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topProgress.map((patient) => (
                <div
                  key={patient.patientId}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => router.push(`/dashboard/patients/${patient.patientId}`)}
                >
                  <div className="flex-1">
                    <p className="font-semibold">{patient.patientName}</p>
                    <p className="text-sm text-gray-600">
                      {patient.initialWeight.toFixed(1)}kg → {patient.currentWeight.toFixed(1)}kg
                      <span className="ml-2 text-xs">
                        ({patient.daysSinceStart} dias)
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center gap-1 font-semibold ${
                      patient.weightChange < 0 ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {patient.weightChange < 0 ? (
                        <TrendingDown size={18} />
                      ) : (
                        <TrendingUp size={18} />
                      )}
                      {patient.weightChange > 0 ? '+' : ''}{patient.weightChange.toFixed(1)}kg
                    </div>
                    <p className="text-xs text-gray-600">
                      {patient.weeklyAverage.toFixed(2)}kg/semana
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pacientes Inativos */}
      {inactivePatients.length > 0 && (
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-700">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Pacientes Sem Acompanhamento Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {inactivePatients.slice(0, 5).map((patient) => (
                <div
                  key={patient.patientId}
                  className="flex items-center justify-between p-4 bg-orange-50 rounded-lg hover:bg-orange-100 cursor-pointer transition-colors"
                  onClick={() => router.push(`/dashboard/patients/${patient.patientId}`)}
                >
                  <div>
                    <p className="font-semibold">{patient.patientName}</p>
                    <p className="text-sm text-gray-600">
                      {patient.lastWeightMeasurement
                        ? `Última medição: ${format(new Date(patient.lastWeightMeasurement), "dd/MM/yyyy", { locale: ptBR })}`
                        : 'Sem medições registradas'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-orange-600">
                      {patient.daysSinceLastMeasurement} dias
                    </p>
                    <p className="text-xs text-gray-600">sem medições</p>
                  </div>
                </div>
              ))}
            </div>
            {inactivePatients.length > 5 && (
              <p className="text-sm text-gray-600 text-center mt-4">
                + {inactivePatients.length - 5} paciente(s) inativo(s)
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}