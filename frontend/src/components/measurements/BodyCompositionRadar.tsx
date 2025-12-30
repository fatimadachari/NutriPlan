'use client';

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer, Tooltip } from 'recharts';
import { BodyMeasurement } from '@/types';

interface BodyCompositionRadarProps {
  first: BodyMeasurement;
  latest: BodyMeasurement;
}

export default function BodyCompositionRadar({ first, latest }: BodyCompositionRadarProps) {
  // Criar dados para o radar chart
  const data = [
    {
      area: 'Pescoço',
      inicial: first.neck || 0,
      atual: latest.neck || 0,
    },
    {
      area: 'Peitoral',
      inicial: first.chest || 0,
      atual: latest.chest || 0,
    },
    {
      area: 'Cintura',
      inicial: first.waist || 0,
      atual: latest.waist || 0,
    },
    {
      area: 'Abdômen',
      inicial: first.abdomen || 0,
      atual: latest.abdomen || 0,
    },
    {
      area: 'Quadril',
      inicial: first.hip || 0,
      atual: latest.hip || 0,
    },
    {
      area: 'Braços',
      inicial: ((first.rightArm || 0) + (first.leftArm || 0)) / 2,
      atual: ((latest.rightArm || 0) + (latest.leftArm || 0)) / 2,
    },
    {
      area: 'Coxas',
      inicial: ((first.rightThigh || 0) + (first.leftThigh || 0)) / 2,
      atual: ((latest.rightThigh || 0) + (latest.leftThigh || 0)) / 2,
    },
    {
      area: 'Panturrilhas',
      inicial: ((first.rightCalf || 0) + (first.leftCalf || 0)) / 2,
      atual: ((latest.rightCalf || 0) + (latest.leftCalf || 0)) / 2,
    },
  ].filter(item => item.inicial > 0 || item.atual > 0);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Não há dados suficientes para gerar o gráfico
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="area" />
        <PolarRadiusAxis angle={90} domain={[0, 'auto']} />
        <Radar
          name="Medida Inicial"
          dataKey="inicial"
          stroke="#f59e0b"
          fill="#f59e0b"
          fillOpacity={0.3}
        />
        <Radar
          name="Medida Atual"
          dataKey="atual"
          stroke="#10b981"
          fill="#10b981"
          fillOpacity={0.3}
        />
        <Legend />
        <Tooltip />
      </RadarChart>
    </ResponsiveContainer>
  );
}