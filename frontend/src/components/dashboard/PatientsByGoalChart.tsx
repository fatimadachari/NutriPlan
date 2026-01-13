'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PatientsByGoal } from '@/types';

export default function PatientsByGoalChart({ data }: { data: PatientsByGoal[] }) {
  // Paleta Clean: Verde Floresta, Verde Sálvia, Azul Petróleo, Cinza Quente
  const colors = [
    '#365E4E', // Primary (Floresta)
    '#6B9A86', // Variação média
    '#A0C4B4', // Sálvia escuro
    '#5F8D98', // Azul Petróleo Suave
    '#B5BDB3'  // Cinza Neutro
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-border p-3 rounded-xl shadow-lg">
          <p className="text-muted-foreground text-xs font-semibold mb-1 uppercase tracking-wider">{label}</p>
          <p className="text-foreground font-bold text-lg">
            {payload[0].value} <span className="text-sm font-normal text-muted-foreground">pacientes</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
        <XAxis type="number" hide />
        <YAxis 
          dataKey="goal" 
          type="category" 
          axisLine={false} 
          tickLine={false} 
          width={100}
          tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }}
        />
        <Tooltip cursor={{ fill: '#F3F4F6' }} content={<CustomTooltip />} />
        <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={28}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}