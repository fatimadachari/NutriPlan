'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Patient, Allergy, HealthCondition, DietaryPreference } from '@/types';
import { patientsApi } from '@/lib/api/patients';
import { restrictionsApi } from '@/lib/api/restrictions';
import { useAuth } from '@/contexts/AuthContext';

interface PatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient?: Patient | null;
  onSuccess: () => void;
}

export default function PatientDialog({
  open,
  onOpenChange,
  patient,
  onSuccess,
}: PatientDialogProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Dados básicos
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    weight: '',
    height: '',
    goal: '',
  });

  // Opções disponíveis
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [healthConditions, setHealthConditions] = useState<HealthCondition[]>([]);
  const [dietaryPreferences, setDietaryPreferences] = useState<DietaryPreference[]>([]);

  // Seleções
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      loadRestrictions();
      
      if (patient) {
        setFormData({
          name: patient.name,
          email: patient.email,
          age: patient.age.toString(),
          weight: patient.weight.toString(),
          height: patient.height.toString(),
          goal: patient.goal,
        });
        setSelectedAllergies(patient.allergies.map(a => a.id));
        setSelectedConditions(patient.healthConditions.map(h => h.id));
        setSelectedPreferences(patient.dietaryPreferences.map(d => d.id));
      } else {
        setFormData({
          name: '',
          email: '',
          age: '',
          weight: '',
          height: '',
          goal: '',
        });
        setSelectedAllergies([]);
        setSelectedConditions([]);
        setSelectedPreferences([]);
      }
      setError('');
    }
  }, [patient, open]);

  const loadRestrictions = async () => {
    try {
      const [allergiesData, conditionsData, preferencesData] = await Promise.all([
        restrictionsApi.getAllergies(),
        restrictionsApi.getHealthConditions(),
        restrictionsApi.getDietaryPreferences(),
      ]);
      setAllergies(allergiesData);
      setHealthConditions(conditionsData);
      setDietaryPreferences(preferencesData);
    } catch (error) {
      console.error('Erro ao carregar restrições:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = {
        name: formData.name,
        email: formData.email,
        age: parseInt(formData.age),
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        goal: formData.goal,
        nutritionistId: user?.userId || '',
      };

      let patientId: string;

      if (patient) {
        await patientsApi.update(patient.id, data);
        patientId = patient.id;
      } else {
        const created = await patientsApi.create(data);
        patientId = created.id;
      }

      // Atualizar restrições
      await restrictionsApi.updatePatientRestrictions(patientId, {
        allergyIds: selectedAllergies,
        healthConditionIds: selectedConditions,
        dietaryPreferenceIds: selectedPreferences,
      });

      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao salvar paciente');
    } finally {
      setLoading(false);
    }
  };

  const toggleAllergy = (id: string) => {
    setSelectedAllergies(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleCondition = (id: string) => {
    setSelectedConditions(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const togglePreference = (id: string) => {
    setSelectedPreferences(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {patient ? 'Editar Paciente' : 'Novo Paciente'}
          </DialogTitle>
          <DialogDescription>
            Preencha os dados do paciente e selecione suas restrições alimentares
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}

            {/* Dados Básicos */}
            <div className="space-y-4 pb-4 border-b">
              <h3 className="font-semibold text-lg">Dados Básicos</h3>
              
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Idade</Label>
                  <Input
                    id="age"
                    type="number"
                    min="0"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.weight}
                    onChange={(e) =>
                      setFormData({ ...formData, weight: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height">Altura (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.height}
                    onChange={(e) =>
                      setFormData({ ...formData, height: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal">Objetivo</Label>
                <Input
                  id="goal"
                  placeholder="Ex: Emagrecimento, Ganho de massa..."
                  value={formData.goal}
                  onChange={(e) =>
                    setFormData({ ...formData, goal: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Alergias e Intolerâncias */}
            <div className="space-y-3">
              <h3 className="font-semibold">Alergias e Intolerâncias</h3>
              <div className="grid grid-cols-2 gap-3">
                {allergies.map((allergy) => (
                  <div key={allergy.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`allergy-${allergy.id}`}
                      checked={selectedAllergies.includes(allergy.id)}
                      onCheckedChange={() => toggleAllergy(allergy.id)}
                    />
                    <label
                      htmlFor={`allergy-${allergy.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {allergy.name}
                      <span className="text-xs text-gray-500 ml-1">
                        ({allergy.category})
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Condições de Saúde */}
            <div className="space-y-3">
              <h3 className="font-semibold">Condições de Saúde</h3>
              <div className="space-y-3">
                {healthConditions.map((condition) => (
                  <div key={condition.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={`condition-${condition.id}`}
                      checked={selectedConditions.includes(condition.id)}
                      onCheckedChange={() => toggleCondition(condition.id)}
                      className="mt-1"
                    />
                    <label
                      htmlFor={`condition-${condition.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      <div>{condition.name}</div>
                      <div className="text-xs text-gray-500 font-normal">
                        {condition.description}
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Preferências Alimentares */}
            <div className="space-y-3">
              <h3 className="font-semibold">Preferências Alimentares</h3>
              <div className="grid grid-cols-2 gap-3">
                {dietaryPreferences.map((preference) => (
                  <div key={preference.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`preference-${preference.id}`}
                      checked={selectedPreferences.includes(preference.id)}
                      onCheckedChange={() => togglePreference(preference.id)}
                    />
                    <label
                      htmlFor={`preference-${preference.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {preference.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : patient ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}