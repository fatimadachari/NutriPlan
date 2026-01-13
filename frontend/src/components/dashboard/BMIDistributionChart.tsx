'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BMIDistribution } from '@/types';

export default function BMIDistributionChart({ data }: { data: BMIDistribution[] }) {
  // Paleta Semântica Clean
  const COLORS = [
    '#60A5FA', // Abaixo (Azul Suave)
    '#365E4E', // Normal (Verde Floresta - Nosso Primary)
    '#FBBF24', // Sobrepeso (Amarelo Mostarda)
    '#F87171'  // Obesidade (Vermelho Suave)
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-border p-3 rounded-xl shadow-lg text-center">
          <span className="text-muted-foreground text-xs font-medium block mb-1">{payload[0].name}</span>
          <span className="text-primary font-bold text-xl block">
            {payload[0].value}%
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={4}
          dataKey="percentage"
          nameKey="category"
          stroke="#fff"
          strokeWidth={2}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          verticalAlign="bottom" 
          height={36} 
          iconType="circle"
          iconSize={8}
          formatter={(value) => <span className="text-muted-foreground text-xs font-medium ml-1">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}