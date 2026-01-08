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
import { Card, CardContent } from '@/components/ui/card';
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
  ChevronRight,
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
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="text-emerald-600 font-black text-[10px] uppercase tracking-widest">Sincronizando Inteligência...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="h-1.5 w-10 bg-emerald-500 rounded-full mb-3"></div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">Analytics</h1>
          <p className="text-slate-500 font-medium">Desempenho e métricas do seu consultório digital</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-2xl border border-emerald-100">
          <Activity size={16} className="text-emerald-500" />
          <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest italic">Dados em tempo real</span>
        </div>
      </div>

      {/* MÉTRICAS DE IMPACTO (GRID 3x2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: 'Base de Pacientes', value: stats?.totalPatients, sub: `${stats?.activePatientsThisMonth} ativos este mês`, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Planejamentos', value: stats?.totalDiets, sub: 'Dietas prescritas', icon: FileText, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Medições Realizadas', value: stats?.totalWeightMeasurements, sub: 'Registros antropométricos', icon: Scale, color: 'text-purple-500', bg: 'bg-purple-50' },
          { label: 'Avaliações Biométricas', value: stats?.totalBodyMeasurements, sub: 'Históricos de composição', icon: BarChart3, color: 'text-orange-500', bg: 'bg-orange-50' },
          { label: 'Foco em Resultados', value: stats?.patientsWithGoals, sub: 'Pacientes com metas ativas', icon: Target, color: 'text-red-500', bg: 'bg-red-50' },
          { label: 'Atenção Necessária', value: inactivePatients.length, sub: 'Sem retorno há +30 dias', icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50', urgent: inactivePatients.length > 0 }
        ].map((item, i) => (
          <Card key={i} className={`rounded-[2rem] border-none shadow-sm transition-all hover:shadow-xl ${item.urgent ? 'ring-2 ring-amber-200' : ''}`}>
            <CardContent className="p-7 flex items-center gap-5">
              <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center ${item.color} shrink-0`}>
                <item.icon size={28} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                <p className={`text-3xl font-black text-slate-800 tracking-tighter ${item.urgent ? 'text-amber-600' : ''}`}>{item.value || 0}</p>
                <p className="text-[11px] font-bold text-slate-500 italic mt-0.5">{item.sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* DISTRIBUIÇÕES VISUAIS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="rounded-[3rem] border-none shadow-sm bg-white p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-6 w-1 bg-blue-500 rounded-full"></div>
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Pacientes por Objetivo</h3>
          </div>
          <div className="h-[300px]">
            <PatientsByGoalChart data={patientsByGoal} />
          </div>
        </Card>

        <Card className="rounded-[3rem] border-none shadow-sm bg-white p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-6 w-1 bg-emerald-500 rounded-full"></div>
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Distribuição de IMC</h3>
          </div>
          <div className="h-[300px]">
            <BMIDistributionChart data={bmiDistribution} />
          </div>
        </Card>
      </div>

      {/* RANKING DE PERFORMANCE & ALERTAS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* TOP PROGRESSO */}
        <Card className="lg:col-span-7 rounded-[3rem] border-none shadow-sm bg-white overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingDown className="text-emerald-500" size={24} />
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter italic">Top Performance (Evolução)</h3>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="space-y-3">
              {topProgress.map((patient) => (
                <div
                  key={patient.patientId}
                  className="group flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl hover:bg-emerald-50 transition-all border border-transparent hover:border-emerald-100 cursor-pointer"
                  onClick={() => router.push(`/dashboard/patients/${patient.patientId}`)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center font-black text-emerald-600 shadow-sm group-hover:rotate-6 transition-transform">
                      {patient.patientName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-slate-800 uppercase tracking-tight">{patient.patientName}</p>
                      <p className="text-[11px] font-bold text-slate-400 italic">
                        {patient.initialWeight.toFixed(1)}kg → {patient.currentWeight.toFixed(1)}kg 
                        <span className="ml-2 bg-white px-2 py-0.5 rounded-full not-italic">⏱ {patient.daysSinceStart} dias</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center gap-1 font-black text-sm ${patient.weightChange < 0 ? 'text-emerald-600' : 'text-orange-500'}`}>
                      {patient.weightChange < 0 ? <TrendingDown size={18} /> : <TrendingUp size={18} />}
                      {patient.weightChange > 0 ? '+' : ''}{patient.weightChange.toFixed(1)}kg
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{patient.weeklyAverage.toFixed(2)}kg/sem</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* PACIENTES INATIVOS */}
        <Card className="lg:col-span-5 rounded-[3rem] border-none shadow-sm bg-white overflow-hidden border-t-4 border-t-amber-400">
          <div className="p-8 border-b border-slate-50">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-amber-500" size={24} />
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter italic">Zona de Risco</h3>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">Retenção de Pacientes</p>
          </div>
          <CardContent className="p-6">
            <div className="space-y-3">
              {inactivePatients.slice(0, 5).map((patient) => (
                <div
                  key={patient.patientId}
                  className="flex items-center justify-between p-4 bg-amber-50/50 rounded-2xl hover:bg-amber-100 transition-all border border-transparent hover:border-amber-200 cursor-pointer group"
                  onClick={() => router.push(`/dashboard/patients/${patient.patientId}`)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center font-black text-amber-600 shadow-sm">
                      <Scale size={18} />
                    </div>
                    <div>
                      <p className="font-black text-slate-700 uppercase tracking-tighter text-sm">{patient.patientName}</p>
                      <p className="text-[10px] font-bold text-slate-400 italic">
                        Última: {patient.lastWeightMeasurement ? format(new Date(patient.lastWeightMeasurement), "dd/MM/yy") : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-amber-600 tracking-tighter text-lg leading-none">
                      {patient.daysSinceLastMeasurement}
                    </p>
                    <p className="text-[9px] font-black text-amber-400 uppercase tracking-widest">Dias inativo</p>
                  </div>
                </div>
              ))}
            </div>
            {inactivePatients.length > 5 && (
              <Button 
                variant="ghost" 
                className="w-full mt-4 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-amber-600"
              >
                Ver todos os +{inactivePatients.length - 5} pacientes <ChevronRight size={14} />
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}