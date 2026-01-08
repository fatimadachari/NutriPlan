'use client';

import { useEffect, useState } from 'react';
import { patientsApi } from '@/lib/api/patients';
import { Patient } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Plus, Search, MoreVertical, User, Scale, 
  FileText, Pencil, Trash2, Filter, Users, 
  Target, TrendingUp, ChevronRight, Mail
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PatientDialog from '@/components/patients/PatientDialog';
import { useRouter } from 'next/navigation';

export default function PatientsPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { loadPatients(); }, []);

  const loadPatients = async () => {
    try {
      const data = await patientsApi.getAll();
      setPatients(data);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="text-emerald-600/50 font-black text-[10px] uppercase tracking-[0.3em]">Sincronizando...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      {/* HEADER REDUZIDO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900">Pacientes</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-0.5">Base de Clientes</p>
        </div>
        
        <Button 
          onClick={() => { setSelectedPatient(null); setDialogOpen(true); }}
          className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl px-6 h-12 font-black shadow-lg shadow-emerald-200 transition-all active:scale-95 text-sm"
        >
          <Plus size={18} className="mr-2" strokeWidth={3} />
          Novo Paciente
        </Button>
      </div>

      {/* FILTROS COMPACTOS */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar paciente..."
            className="w-full pl-11 pr-4 h-12 bg-slate-50 border border-slate-100 focus:border-emerald-500/30 focus:bg-white rounded-2xl transition-all font-bold text-sm text-slate-700 placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-12 w-12 rounded-2xl border-slate-100 p-0 text-slate-400 hover:text-emerald-600">
          <Filter size={18} />
        </Button>
      </div>

      {/* LISTAGEM SLIM */}
      <div className="grid grid-cols-1 gap-3">
        {filteredPatients.length === 0 ? (
          <div className="bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-100 py-12 text-center">
            <User size={32} className="text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Nenhum registro</p>
          </div>
        ) : (
          filteredPatients.map((patient) => (
            <Card 
              key={patient.id} 
              className="group border-none shadow-sm hover:shadow-md transition-all duration-300 rounded-3xl overflow-hidden bg-white"
            >
              <CardContent className="p-3 pr-5">
                <div className="flex items-center gap-4">
                  
                  {/* AVATAR SLIM */}
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 font-black text-lg shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    {patient.name.charAt(0)}
                  </div>

                  {/* INFO PRINCIPAL - ALINHADA LADO A LADO */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                      <h3 className="text-sm font-black text-slate-800 truncate uppercase tracking-tight">
                        {patient.name}
                      </h3>
                      <div className="flex items-center gap-3">
                        <span className="hidden lg:block text-[10px] text-slate-300 font-black">•</span>
                        <div className="flex items-center gap-1.5 text-slate-400">
                           <Mail size={12} />
                           <p className="text-[11px] font-bold truncate">{patient.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* DADOS FÍSICOS COMPACTOS */}
                  <div className="hidden md:flex items-center gap-6 px-6 border-x border-slate-50">
                    <div className="text-center">
                      <p className="text-[9px] text-slate-300 font-black uppercase tracking-widest">Peso</p>
                      <p className="text-xs font-black text-slate-600">{patient.weight}kg</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[9px] text-slate-300 font-black uppercase tracking-widest">Objetivo</p>
                      <p className="text-[10px] font-black text-emerald-600 uppercase">{patient.goal}</p>
                    </div>
                  </div>

                  {/* BOTÕES DE AÇÃO SLIM */}
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      onClick={() => router.push(`/dashboard/patients/${patient.id}`)}
                      className="rounded-xl h-9 px-3 hover:bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest"
                    >
                      Ver Perfil
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="rounded-xl h-9 w-9 p-0 hover:bg-slate-50">
                          <MoreVertical size={16} className="text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-2xl p-2 border-none shadow-xl bg-white min-w-[160px]">
                        <DropdownMenuItem 
                          className="rounded-xl font-bold text-slate-600 focus:bg-emerald-50 focus:text-emerald-700 p-2 text-xs cursor-pointer"
                          onClick={() => { setSelectedPatient(patient); setDialogOpen(true); }}
                        >
                          <Pencil size={14} className="mr-2 text-emerald-500" /> EDITAR
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="rounded-xl font-bold text-red-500 focus:bg-red-50 focus:text-red-600 p-2 text-xs cursor-pointer"
                          onClick={() => {}} 
                        >
                          <Trash2 size={14} className="mr-2 text-red-500" /> EXCLUIR
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <PatientDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        patient={selectedPatient}
        onSuccess={loadPatients}
      />
    </div>
  );
}