'use client';

import { useEffect, useState } from 'react';
import { patientsApi } from '@/lib/api/patients';
import { Patient } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, Search, MoreHorizontal, Loader2, 
  Mail, Weight, ChevronRight, Filter,
  Pencil, Trash2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
      <div className="h-[50vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground font-medium">Carregando prontuários...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Pacientes</h1>
          <p className="text-muted-foreground mt-1">Gerencie seus prontuários e acompanhe evoluções.</p>
        </div>
        
        <Button 
          onClick={() => { setSelectedPatient(null); setDialogOpen(true); }}
          className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 h-11 px-6 rounded-xl font-medium transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Paciente
        </Button>
      </div>

      {/* --- BARRA DE FERRAMENTAS --- */}
      <div className="bg-white p-2 rounded-2xl border border-border/60 shadow-sm flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors w-4 h-4" />
          <Input
            type="text"
            placeholder="Buscar por nome, e-mail ou CPF..."
            className="pl-10 h-11 border-transparent bg-transparent focus:bg-muted/30 focus:border-transparent rounded-xl transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 px-2">
            <div className="h-6 w-px bg-border hidden sm:block"></div>
            <Button variant="ghost" className="h-10 px-4 text-muted-foreground hover:text-foreground rounded-xl gap-2">
                <Filter size={16} />
                <span className="text-sm font-medium hidden sm:inline">Filtros</span>
            </Button>
        </div>
      </div>

      {/* --- LISTAGEM DE CARDS --- */}
      <div className="grid grid-cols-1 gap-4">
        {filteredPatients.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-border/60 py-16 text-center">
            <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Nenhum paciente encontrado</h3>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto mt-2">
              Não encontramos resultados para "{searchTerm}". Tente outro termo ou cadastre um novo paciente.
            </p>
          </div>
        ) : (
          filteredPatients.map((patient) => (
            <div 
              key={patient.id} 
              className="group bg-white p-4 sm:p-5 rounded-2xl border border-border/50 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 flex flex-col sm:flex-row sm:items-center gap-5"
            >
              
              {/* Avatar e Nome */}
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                  {patient.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-base group-hover:text-primary transition-colors">
                    {patient.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                    <Mail size={12} />
                    <span className="truncate max-w-[150px] sm:max-w-xs">{patient.email}</span>
                  </div>
                </div>
              </div>

              {/* Tags de Informação */}
              <div className="flex items-center gap-3 sm:gap-6 pl-16 sm:pl-0">
                <div className="flex flex-col sm:items-center">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">Peso</span>
                    <div className="flex items-center gap-1.5 font-medium text-foreground text-sm">
                        <Weight size={14} className="text-primary/70" />
                        {patient.weight}kg
                    </div>
                </div>
                
                <div className="h-8 w-px bg-border/60 hidden sm:block"></div>

                <div className="flex flex-col sm:items-center min-w-[100px]">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">Objetivo</span>
                    <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                            {patient.goal}
                        </span>
                    </div>
                </div>
              </div>

              {/* Ações */}
              <div className="flex items-center gap-2 mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-border/50 justify-end">
                <Button 
                  variant="ghost" 
                  onClick={() => router.push(`/dashboard/patients/${patient.id}`)}
                  className="rounded-xl h-9 text-xs font-medium text-primary hover:bg-primary/5 hover:text-primary"
                >
                  Ver Prontuário
                  <ChevronRight size={14} className="ml-1" />
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9 text-muted-foreground hover:text-foreground">
                      <MoreHorizontal size={18} />
                    </Button>
                  </DropdownMenuTrigger>
                  
                  {/* CORREÇÃO AQUI: bg-white adicionado */}
                  <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-lg border border-border/60 bg-white p-1">
                    <DropdownMenuLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-2 py-1.5">Ações</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-border/50" />
                    <DropdownMenuItem 
                      onClick={() => { setSelectedPatient(patient); setDialogOpen(true); }}
                      className="cursor-pointer gap-2 rounded-lg focus:bg-muted/50 text-sm font-medium"
                    >
                      <Pencil size={14} className="text-foreground/70" /> Editar dados
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive cursor-pointer gap-2 rounded-lg text-sm font-medium"
                      onClick={() => {}} 
                    >
                      <Trash2 size={14} /> Excluir paciente
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

            </div>
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