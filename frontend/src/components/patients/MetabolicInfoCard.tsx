'use client';

import { Patient } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, Target, TrendingDown, TrendingUp, Calendar, Flame, Zap } from 'lucide-react';

interface MetabolicInfoCardProps {
  patient: Patient;
  latestWeight?: number;
}

export default function MetabolicInfoCard({ patient, latestWeight }: MetabolicInfoCardProps) {
  const currentWeight = latestWeight || patient.weight;

  const getActivityLevelLabel = (level: string) => {
    const labels: Record<string, string> = {
      'Sedentary': 'Sedentário', 'Light': 'Leve', 'Moderate': 'Moderado',
      'Active': 'Ativo', 'VeryActive': 'Muito Ativo',
    };
    return labels[level] || level;
  };

  const weightDiff = patient.targetWeight ? patient.targetWeight - currentWeight : null;
  const isLosing = weightDiff && weightDiff < 0;

  return (
    <div className="p-8 space-y-8 bg-white">
      {/* --- LINHA SUPERIOR: MÉTRICAS CHAVE --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Metabolismo Basal', val: patient.bmr, sub: 'Calorias em repouso', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50' },
          { label: 'Gasto Total (TDEE)', val: patient.tdee, sub: getActivityLevelLabel(patient.activityLevel), icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Peso Atual', val: currentWeight, unit: 'kg', sub: `Meta: ${patient.targetWeight || '--'}kg`, icon: Target, color: 'text-emerald-500', bg: 'bg-emerald-50' }
        ].map((item, i) => (
          <div key={i} className="relative group">
            <div className={`p-6 rounded-[2rem] ${item.bg} border border-transparent transition-all duration-300 hover:border-white hover:shadow-xl`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white rounded-xl shadow-sm">
                  <item.icon size={18} className={item.color} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.label}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-800">{item.val.toFixed(0)}</span>
                <span className="text-sm font-bold text-slate-400 uppercase tracking-tighter">{item.unit || 'kcal'}</span>
              </div>
              <p className="text-[11px] font-bold text-slate-500 mt-1 italic">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* --- ÁREA DA META (PROGRESSO VISUAL) --- */}
      {patient.targetWeight && (
        <Card className="border-none shadow-2xl rounded-[2.5rem] bg-slate-50 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Zap size={120} className="text-emerald-600" />
          </div>
          <CardContent className="p-8 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">

              <div className="flex items-center gap-6">
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg ${isLosing ? 'bg-emerald-500 shadow-emerald-200 text-white' : 'bg-orange-500 shadow-orange-200 text-white'}`}>
                  {isLosing ? <TrendingDown size={32} strokeWidth={3} /> : <TrendingUp size={32} strokeWidth={3} />}
                </div>
                <div>
                  <h4 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">
                    {Math.abs(weightDiff || 0).toFixed(1)}kg <span className="text-slate-400 not-italic font-bold text-sm">para a meta</span>
                  </h4>
                  <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Faltam {Math.abs(weightDiff || 0).toFixed(1)}kg para chegar em {patient.targetWeight}kg</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <Calendar className="text-emerald-500" size={24} />
                <div>
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Prazo Final</p>
                  <p className="text-sm font-black text-slate-700">{patient.targetDate ? new Date(patient.targetDate).toLocaleDateString('pt-BR') : '--'}</p>
                </div>
              </div>
            </div>

            {/* BARRA DE PROGRESSO SIMBOLICA */}
            <div className="mt-10">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">
                <span>Início</span>
                <span className="text-emerald-600">Progresso do Plano</span>
                <span>Meta</span>
              </div>
              <div className="h-4 w-full bg-white rounded-full p-1 shadow-inner border border-slate-100">
                <div className={`h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 shadow-lg`} style={{ width: '65%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}