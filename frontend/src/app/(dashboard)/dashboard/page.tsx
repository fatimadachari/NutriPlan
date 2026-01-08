'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp, Calendar, Activity } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();

  // Dados Falsos para Visualização
  const stats = [
    { label: 'Total de Pacientes', value: '128', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Consultas Hoje', value: '6', icon: Calendar, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Planos Ativos', value: '84', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Crescimento', value: '+12%', icon: TrendingUp, color: 'text-lime-600', bg: 'bg-lime-50' },
  ];

  return (
    <div className="p-8 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-10">
        <div className="h-1.5 w-12 bg-emerald-500 rounded-full mb-3"></div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Dashboard</h1>
        <p className="text-slate-500 font-medium">Bem-vindo(a) de volta, <span className="text-emerald-600">{user?.fullName || 'Nutricionista'}</span></p>
      </div>

      {/* Grid de Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, index) => (
          <Card key={index} className="border-none shadow-sm bg-slate-50/50 hover:shadow-md transition-all rounded-[2rem]">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">{stat.label}</p>
                <p className="text-2xl font-black text-slate-800">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Seção de Atalhos Rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
            Próximos Pacientes
            <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">HOJE</span>
          </h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-emerald-200 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-full border-2 border-white shadow-sm overflow-hidden" />
                  <div>
                    <p className="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">Paciente de Exemplo {i}</p>
                    <p className="text-xs text-slate-400 font-medium">14:30 - Avaliação Bioimpedância</p>
                  </div>
                </div>
                <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Link para área de pacientes estilizado */}
        <Link href="/dashboard/patients" className="block">
          <div className="h-full bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
             <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-2xl font-black mb-2">Gerenciar Pacientes</h3>
                  <p className="text-emerald-100/80 text-sm font-medium max-w-[200px]">Acesse a lista completa e histórico de consultas.</p>
                </div>
                <div className="flex items-center gap-2 font-black text-sm uppercase tracking-widest mt-6">
                  Acessar Agora →
                </div>
             </div>
             {/* Círculo decorativo */}
             <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          </div>
        </Link>
      </div>
    </div>
  );
}