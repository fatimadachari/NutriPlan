'use client';

import { useEffect, useState } from 'react';
import { analyticsApi } from '@/lib/api/analytics';
import {
  DashboardStats,
  PatientsByGoal,
  PatientProgress,
  InactivePatient,
  BMIDistribution,
} from '@/types';
import {
  Users,
  FileText,
  Scale,
  Target,
  TrendingUp,
  AlertCircle,
  Loader2,
  CalendarDays,
  ArrowRight,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';
import PatientsByGoalChart from '@/components/dashboard/PatientsByGoalChart';
import BMIDistributionChart from '@/components/dashboard/BMIDistributionChart';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function AnalyticsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [patientsByGoal, setPatientsByGoal] = useState<PatientsByGoal[]>([]);
  const [topProgress, setTopProgress] = useState<PatientProgress[]>([]);
  const [inactivePatients, setInactivePatients] = useState<InactivePatient[]>([]);
  const [bmiDistribution, setBmiDistribution] = useState<BMIDistribution[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulando delay para ver o loading clean
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
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="h-full w-full bg-background flex flex-col items-center justify-center gap-4 min-h-[60vh]">
        <div className="p-4 rounded-full bg-secondary/50 animate-pulse">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
        <p className="text-sm text-muted-foreground font-medium">Carregando dados...</p>
      </div>
    );
  }

  // Card KPI Clean e Minimalista
  const KpiCard = ({ label, value, sub, icon: Icon }: any) => (
    <div className="bg-white border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between h-full">
       <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-secondary rounded-xl text-primary">
             <Icon size={20} />
          </div>
          {/* Badge opcional de variação */}
          <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
             +2.5% este mês
          </span>
       </div>
       <div>
           <h3 className="text-3xl font-bold text-foreground tracking-tight">{value || 0}</h3>
           <p className="text-sm font-medium text-muted-foreground mt-1">{label}</p>
       </div>
       <div className="mt-4 pt-4 border-t border-dashed border-border">
           <p className="text-xs text-muted-foreground">{sub}</p>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background space-y-8 pb-20">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Visão Geral</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Bem-vindo ao seu painel de controle nutricional.
          </p>
        </div>
        <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-xl text-sm font-medium text-muted-foreground shadow-sm">
                <CalendarDays size={16} />
                <span>{format(new Date(), "d 'de' MMMM, yyyy", { locale: ptBR })}</span>
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md rounded-xl h-11 px-6">
                Novo Paciente
            </Button>
        </div>
      </div>

      {/* --- KPIS PRINCIPAIS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard 
           label="Total de Pacientes" 
           value={stats?.totalPatients} 
           sub={`${stats?.activePatientsThisMonth || 0} ativos recentemente`} 
           icon={Users} 
        />
        <KpiCard 
           label="Planos Alimentares" 
           value={stats?.totalDiets} 
           sub="Prescrições vigentes" 
           icon={FileText} 
        />
        <KpiCard 
           label="Medições Realizadas" 
           value={stats?.totalWeightMeasurements} 
           sub="Histórico antropométrico" 
           icon={Scale} 
        />
        <KpiCard 
           label="Metas Ativas" 
           value={stats?.patientsWithGoals} 
           sub="Objetivos em andamento" 
           icon={Target} 
        />
      </div>

      {/* --- SEÇÃO DE GRÁFICOS (BACKGROUND BRANCO PURO) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Objetivos (Ocupa 2 colunas) */}
        <div className="lg:col-span-2 bg-white border border-border rounded-3xl p-6 lg:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Objetivos Clínicos</h3>
              <p className="text-sm text-muted-foreground">Distribuição da base de pacientes por meta.</p>
            </div>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
                <MoreHorizontal size={20} />
            </Button>
          </div>
          <div className="h-[300px] w-full">
            <PatientsByGoalChart data={patientsByGoal} />
          </div>
        </div>

        {/* IMC (Ocupa 1 coluna) */}
        <div className="bg-white border border-border rounded-3xl p-6 lg:p-8 shadow-sm flex flex-col">
           <div className="mb-8">
              <h3 className="text-lg font-semibold text-foreground">Raio-X da Saúde</h3>
              <p className="text-sm text-muted-foreground">Classificação por IMC.</p>
           </div>
           <div className="flex-1 min-h-[250px] w-full relative">
              <BMIDistributionChart data={bmiDistribution} />
           </div>
        </div>
      </div>

      {/* --- LISTAS DE PERFORMANCE --- */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Top Performance */}
        <div className="xl:col-span-2 bg-white border border-border rounded-3xl shadow-sm overflow-hidden">
          <div className="p-6 lg:p-8 border-b border-border flex justify-between items-center">
             <div className="flex items-center gap-3">
               <div className="p-2 bg-secondary rounded-lg text-primary">
                 <TrendingUp size={18} />
               </div>
               <div>
                  <h3 className="text-base font-semibold text-foreground">Maiores Evoluções</h3>
                  <p className="text-sm text-muted-foreground">Pacientes com resultados expressivos.</p>
               </div>
             </div>
             <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 font-medium" onClick={() => router.push('/dashboard/patients')}>
                Ver todos
             </Button>
          </div>
          
          <div className="divide-y divide-border">
            {topProgress.map((patient, i) => (
              <div key={i} onClick={() => router.push(`/dashboard/patients/${patient.patientId}`)} className="flex items-center justify-between p-5 hover:bg-muted/30 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-primary text-sm border border-secondary">
                    {patient.patientName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">{patient.patientName}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span>{patient.initialWeight}kg</span>
                      <ArrowRight size={12} className="text-primary/60" />
                      <span className="font-medium text-foreground">{patient.currentWeight}kg</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={cn(
                      "inline-flex items-center gap-1 font-bold text-sm px-2.5 py-0.5 rounded-full",
                      patient.weightChange < 0 
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                        : "bg-amber-50 text-amber-700 border border-amber-100"
                  )}>
                      {Math.abs(patient.weightChange).toFixed(1)}kg
                  </span>
                  <p className="text-[10px] text-muted-foreground mt-1 font-medium">{patient.daysSinceStart} dias</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risco / Inativos */}
        <div className="bg-white border border-border rounded-3xl shadow-sm overflow-hidden h-fit">
          <div className="p-6 lg:p-8 border-b border-border flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg text-red-600 border border-red-100">
              <AlertCircle size={18} />
            </div>
            <div>
               <h3 className="text-base font-semibold text-foreground">Alerta de Abandono</h3>
               <p className="text-sm text-muted-foreground">Ausentes há +30 dias.</p>
            </div>
          </div>
          
          <div className="divide-y divide-border">
             {inactivePatients.slice(0, 5).map((patient, i) => (
                 <div key={i} onClick={() => router.push(`/dashboard/patients/${patient.patientId}`)} className="flex items-center justify-between p-4 hover:bg-red-50/30 transition-colors cursor-pointer">
                     <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                             <CalendarDays size={14} />
                         </div>
                         <div>
                             <p className="font-medium text-foreground text-xs">{patient.patientName}</p>
                             <p className="text-[10px] text-muted-foreground">
                                 {patient.lastWeightMeasurement ? `Última: ${format(new Date(patient.lastWeightMeasurement), "dd/MM")}` : 'Sem dados'}
                             </p>
                         </div>
                     </div>
                     <span className="text-xs font-semibold text-red-600 bg-white border border-red-100 shadow-sm px-2 py-1 rounded-md">
                         {patient.daysSinceLastMeasurement}d
                     </span>
                 </div>
             ))}
             {inactivePatients.length === 0 && (
                 <div className="p-8 text-center text-muted-foreground text-sm">Base de pacientes 100% ativa!</div>
             )}
          </div>
          <div className="p-4 bg-muted/20 border-t border-border">
             <Button variant="outline" className="w-full text-xs h-9 bg-white hover:bg-muted" onClick={() => router.push('/dashboard/patients?filter=inactive')}>
                Gerenciar Inativos
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
}