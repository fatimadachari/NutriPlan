'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { BMIDistribution } from '@/types';

interface BMIDistributionChartProps {
  data: BMIDistribution[];
}

const COLORS: Record<string, string> = {
  'Abaixo do peso': '#3b82f6',
  'Peso normal': '#10b981',
  'Sobrepeso': '#f59e0b',
  'Obesidade': '#ef4444',
};

export default function BMIDistributionChart({ data }: BMIDistributionChartProps) {
  if (data.length === 0 || data.every(d => d.count === 0)) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Nenhum dado disponível
      </div>
    );
  }

  const chartData = data.filter(d => d.count > 0);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="count"
          nameKey="category"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label={(entry: any) => `${entry.category}: ${entry.count}`}
        >
          {chartData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={COLORS[entry.category] || '#999'} 
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}