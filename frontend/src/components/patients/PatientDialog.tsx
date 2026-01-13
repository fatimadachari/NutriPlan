'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Allergy, HealthCondition, DietaryPreference } from '@/types';
import { patientsApi } from '@/lib/api/patients';
import { restrictionsApi } from '@/lib/api/restrictions';
import { useAuth } from '@/contexts/AuthContext';
import { User, ShieldAlert, Heart, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PatientDialog({ open, onOpenChange, patient, onSuccess }: any) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', age: '', weight: '', height: '', goal: '',
    gender: 'M', activityLevel: 'Sedentary', targetWeight: '', targetDate: '',
  });

  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [dietaryPreferences, setDietaryPreferences] = useState<DietaryPreference[]>([]);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      loadRestrictions();
      if (patient) {
        setFormData({
          name: patient.name, email: patient.email, age: patient.age.toString(),
          weight: patient.weight.toString(), height: patient.height.toString(),
          goal: patient.goal, gender: patient.gender, activityLevel: patient.activityLevel,
          targetWeight: patient.targetWeight?.toString() || '',
          targetDate: patient.targetDate ? patient.targetDate.split('T')[0] : '',
        });
        setSelectedAllergies(patient.allergies.map((a: any) => a.id));
        setSelectedPreferences(patient.dietaryPreferences.map((d: any) => d.id));
      } else {
        setFormData({ name: '', email: '', age: '', weight: '', height: '', goal: '', gender: 'M', activityLevel: 'Sedentary', targetWeight: '', targetDate: '' });
        setSelectedAllergies([]); setSelectedPreferences([]);
      }
    }
  }, [patient, open]);

  const loadRestrictions = async () => {
    const [a, p] = await Promise.all([
      restrictionsApi.getAllergies(),
      restrictionsApi.getDietaryPreferences(),
    ]);
    setAllergies(a); setDietaryPreferences(p);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...formData, age: parseInt(formData.age), weight: parseFloat(formData.weight), height: parseFloat(formData.height), nutritionistId: user?.userId };
      const res = patient ? await patientsApi.update(patient.id, payload) : await patientsApi.create(payload);
      const id = patient ? patient.id : res.id;
      await restrictionsApi.updatePatientRestrictions(id, {
        allergyIds: selectedAllergies,
        healthConditionIds: [], // Simplificado para exemplo
        dietaryPreferenceIds: selectedPreferences,
      });
      onSuccess();
      onOpenChange(false);
    } finally { setLoading(false); }
  };

  const SelectionButton = ({ label, selected, onClick }: any) => (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3 py-2 rounded-lg text-xs font-semibold transition-all border flex justify-between items-center",
        selected 
          ? "bg-primary text-primary-foreground border-primary shadow-sm" 
          : "bg-white border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
      )}
    >
      <span className="truncate mr-2">{label}</span>
      {selected && <Check size={12} strokeWidth={3} />}
    </button>
  );

  const inputClass = "h-11 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto p-0 border-none rounded-[2rem] shadow-2xl bg-white">
        <form onSubmit={handleSubmit}>
          <div className="p-8 lg:p-10 space-y-8">
            
            {/* --- HEADER --- */}
            <div className="flex items-center gap-4 border-b border-border pb-6">
               <div className="w-12 h-12 bg-secondary/50 text-primary border border-secondary rounded-2xl flex items-center justify-center">
                  <User size={24} />
               </div>
               <div>
                  <DialogTitle className="text-2xl font-bold text-foreground tracking-tight">{patient ? 'Editar Paciente' : 'Novo Paciente'}</DialogTitle>
                  <p className="text-muted-foreground text-sm">Preencha os dados clínicos fundamentais.</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              {/* Identificação */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    Dados Pessoais
                </h4>
                <div className="space-y-3">
                  <Input placeholder="Nome Completo" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={inputClass} />
                  <Input placeholder="E-mail" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={inputClass} />
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="Peso (kg)" type="number" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} className={inputClass} />
                    <Input placeholder="Altura (cm)" type="number" value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} className={inputClass} />
                  </div>
                  <Input placeholder="Idade" type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className={inputClass} />
                </div>
              </div>

              {/* Planejamento */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    Planejamento
                </h4>
                <div className="space-y-3">
                  <Input placeholder="Objetivo Principal" value={formData.goal} onChange={e => setFormData({...formData, goal: e.target.value})} className={inputClass} />
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="Meta (kg)" type="number" value={formData.targetWeight} onChange={e => setFormData({...formData, targetWeight: e.target.value})} className={inputClass} />
                    <Input type="date" value={formData.targetDate} onChange={e => setFormData({...formData, targetDate: e.target.value})} className={inputClass} />
                  </div>
                  <Select value={formData.activityLevel} onValueChange={v => setFormData({...formData, activityLevel: v})}>
                    <SelectTrigger className={inputClass}>
                      <SelectValue placeholder="Nível de Atividade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sedentary">Sedentário</SelectItem>
                      <SelectItem value="Light">Leve</SelectItem>
                      <SelectItem value="Moderate">Moderado</SelectItem>
                      <SelectItem value="Active">Ativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Restrições */}
            <div className="pt-6 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-3">
                  <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-500"><ShieldAlert size={14}/> Alergias</h4>
                  <div className="flex flex-wrap gap-2">
                    {allergies.map(a => (
                      <SelectionButton key={a.id} label={a.name} selected={selectedAllergies.includes(a.id)} onClick={() => setSelectedAllergies(prev => prev.includes(a.id) ? prev.filter(x => x !== a.id) : [...prev, a.id])} />
                    ))}
                  </div>
               </div>

               <div className="space-y-3">
                  <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-500"><Heart size={14}/> Preferências</h4>
                  <div className="flex flex-wrap gap-2">
                    {dietaryPreferences.map(p => (
                      <SelectionButton key={p.id} label={p.name} selected={selectedPreferences.includes(p.id)} onClick={() => setSelectedPreferences(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id])} />
                    ))}
                  </div>
               </div>
            </div>
          </div>

          <DialogFooter className="p-6 bg-muted/20 border-t border-border flex items-center justify-between sm:justify-between">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="text-muted-foreground hover:text-foreground">
                Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-8 shadow-md">
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}