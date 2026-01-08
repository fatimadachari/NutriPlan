'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Patient, Allergy, HealthCondition, DietaryPreference } from '@/types';
import { patientsApi } from '@/lib/api/patients';
import { restrictionsApi } from '@/lib/api/restrictions';
import { useAuth } from '@/contexts/AuthContext';
import { User, Clipboard, ShieldAlert, Heart, Activity, Check } from 'lucide-react';

export default function PatientDialog({ open, onOpenChange, patient, onSuccess }: any) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', age: '', weight: '', height: '', goal: '',
    gender: 'M', activityLevel: 'Sedentary', targetWeight: '', targetDate: '',
  });

  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [healthConditions, setHealthConditions] = useState<HealthCondition[]>([]);
  const [dietaryPreferences, setDietaryPreferences] = useState<DietaryPreference[]>([]);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
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
        setSelectedConditions(patient.healthConditions.map((h: any) => h.id));
        setSelectedPreferences(patient.dietaryPreferences.map((d: any) => d.id));
      } else {
        setFormData({ name: '', email: '', age: '', weight: '', height: '', goal: '', gender: 'M', activityLevel: 'Sedentary', targetWeight: '', targetDate: '' });
        setSelectedAllergies([]); setSelectedConditions([]); setSelectedPreferences([]);
      }
    }
  }, [patient, open]);

  const loadRestrictions = async () => {
    const [a, c, p] = await Promise.all([
      restrictionsApi.getAllergies(),
      restrictionsApi.getHealthConditions(),
      restrictionsApi.getDietaryPreferences(),
    ]);
    setAllergies(a); setHealthConditions(c); setDietaryPreferences(p);
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
        healthConditionIds: selectedConditions,
        dietaryPreferenceIds: selectedPreferences,
      });
      onSuccess();
      onOpenChange(false);
    } finally { setLoading(false); }
  };

  const SelectionButton = ({ id, label, selected, onClick }: any) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all border-2 flex justify-between items-center ${
        selected 
          ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' 
          : 'bg-white border-slate-100 text-slate-500 hover:border-emerald-200'
      }`}
    >
      <span className="truncate mr-2">{label}</span>
      {selected && <Check size={12} strokeWidth={4} />}
    </button>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Scrollbar Customizada aplicada ao DialogContent */}
      <DialogContent className="sm:max-w-[800px] max-h-[85vh] overflow-y-auto p-0 border-none rounded-[2.5rem] shadow-3xl bg-white custom-dialog-scroll">
        <form onSubmit={handleSubmit}>
          <div className="p-10 space-y-10">
            
            {/* --- HEADER --- */}
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <User size={28} />
               </div>
               <div>
                  <DialogTitle className="text-2xl font-black tracking-tighter uppercase">{patient ? 'Editar Ficha' : 'Novo Paciente'}</DialogTitle>
                  <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.1em]">Configuração de prontuário clínico</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              {/* Identificação */}
              <div className="space-y-5">
                <h4 className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-emerald-600">IDENTIFICAÇÃO</h4>
                <div className="space-y-3">
                  <Input placeholder="Nome Completo" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="h-12 rounded-xl bg-slate-50 border-none font-bold text-sm" />
                  <Input placeholder="E-mail" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="h-12 rounded-xl bg-slate-50 border-none font-bold text-sm" />
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="Peso (kg)" type="number" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} className="h-12 rounded-xl bg-slate-50 border-none font-bold text-sm" />
                    <Input placeholder="Altura (cm)" type="number" value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} className="h-12 rounded-xl bg-slate-50 border-none font-bold text-sm" />
                  </div>
                </div>
              </div>

              {/* Planejamento */}
              <div className="space-y-5">
                <h4 className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-emerald-600">PLANEJAMENTO</h4>
                <div className="space-y-3">
                  <Input placeholder="Objetivo" value={formData.goal} onChange={e => setFormData({...formData, goal: e.target.value})} className="h-12 rounded-xl bg-slate-50 border-none font-bold text-sm" />
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="Meta (kg)" type="number" value={formData.targetWeight} onChange={e => setFormData({...formData, targetWeight: e.target.value})} className="h-12 rounded-xl bg-slate-50 border-none font-bold text-sm" />
                    <Input type="date" value={formData.targetDate} onChange={e => setFormData({...formData, targetDate: e.target.value})} className="h-12 rounded-xl bg-slate-50 border-none font-bold text-sm" />
                  </div>
                  <Select value={formData.activityLevel} onValueChange={v => setFormData({...formData, activityLevel: v})}>
                    <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none font-bold text-slate-500 text-xs">
                      <SelectValue placeholder="Nível de Atividade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sedentary text-xs">Sedentário</SelectItem>
                      <SelectItem value="Light text-xs">Leve</SelectItem>
                      <SelectItem value="Moderate text-xs">Moderado</SelectItem>
                      <SelectItem value="Active text-xs">Ativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Restrições */}
            <div className="space-y-6 pt-8 border-t border-slate-50">
               <div className="space-y-4">
                  <h4 className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-red-500"><ShieldAlert size={14}/> ALERGIAS</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {allergies.map(a => (
                      <SelectionButton key={a.id} label={a.name} selected={selectedAllergies.includes(a.id)} onClick={() => setSelectedAllergies(prev => prev.includes(a.id) ? prev.filter(x => x !== a.id) : [...prev, a.id])} />
                    ))}
                  </div>
               </div>

               <div className="space-y-4">
                  <h4 className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-blue-500"><Heart size={14}/> PREFERÊNCIAS</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {dietaryPreferences.map(p => (
                      <SelectionButton key={p.id} label={p.name} selected={selectedPreferences.includes(p.id)} onClick={() => setSelectedPreferences(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id])} />
                    ))}
                  </div>
               </div>
            </div>
          </div>

          <DialogFooter className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <button type="button" onClick={() => onOpenChange(false)} className="text-slate-400 font-black text-[9px] uppercase tracking-widest hover:text-slate-600 transition-colors ml-4">CANCELAR</button>
            <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl h-11 px-8 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-100 transition-all active:scale-95 mr-4">
              {loading ? 'SALVANDO...' : patient ? 'SALVAR ALTERAÇÕES' : 'CONFIRMAR CADASTRO'}
            </Button>
          </DialogFooter>
        </form>

        <style jsx global>{`
          .custom-dialog-scroll::-webkit-scrollbar {
            width: 6px;
          }
          .custom-dialog-scroll::-webkit-scrollbar-track {
            background: #f8fafc; /* slate-50 */
            margin: 20px; /* Resolve o problema do border radius */
            border-radius: 10px;
          }
          .custom-dialog-scroll::-webkit-scrollbar-thumb {
            background: #cbd5e1; /* slate-300 */
            border-radius: 10px;
          }
          .custom-dialog-scroll::-webkit-scrollbar-thumb:hover {
            background: #10b981; /* emerald-500 */
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}