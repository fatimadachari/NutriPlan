'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { patientsApi } from '@/lib/api/patients';
import { dietsApi } from '@/lib/api/diets';
import { measurementsApi } from '@/lib/api/measurements';
import { Patient, Diet, WeightHistory } from '@/types';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, Plus, FileDown, Edit, Trash2, 
  ChevronRight, ShieldAlert, Heart, Stethoscope, 
  Utensils, Loader2, CalendarDays
} from 'lucide-react';
import MetabolicInfoCard from '@/components/patients/MetabolicInfoCard';
import PatientDialog from '@/components/patients/PatientDialog';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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

  const handleDownloadPdf = async (dietId: string) => { /* Lógica de download */ };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center bg-background">
        <div className="p-4 rounded-full bg-secondary/50 animate-pulse">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
        <p className="text-sm text-muted-foreground font-medium mt-4">Carregando prontuário...</p>
    </div>
  );

  if (!patient) return null;
  const latestWeight = weightHistory[0]?.weight;

  // Tag Clínica Clean
  const ClinicalTag = ({ icon: Icon, label, items, variant = "default" }: any) => {
    const isAlert = variant === "alert";
    const isInfo = variant === "info";
    
    return (
      <div className="flex flex-col gap-2 h-full">
        <div className="flex items-center gap-2 mb-1">
            <div className={cn("p-1.5 rounded-md", isAlert ? "bg-red-50 text-red-600" : isInfo ? "bg-blue-50 text-blue-600" : "bg-secondary text-primary")}>
                <Icon size={14} />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
        </div>
        <div className="flex flex-wrap gap-2">
            {items.length > 0 ? items.map((item: any) => (
                <span key={item.id} className="text-sm font-medium text-foreground bg-white border border-border px-2.5 py-1 rounded-md shadow-sm">
                    {item.name}
                </span>
            )) : <span className="text-sm text-muted-foreground/50 italic">Nada registrado.</span>}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* --- HEADER CLEAN --- */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex items-start gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push('/dashboard/patients')} className="rounded-xl border-border bg-white text-muted-foreground hover:text-primary hover:border-primary/50 transition-all">
            <ArrowLeft size={18} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{patient.name}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <span className="font-medium text-primary">{patient.email}</span>
                <span className="text-border">•</span>
                <span>{patient.age} anos</span>
                <span className="text-border">•</span>
                <span>{patient.height}cm</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => setEditDialogOpen(true)} className="h-10 rounded-xl text-muted-foreground hover:text-primary hover:bg-secondary/50 font-medium">
                <Edit size={16} className="mr-2" /> Editar Dados
            </Button>
            <Button onClick={handleCreateDiet} disabled={creating} className="h-10 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-5 font-semibold shadow-md transition-all">
                {creating ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Plus className="mr-2 h-4 w-4" />}
                Nova Dieta
            </Button>
        </div>
      </div>

      {/* --- BARRA DE RESUMO CLÍNICO --- */}
      <div className="bg-white border border-border rounded-2xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-border">
         <div className="px-4 first:pl-0"><ClinicalTag icon={ShieldAlert} label="Alergias" items={patient.allergies} variant="alert" /></div>
         <div className="px-4 pt-4 md:pt-0"><ClinicalTag icon={Stethoscope} label="Condições" items={patient.healthConditions} variant="default" /></div>
         <div className="px-4 pt-4 md:pt-0"><ClinicalTag icon={Heart} label="Preferências" items={patient.dietaryPreferences} variant="info" /></div>
      </div>

      {/* --- CARD METABÓLICO --- */}
      <MetabolicInfoCard patient={patient} latestWeight={latestWeight} />

      {/* --- LISTA DE DIETAS --- */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <div className="p-1.5 bg-secondary rounded-lg text-primary">
                <Utensils size={18} />
            </div>
            Planos Alimentares
        </h2>

        {diets.length === 0 ? (
           <div className="border border-dashed border-border rounded-3xl p-12 text-center bg-muted/10">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-border">
                  <Utensils className="text-muted-foreground" size={20} />
              </div>
              <p className="text-muted-foreground font-medium mb-4">Nenhum plano alimentar criado ainda.</p>
              <Button variant="link" onClick={handleCreateDiet} className="text-primary font-bold">Criar o primeiro plano</Button>
           </div>
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {diets.map(diet => (
                 <div key={diet.id} onClick={() => router.push(`/dashboard/diets/${diet.id}`)} className="group bg-white rounded-3xl border border-border p-6 cursor-pointer hover:border-primary/50 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                    
                    {/* Header do Card */}
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold uppercase tracking-wide">
                            <CalendarDays size={14} />
                            {format(new Date(diet.createdDate), "dd 'de' MMM, yyyy", { locale: ptBR })}
                        </div>
                        <div className="w-8 h-8 rounded-full bg-secondary/30 flex items-center justify-center text-primary/60 group-hover:bg-primary group-hover:text-white transition-all">
                            <ChevronRight size={16} />
                        </div>
                    </div>

                    {/* Conteúdo Principal */}
                    <div className="mb-6">
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-bold text-foreground tracking-tight">{diet.totalCalories.toFixed(0)}</span>
                            <span className="text-sm font-medium text-muted-foreground">kcal</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 font-medium">Valor Energético Total</p>
                    </div>

                    {/* Mini Gráfico de Macros (Cores Suaves) */}
                    <div className="space-y-3">
                        {/* Proteína */}
                        <div>
                            <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground mb-1">
                                <span>Proteína</span>
                                <span>{diet.totalProtein.toFixed(0)}g</span>
                            </div>
                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500/80 rounded-full" style={{ width: '30%' }}></div>
                            </div>
                        </div>
                        {/* Carbo */}
                        <div>
                            <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground mb-1">
                                <span>Carboidratos</span>
                                <span>{diet.totalCarbs.toFixed(0)}g</span>
                            </div>
                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500/80 rounded-full" style={{ width: '50%' }}></div>
                            </div>
                        </div>
                        {/* Gordura */}
                        <div>
                            <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground mb-1">
                                <span>Gorduras</span>
                                <span>{diet.totalFat.toFixed(0)}g</span>
                            </div>
                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500/80 rounded-full" style={{ width: '20%' }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Ações Hover */}
                    <div className="absolute top-6 right-16 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-secondary/50" onClick={(e) => { e.stopPropagation(); handleDownloadPdf(diet.id); }}>
                            <FileDown size={16} />
                        </Button>
                    </div>
                 </div>
              ))}
           </div>
        )}
      </div>

      <PatientDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} patient={patient} onSuccess={loadData} />
    </div>
  );
}