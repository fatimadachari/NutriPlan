'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { WeightHistory } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface WeightChartProps {
  data: WeightHistory[];
}

export default function WeightChart({ data }: WeightChartProps) {
  const chartData = [...data]
    .sort((a, b) => new Date(a.measurementDate).getTime() - new Date(b.measurementDate).getTime())
    .map((item) => ({
      date: format(new Date(item.measurementDate), 'dd/MM', { locale: ptBR }),
      weight: item.weight,
      bmi: item.bmi,
    }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Nenhum dado de peso registrado ainda
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis yAxisId="left" label={{ value: 'Peso (kg)', angle: -90, position: 'insideLeft' }} />
        <YAxis yAxisId="right" orientation="right" label={{ value: 'IMC', angle: 90, position: 'insideRight' }} />
        <Tooltip />
        <Legend />
        <Line yAxisId="left" type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={2} name="Peso (kg)" />
        <Line yAxisId="right" type="monotone" dataKey="bmi" stroke="#f59e0b" strokeWidth={2} name="IMC" />
      </LineChart>
    </ResponsiveContainer>
  );
}