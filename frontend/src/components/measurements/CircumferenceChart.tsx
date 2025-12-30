'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BodyMeasurement } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CircumferenceChartProps {
  data: BodyMeasurement[];
  selectedMeasures: string[];
}

const measurementLabels: Record<string, { label: string; color: string }> = {
  neck: { label: 'Pescoço', color: '#8b5cf6' },
  chest: { label: 'Peitoral', color: '#3b82f6' },
  waist: { label: 'Cintura', color: '#10b981' },
  abdomen: { label: 'Abdômen', color: '#f59e0b' },
  hip: { label: 'Quadril', color: '#ef4444' },
  rightArm: { label: 'Braço D', color: '#06b6d4' },
  leftArm: { label: 'Braço E', color: '#8b5cf6' },
  rightThigh: { label: 'Coxa D', color: '#ec4899' },
  leftThigh: { label: 'Coxa E', color: '#6366f1' },
  rightCalf: { label: 'Pant. D', color: '#14b8a6' },
  leftCalf: { label: 'Pant. E', color: '#f97316' },
};

export default function CircumferenceChart({ data, selectedMeasures }: CircumferenceChartProps) {
  const chartData = [...data]
    .sort((a, b) => new Date(a.measurementDate).getTime() - new Date(b.measurementDate).getTime())
    .map((item) => {
      const dataPoint: any = {
        date: format(new Date(item.measurementDate), 'dd/MM', { locale: ptBR }),
      };

      selectedMeasures.forEach((measure) => {
        const value = item[measure as keyof BodyMeasurement];
        if (typeof value === 'number') {
          dataPoint[measure] = value;
        }
      });

      return dataPoint;
    });

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Nenhum dado de medidas registrado ainda
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis label={{ value: 'Circunferência (cm)', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Legend />
        {selectedMeasures.map((measure) => (
          <Line
            key={measure}
            type="monotone"
            dataKey={measure}
            stroke={measurementLabels[measure]?.color || '#000'}
            strokeWidth={2}
            name={measurementLabels[measure]?.label || measure}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}