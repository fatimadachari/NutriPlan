'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { patientsApi } from '@/lib/api/patients';
import { dietsApi } from '@/lib/api/diets';
import { measurementsApi } from '@/lib/api/measurements';
import { Patient, Diet, WeightHistory } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowLeft, Plus, FileDown, Edit, Trash2,
  Scale, FileText, Calendar, Zap, ChevronRight,
  Activity, Heart, Target, Mail, ShieldAlert, ClipboardList
} from 'lucide-react';
import MetabolicInfoCard from '@/components/patients/MetabolicInfoCard';
import PatientDialog from '@/components/patients/PatientDialog';

export default function PatientDietsPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [diets, setDiets] = useState<Diet[]>([]);
  const [weightHistory, setWeightHistory] = useState<WeightHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => { loadData(); }, [patientId]);

  const loadData = async () => {
    try {
      const [patientData, dietsData, weightData] = await Promise.all([
        patientsApi.getById(patientId),
        dietsApi.getByPatient(patientId),
        measurementsApi.getWeightHistory(patientId),
      ]);
      setPatient(patientData);
      setDiets(dietsData);
      setWeightHistory(weightData);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const handleCreateDiet = async () => {
    setCreating(true);
    try {
      const newDiet = await dietsApi.create(patientId);
      router.push(`/dashboard/diets/${newDiet.id}`);
    } catch (error) { console.error(error); } finally { setCreating(false); }
  };

  const handleDownloadPdf = async (dietId: string) => {
    try {
      const blob = await dietsApi.downloadPdf(dietId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dieta-${patient?.name.replace(/\s+/g, '-').toLowerCase()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) { console.error(error); }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-emerald-600">
      <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
      <p className="font-black text-[10px] uppercase tracking-widest">Acessando Prontuário...</p>
    </div>
  );

  if (!patient) return null;
  const latestWeight = weightHistory[0]?.weight;

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* --- HEADER PRINCIPAL --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard/patients')}
            className="rounded-2xl bg-white shadow-sm border border-slate-100 hover:bg-emerald-50 text-emerald-600 h-14 w-14 shrink-0"
          >
            <ArrowLeft size={24} />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase leading-none">{patient.name}</h1>
              <div className="h-2.5 w-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
            </div>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Status: Paciente em Acompanhamento</p>
          </div>
        </div>

        {/* GRUPO DE AÇÕES REESTRUTURADO */}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setEditDialogOpen(true)} className="rounded-xl font-black text-[10px] uppercase tracking-widest h-12 px-5 border-slate-200 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition-all">
            <Edit className="mr-2" size={16} /> Editar
          </Button>
          <Button variant="outline" onClick={() => router.push(`/dashboard/patients/${patientId}/measurements`)} className="rounded-xl font-black text-[10px] uppercase tracking-widest h-12 px-5 border-slate-200 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition-all">
            <Scale className="mr-2" size={16} /> Medições
          </Button>
          <Button variant="outline" onClick={() => router.push(`/dashboard/patients/${patientId}/anamnese`)} className="rounded-xl font-black text-[10px] uppercase tracking-widest h-12 px-5 border-slate-200 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition-all">
            <ClipboardList className="mr-2" size={16} /> Anamnese
          </Button>
          <Button onClick={handleCreateDiet} disabled={creating} className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest h-12 px-8 shadow-lg shadow-emerald-100 transition-all active:scale-95">
            <Plus className="mr-2" size={18} strokeWidth={3} /> {creating ? 'Gerando...' : 'Nova Dieta'}
          </Button>
        </div>
      </div>

      {/* --- GRID DE INFOS CLÍNICAS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-none shadow-sm rounded-[2rem] overflow-hidden group">
          <div className="h-1.5 w-full bg-red-400 opacity-20 group-hover:opacity-100 transition-opacity"></div>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-50 text-red-500 rounded-lg">
                <ShieldAlert size={18} />
              </div>
              <h3 className="text-slate-900 font-black text-[11px] uppercase tracking-widest">Alergias & Riscos</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {patient.allergies.length > 0 ? patient.allergies.map(a => (
                <span key={a.id} className="bg-red-50 text-red-600 px-3 py-1 rounded-lg text-[10px] font-black border border-red-100 uppercase tracking-tighter">
                  {a.name}
                </span>
              )) : <span className="text-slate-300 text-[10px] font-bold italic uppercase tracking-widest pl-1">Livre de alergias</span>}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-none shadow-sm rounded-[2rem] overflow-hidden group">
          <div className="h-1.5 w-full bg-emerald-500 opacity-20 group-hover:opacity-100 transition-opacity"></div>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <Activity size={18} />
              </div>
              <h3 className="text-slate-900 font-black text-[11px] uppercase tracking-widest">Diagnósticos</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {patient.healthConditions.map(h => (
                <span key={h.id} className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg text-[10px] font-black border border-emerald-100 italic uppercase">
                  {h.name}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-none shadow-sm rounded-[2rem] overflow-hidden group">
          <div className="h-1.5 w-full bg-blue-400 opacity-20 group-hover:opacity-100 transition-opacity"></div>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                <Heart size={18} />
              </div>
              <h3 className="text-slate-900 font-black text-[11px] uppercase tracking-widest">Preferências</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {patient.dietaryPreferences.map(p => (
                <span key={p.id} className="bg-slate-50 text-slate-600 px-3 py-1 rounded-lg text-[10px] font-bold border border-slate-100 uppercase tracking-tighter">
                  {p.name}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* --- RESUMO METABÓLICO --- */}
      <MetabolicInfoCard patient={patient} latestWeight={latestWeight} />

      {/* --- SEÇÃO DE DIETAS --- */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <div className="h-8 w-1.5 bg-emerald-500 rounded-full"></div>
          <h2 className="text-2xl font-black tracking-tighter text-slate-900 uppercase">Histórico de Planos</h2>
        </div>

        {diets.length === 0 ? (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] p-20 text-center">
            <Zap size={48} className="text-emerald-200 mx-auto mb-4" />
            <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">Pronto para começar?</h3>
            <p className="text-slate-400 font-medium text-sm mb-8">Nenhum plano alimentar foi gerado para este paciente.</p>
            <Button onClick={handleCreateDiet} className="bg-emerald-600 hover:bg-emerald-500 rounded-2xl h-14 px-10 font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-100">
              Prescrever Primeira Dieta
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {diets.map((diet) => (
              <Card key={diet.id} className="group bg-white border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                      {new Date(diet.createdDate).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleDownloadPdf(diet.id)} className="h-10 w-10 rounded-xl text-slate-300 hover:text-emerald-600 hover:bg-emerald-50">
                        <FileDown size={20} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50">
                        <Trash2 size={20} />
                      </Button>
                    </div>
                  </div>

                  <div className="mb-8">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Calórico</p>
                    <div className="flex items-baseline gap-2">
                      <h4 className="text-5xl font-black text-slate-900 tracking-tighter">{diet.totalCalories.toFixed(0)}</h4>
                      <span className="text-emerald-500 font-black text-xs uppercase">kcal</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-8">
                    {[
                      { label: 'PROT', val: diet.totalProtein, color: 'bg-emerald-50 text-emerald-600' },
                      { label: 'CARB', val: diet.totalCarbs, color: 'bg-blue-50 text-blue-600' },
                      { label: 'FAT', val: diet.totalFat, color: 'bg-amber-50 text-amber-600' }
                    ].map((m, i) => (
                      <div key={i} className={`${m.color} rounded-2xl p-4 text-center border border-white/50 group-hover:border-white transition-all`}>
                        <p className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-70">{m.label}</p>
                        <p className="text-sm font-black">{m.val.toFixed(0)}g</p>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() => router.push(`/dashboard/diets/${diet.id}`)}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] h-14 shadow-lg shadow-emerald-50 group/btn"
                  >
                    Abrir Dieta
                    <ChevronRight size={18} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <PatientDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} patient={patient} onSuccess={loadData} />
    </div>
  );
}