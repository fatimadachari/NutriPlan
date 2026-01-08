'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AnamneseWizard from '@/components/anamnese/AnamneseWizard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowLeft, Loader2, Calendar, 
  Utensils, Droplets, Moon, Activity, MessageSquare, ClipboardCheck
} from 'lucide-react';
import axios from 'axios';
import anamneseService from '@/services/anamnese.service';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function AnamnesePage() {
    const params = useParams();
    const router = useRouter();
    const patientId = params.id as string;
    const [patientName, setPatientName] = useState('');
    const [loading, setLoading] = useState(true);
    const [anamnese, setAnamnese] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const patientResponse = await axios.get(
                    `${API_BASE_URL}/api/Patients/${patientId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setPatientName(patientResponse.data.name);

                try {
                    const anamneseData = await anamneseService.getByPatientId(patientId);
                    setAnamnese(anamneseData);
                } catch (error: any) {
                    setAnamnese(null); // Define como null se não houver dados anteriores
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
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                <p className="text-emerald-600 font-black text-[9px] uppercase tracking-widest">Sincronizando Ficha...</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-[1400px] mx-auto space-y-6 animate-in fade-in duration-500">
            
            {/* --- HEADER COMPACTO COM STATUS INTEGRADO --- */}
            <div className="flex items-center justify-between bg-white p-4 rounded-3xl shadow-sm border border-slate-50">
                <div className="flex items-center gap-4">
                    <Button 
                        variant="ghost" 
                        onClick={() => router.push(`/dashboard/patients/${patientId}`)}
                        className="rounded-xl bg-slate-50 text-emerald-600 h-11 w-11 p-0"
                    >
                        <ArrowLeft size={20} />
                    </Button>
                    <div>
                        <h1 className="text-xl font-black tracking-tighter text-slate-900 uppercase leading-none">
                            Anamnese Digital
                        </h1>
                        <p className="text-slate-400 font-bold text-[9px] uppercase tracking-widest mt-1">
                            Paciente: {patientName}
                        </p>
                    </div>
                </div>

                {/* Status de Última Realização */}
                <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border ${anamnese ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'}`}>
                    <Calendar className={anamnese ? 'text-emerald-500' : 'text-amber-500'} size={14} />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${anamnese ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {anamnese 
                            ? `Última atualização: ${new Date(anamnese.createdAt).toLocaleDateString('pt-BR')}` 
                            : 'Primeira Anamnese: Sem dados anteriores'
                        }
                    </span>
                </div>
            </div>

            {/* --- GRID DE VISUALIZAÇÃO (DADOS ATUAIS) --- */}
            {anamnese && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-2 duration-500">
                    <Card className="md:col-span-2 rounded-[2.5rem] border-none shadow-sm bg-white p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                <MessageSquare size={18} />
                            </div>
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resumo Clínico</h3>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <p className="text-[9px] font-black text-emerald-600 uppercase mb-2 tracking-widest">Queixa Principal</p>
                                <p className="text-slate-700 font-medium text-sm leading-relaxed bg-slate-50/50 p-4 rounded-2xl border border-slate-100 italic">
                                    "{anamnese.mainComplaint}"
                                </p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-emerald-600 uppercase mb-2 tracking-widest">Objetivo Final</p>
                                <p className="text-slate-700 font-medium text-sm leading-relaxed">
                                    {anamnese.consultationGoal}
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="rounded-[2.5rem] border-none shadow-sm bg-slate-900 text-white p-8">
                        <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-8">Padrão de Rotina</h3>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-400 border border-white/10">
                                    <Utensils size={18} />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Refeições</p>
                                    <p className="text-lg font-black">{anamnese.mealsPerDay} <span className="text-[10px] opacity-40 italic">/ dia</span></p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-blue-400 border border-white/10">
                                    <Droplets size={18} />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Água</p>
                                    <p className="text-lg font-black">{anamnese.waterIntakeLiters}L <span className="text-[10px] opacity-40 italic">/ dia</span></p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* --- COMPONENTE DE EDIÇÃO/CRIAÇÃO SEMPRE VISÍVEL --- */}
            <div className="bg-white rounded-[3rem] border border-slate-50 shadow-sm overflow-hidden">
                <div className="px-10 py-6 border-b border-slate-50 flex items-center gap-3">
                    <ClipboardCheck className="text-emerald-500" size={20} />
                    <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter">
                        {anamnese ? 'Atualizar Questionário' : 'Iniciar Novo Prontuário'}
                    </h2>
                </div>
                <div className="p-10 bg-slate-50/30">
                    <AnamneseWizard patientId={patientId} patientName={patientName} />
                </div>
            </div>
        </div>
    );
}