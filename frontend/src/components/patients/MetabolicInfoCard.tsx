'use client';

import { Patient } from '@/types';
import { Target, Flame, Zap, TrendingDown, TrendingUp, CalendarDays } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

interface MetabolicInfoCardProps {
  patient: Patient;
  latestWeight?: number;
}

export default function MetabolicInfoCard({ patient, latestWeight }: MetabolicInfoCardProps) {
  const currentWeight = latestWeight || patient.weight;
  
  // Cálculo simples de progresso
  const weightDiff = patient.targetWeight ? currentWeight - patient.targetWeight : 0;
  const isLosing = weightDiff > 0;
  const progress = patient.targetWeight 
    ? Math.min(100, Math.max(0, ((patient.weight - currentWeight) / (patient.weight - patient.targetWeight)) * 100))
    : 0;

  const getActivityLabel = (level: string) => {
    const map: Record<string, string> = { 'Sedentary': 'Sedentário', 'Light': 'Leve', 'Moderate': 'Moderado', 'Active': 'Ativo', 'VeryActive': 'Atleta' };
    return map[level] || level;
  };

  return (
    <div className="rounded-[2rem] overflow-hidden shadow-sm border border-border flex flex-col md:flex-row h-full">
      
      {/* --- LADO ESQUERDO: META & PESO (Primary Color) --- */}
      <div className="bg-primary text-primary-foreground p-8 md:w-[40%] relative overflow-hidden flex flex-col justify-between min-h-[280px]">
        {/* Elemento Decorativo Sutil */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        
        <div>
          <div className="flex items-center gap-2 text-primary-foreground/80 mb-6">
            <Target className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-widest">Objetivo Principal</span>
          </div>

          <div className="space-y-1 relative z-10">
             <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                {currentWeight} <span className="text-xl text-primary-foreground/60 font-medium">kg</span>
             </h3>
             <p className="text-primary-foreground/60 text-sm font-medium">Peso Atual</p>
          </div>
        </div>

        <div className="space-y-6 relative z-10">
           <div className="flex justify-between items-end border-b border-primary-foreground/10 pb-4">
              <div>
                 <p className="text-xs font-medium text-primary-foreground/70 uppercase tracking-wider mb-1">Meta Final</p>
                 <p className="text-2xl font-bold text-white">{patient.targetWeight || '--'} <span className="text-sm font-normal text-primary-foreground/60">kg</span></p>
              </div>
              <div className="text-right">
                 <div className="flex items-center gap-1 text-white justify-end">
                    {isLosing ? <TrendingDown size={16} /> : <TrendingUp size={16} />}
                    <span className="text-sm font-bold">{Math.abs(weightDiff).toFixed(1)} kg</span>
                 </div>
                 <p className="text-[10px] text-primary-foreground/50 uppercase tracking-widest">Faltam</p>
              </div>
           </div>

           <div className="space-y-2">
              <Progress value={progress} className="h-1.5 bg-black/20" indicatorClassName="bg-white" />
              <div className="flex justify-between text-[10px] text-primary-foreground/60 font-medium">
                 <span>Início: {patient.weight}kg</span>
                 <span>{progress.toFixed(0)}%</span>
              </div>
           </div>
        </div>
      </div>

      {/* --- LADO DIREITO: METABOLISMO (Clean White) --- */}
      <div className="bg-white p-8 md:w-[60%] flex flex-col justify-center">
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            
            {/* TMB */}
            <div className="space-y-3">
               <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center">
                  <Flame size={20} />
               </div>
               <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Metabolismo Basal</p>
                  <div className="flex items-baseline gap-1 mt-1">
                     <span className="text-3xl font-bold text-foreground tracking-tight">{patient.bmr.toFixed(0)}</span>
                     <span className="text-sm font-medium text-muted-foreground">kcal</span>
                  </div>
                  <p className="text-xs text-muted-foreground/70 mt-1">Gasto em repouso absoluto.</p>
               </div>
            </div>

            {/* GET */}
            <div className="space-y-3">
               <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
                  <Zap size={20} />
               </div>
               <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Gasto Total (GET)</p>
                  <div className="flex items-baseline gap-1 mt-1">
                     <span className="text-3xl font-bold text-foreground tracking-tight">{patient.tdee.toFixed(0)}</span>
                     <span className="text-sm font-medium text-muted-foreground">kcal</span>
                  </div>
                  <p className="text-xs text-muted-foreground/70 mt-1">Nível <span className="font-semibold text-foreground">{getActivityLabel(patient.activityLevel)}</span>.</p>
               </div>
            </div>

            {/* Data Alvo */}
            <div className="col-span-1 sm:col-span-2 pt-6 border-t border-border flex items-center gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <CalendarDays size={16} />
                    <span className="text-xs font-medium uppercase tracking-wider">Prazo Estimado:</span>
                </div>
                <span className="text-sm font-bold text-primary bg-secondary/50 border border-secondary px-3 py-1 rounded-full">
                    {patient.targetDate ? new Date(patient.targetDate).toLocaleDateString('pt-BR') : 'Não definido'}
                </span>
            </div>
         </div>
      </div>
    </div>
  );
}