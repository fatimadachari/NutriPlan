'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { measurementsApi } from '@/lib/api/measurements';

interface AddBodyMeasurementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: string;
  onSuccess: () => void;
}

export default function AddBodyMeasurementDialog({
  open,
  onOpenChange,
  patientId,
  onSuccess,
}: AddBodyMeasurementDialogProps) {
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [measurements, setMeasurements] = useState({
    neck: '',
    chest: '',
    waist: '',
    abdomen: '',
    hip: '',
    rightArm: '',
    leftArm: '',
    rightThigh: '',
    leftThigh: '',
    rightCalf: '',
    leftCalf: '',
    bodyFatPercentage: '',
    muscleMassPercentage: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await measurementsApi.createBodyMeasurement({
        patientId,
        measurementDate: new Date(date).toISOString(),
        neck: measurements.neck ? parseFloat(measurements.neck) : undefined,
        chest: measurements.chest ? parseFloat(measurements.chest) : undefined,
        waist: measurements.waist ? parseFloat(measurements.waist) : undefined,
        abdomen: measurements.abdomen ? parseFloat(measurements.abdomen) : undefined,
        hip: measurements.hip ? parseFloat(measurements.hip) : undefined,
        rightArm: measurements.rightArm ? parseFloat(measurements.rightArm) : undefined,
        leftArm: measurements.leftArm ? parseFloat(measurements.leftArm) : undefined,
        rightThigh: measurements.rightThigh ? parseFloat(measurements.rightThigh) : undefined,
        leftThigh: measurements.leftThigh ? parseFloat(measurements.leftThigh) : undefined,
        rightCalf: measurements.rightCalf ? parseFloat(measurements.rightCalf) : undefined,
        leftCalf: measurements.leftCalf ? parseFloat(measurements.leftCalf) : undefined,
        bodyFatPercentage: measurements.bodyFatPercentage ? parseFloat(measurements.bodyFatPercentage) : undefined,
        muscleMassPercentage: measurements.muscleMassPercentage ? parseFloat(measurements.muscleMassPercentage) : undefined,
        notes: measurements.notes || undefined,
      });

      onSuccess();
      onOpenChange(false);
      setMeasurements({
        neck: '',
        chest: '',
        waist: '',
        abdomen: '',
        hip: '',
        rightArm: '',
        leftArm: '',
        rightThigh: '',
        leftThigh: '',
        rightCalf: '',
        leftCalf: '',
        bodyFatPercentage: '',
        muscleMassPercentage: '',
        notes: '',
      });
      setDate(new Date().toISOString().split('T')[0]);
    } catch (error) {
      console.error('Erro ao adicionar medidas:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Medidas Corporais</DialogTitle>
          <DialogDescription>
            Registre as medidas corporais do paciente (todas opcionais)
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="date">Data da Medição</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="neck">Pescoço (cm)</Label>
                <Input
                  id="neck"
                  type="number"
                  step="0.1"
                  value={measurements.neck}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMeasurements({ ...measurements, neck: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="chest">Peitoral (cm)</Label>
                <Input
                  id="chest"
                  type="number"
                  step="0.1"
                  value={measurements.chest}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMeasurements({ ...measurements, chest: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="waist">Cintura (cm)</Label>
                <Input
                  id="waist"
                  type="number"
                  step="0.1"
                  value={measurements.waist}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMeasurements({ ...measurements, waist: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="abdomen">Abdômen (cm)</Label>
                <Input
                  id="abdomen"
                  type="number"
                  step="0.1"
                  value={measurements.abdomen}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMeasurements({ ...measurements, abdomen: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hip">Quadril (cm)</Label>
                <Input
                  id="hip"
                  type="number"
                  step="0.1"
                  value={measurements.hip}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMeasurements({ ...measurements, hip: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rightArm">Braço Direito (cm)</Label>
                <Input
                  id="rightArm"
                  type="number"
                  step="0.1"
                  value={measurements.rightArm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMeasurements({ ...measurements, rightArm: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="leftArm">Braço Esquerdo (cm)</Label>
                <Input
                  id="leftArm"
                  type="number"
                  step="0.1"
                  value={measurements.leftArm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMeasurements({ ...measurements, leftArm: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rightThigh">Coxa Direita (cm)</Label>
                <Input
                  id="rightThigh"
                  type="number"
                  step="0.1"
                  value={measurements.rightThigh}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMeasurements({ ...measurements, rightThigh: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="leftThigh">Coxa Esquerda (cm)</Label>
                <Input
                  id="leftThigh"
                  type="number"
                  step="0.1"
                  value={measurements.leftThigh}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMeasurements({ ...measurements, leftThigh: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rightCalf">Panturrilha Direita (cm)</Label>
                <Input
                  id="rightCalf"
                  type="number"
                  step="0.1"
                  value={measurements.rightCalf}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMeasurements({ ...measurements, rightCalf: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="leftCalf">Panturrilha Esquerda (cm)</Label>
                <Input
                  id="leftCalf"
                  type="number"
                  step="0.1"
                  value={measurements.leftCalf}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMeasurements({ ...measurements, leftCalf: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bodyFat">% Gordura Corporal</Label>
                <Input
                  id="bodyFat"
                  type="number"
                  step="0.1"
                  value={measurements.bodyFatPercentage}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMeasurements({ ...measurements, bodyFatPercentage: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="muscleMass">% Massa Muscular</Label>
                <Input
                  id="muscleMass"
                  type="number"
                  step="0.1"
                  value={measurements.muscleMassPercentage}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMeasurements({ ...measurements, muscleMassPercentage: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações (opcional)</Label>
              <Textarea
                id="notes"
                placeholder="Anotações sobre as medidas..."
                value={measurements.notes}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMeasurements({ ...measurements, notes: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}