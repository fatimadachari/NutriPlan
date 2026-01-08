'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { patientsApi } from '@/lib/api/patients';
import { measurementsApi } from '@/lib/api/measurements';
import { Patient, WeightHistory, BodyMeasurement } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowLeft, Plus, Trash2, TrendingDown, TrendingUp, 
  BarChart3, FileDown, Scale, Target, Activity
} from 'lucide-react';
import WeightChart from '@/components/measurements/WeightChart';
import BeforeAfterComparison from '@/components/measurements/BeforeAfterComparison';
import BodyCompositionRadar from '@/components/measurements/BodyCompositionRadar';
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

  useEffect(() => { loadData(); }, [patientId]);

  const loadData = async () => {
    try {
      const [p, w, m] = await Promise.all([
        patientsApi.getById(patientId),
        measurementsApi.getWeightHistory(patientId),
        measurementsApi.getBodyMeasurements(patientId),
      ]);
      setPatient(p); setWeightHistory(w); setBodyMeasurements(m);
    } finally { setLoading(false); }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
    </div>
  );

  const latestWeight = weightHistory[0];
  const weightTrend = weightHistory.length >= 2 ? latestWeight.weight - weightHistory[1].weight : 0;

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* --- HEADER COMPACTO --- */}
      <div className="flex items-center justify-between bg-white p-4 rounded-3xl shadow-sm border border-slate-50">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()} className="rounded-xl bg-slate-50 text-emerald-600 h-11 w-11 shrink-0">
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-slate-900 uppercase leading-none">{patient?.name}</h1>
            <p className="text-emerald-500 font-bold text-[9px] uppercase tracking-widest mt-1">Evolução Antropométrica</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => setWeightDialogOpen(true)} variant="outline" className="rounded-xl font-black text-[9px] h-10 px-4 border-slate-200 text-slate-500 uppercase">
            + Peso
          </Button>
          <Button onClick={() => setMeasurementDialogOpen(true)} className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-[9px] h-10 px-5 shadow-lg shadow-emerald-100 uppercase">
            + Medidas
          </Button>
        </div>
      </div>

      {/* --- SUÍTE DE PERFORMANCE SLIM --- */}
      <Card className="bg-white border-none shadow-xl shadow-emerald-100/30 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-4">
          
          {/* LADO ESQUERDO: PESO (Menor altura) */}
          <div className="bg-emerald-600 rounded-xl p-8 text-white flex flex-col justify-center relative">
            <div className="relative z-10">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 mb-4">Peso Atual</p>
              <div className="flex items-baseline gap-1">
                <h2 className="text-6xl font-black tracking-tighter leading-none">
                  {latestWeight?.weight.toFixed(1) || patient?.weight}
                </h2>
                <span className="text-lg font-bold opacity-60 italic">kg</span>
              </div>
              
              <div className="mt-4 inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                {weightTrend > 0 ? <TrendingUp size={14} className="text-red-300" /> : <TrendingDown size={14} className="text-emerald-300" />}
                <span className="text-[9px] font-black uppercase tracking-widest">
                  {Math.abs(weightTrend).toFixed(1)}kg variação
                </span>
              </div>
            </div>
          </div>

          {/* LADO DIREITO: GRÁFICO (Altura reduzida de 320px para 220px) */}
          <div className="lg:col-span-3 p-6 bg-white">
            <div className="flex items-center justify-between mb-4 px-2">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Curva de Tendência</h3>
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-[9px] font-bold text-slate-300 uppercase italic">Dados em tempo real</span>
               </div>
            </div>
            <div className="h-[220px] w-full">
              <WeightChart data={weightHistory} />
            </div>
          </div>
        </div>
      </Card>

      {/* --- SEÇÃO BIOMÉTRICA (Altura reduzida e espaçamento otimizado) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-[2rem] bg-white border-none shadow-sm p-6 flex flex-col items-center">
          <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Simetria Corporal</h3>
          <div className="w-full h-[260px] flex items-center justify-center">
             <BodyCompositionRadar first={bodyMeasurements[bodyMeasurements.length-1]} latest={bodyMeasurements[0]} />
          </div>
        </Card>

        <Card className="rounded-[2rem] bg-white border-none shadow-sm p-6">
          <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Evolução de Medidas</h3>
          <div className="custom-dialog-scroll overflow-y-auto pr-2" style={{ maxHeight: '260px' }}>
             <BeforeAfterComparison first={bodyMeasurements[bodyMeasurements.length-1]} latest={bodyMeasurements[0]} />
          </div>
        </Card>
      </div>

      {/* --- TABELA SLIM --- */}
      <Card className="rounded-[2.5rem] bg-white border-none shadow-sm overflow-hidden border border-slate-50">
        <div className="px-8 py-5 border-b border-slate-50 flex justify-between items-center">
           <h3 className="text-sm font-black text-slate-800 uppercase tracking-tighter">Histórico de Circunferências</h3>
           <span className="text-[9px] font-bold text-slate-300 uppercase italic">Últimos registros</span>
        </div>
        <div className="overflow-x-auto px-6 pb-4">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                <th className="py-3 text-left">Data</th>
                <th className="py-3 text-center">Peso</th>
                <th className="py-3 text-center">Abdômen</th>
                <th className="py-3 text-center">Cintura</th>
                <th className="py-3 text-center">Braço D</th>
                <th className="py-3 text-center">Gordura %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {bodyMeasurements.slice(0, 4).map((m) => (
                <tr key={m.id} className="group hover:bg-emerald-50/30 transition-all">
                  <td className="py-3 text-[10px] font-black text-slate-600 uppercase italic">
                    {format(new Date(m.measurementDate), "dd MMM yyyy", { locale: ptBR })}
                  </td>
                  <td className="py-3 text-center text-xs font-bold text-slate-700">{weightHistory.find(w => w.measurementDate === m.measurementDate)?.weight.toFixed(1) || '--'}kg</td>
                  <td className="py-3 text-center text-xs text-slate-500">{m.abdomen}cm</td>
                  <td className="py-3 text-center text-xs text-slate-500">{m.waist}cm</td>
                  <td className="py-3 text-center text-xs text-slate-500">{m.rightArm}cm</td>
                  <td className="py-3 text-center">
                    <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-lg font-black text-[10px]">
                      {m.bodyFatPercentage}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <style jsx global>{`
        .custom-dialog-scroll::-webkit-scrollbar { width: 4px; }
        .custom-dialog-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
}