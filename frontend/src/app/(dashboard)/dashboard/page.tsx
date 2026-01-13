'use client';

import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  Activity, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Plus, 
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const { user } = useAuth();

  // Dados mockados
  const stats = [
    { label: 'Pacientes Ativos', value: '128', icon: Users, trend: '+4 este mês', trendUp: true },
    { label: 'Consultas Hoje', value: '06', icon: Calendar, trend: 'Agenda cheia', trendUp: true },
    { label: 'Adesão ao Plano', value: '92%', icon: Activity, trend: '+2.5%', trendUp: true },
    { label: 'Faturamento', value: 'R$ 12k', icon: TrendingUp, trend: 'Dentro da meta', trendUp: true },
  ];

  const appointments = [
    { id: 1, time: '09:00', name: 'Ana Clara Souza', type: 'Primeira Consulta', status: 'Concluído' },
    { id: 2, time: '10:30', name: 'Carlos Eduardo', type: 'Retorno Mensal', status: 'Em andamento' },
    { id: 3, time: '14:00', name: 'Maria Fernandes', type: 'Entrega de Plano', status: 'Confirmado' },
    { id: 4, time: '16:15', name: 'Roberto Lima', type: 'Bioimpedância', status: 'Pendente' },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 space-y-8">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Olá, <span className="text-primary">{user?.fullName || 'Doutor(a)'}</span>
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Resumo das suas atividades clínicas de hoje.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
             <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-xl text-sm font-medium text-muted-foreground shadow-sm">
                <Clock size={16} className="text-primary" />
                <span className="capitalize">
                    {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </span>
            </div>
        </div>
      </div>

      {/* --- STATS CARDS (Estilo KPI Clean) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full group">
            <div className="flex justify-between items-start mb-4">
               {/* Ícone com fundo Sálvia (Secondary) */}
               <div className="p-3 bg-secondary rounded-xl text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <stat.icon size={20} />
               </div>
               {stat.trend && (
                 <span className={cn(
                    "text-[10px] font-semibold px-2 py-1 rounded-full border",
                    stat.trendUp 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                        : "bg-red-50 text-red-700 border-red-100"
                 )}>
                    {stat.trend}
                 </span>
               )}
            </div>
            <div>
                <h3 className="text-3xl font-bold text-foreground tracking-tight">{stat.value}</h3>
                <p className="text-sm font-medium text-muted-foreground mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- AGENDA DO DIA (2 Colunas) --- */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-semibold text-foreground">Agenda do Dia</h3>
            <Link href="/dashboard/schedule" className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
              Ver agenda completa <ChevronRight size={14} />
            </Link>
          </div>

          <div className="bg-white border border-border rounded-3xl shadow-sm overflow-hidden">
             {/* Cabeçalho da Lista (Opcional, para dar estrutura) */}
             <div className="px-6 py-4 border-b border-border bg-muted/20 flex justify-between items-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Paciente & Horário</span>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                    <MoreHorizontal size={16} />
                </Button>
             </div>

            <div className="divide-y divide-border">
                {appointments.map((app) => (
                <div key={app.id} className="flex items-center gap-4 p-5 hover:bg-secondary/20 transition-colors cursor-pointer group">
                    {/* Time Badge */}
                    <div className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-secondary/50 text-primary font-bold border border-secondary group-hover:bg-white group-hover:border-primary/20 transition-all">
                        <span className="text-sm">{app.time.split(':')[0]}</span>
                        <span className="text-[10px] text-primary/70">:{app.time.split(':')[1]}</span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground text-sm md:text-base group-hover:text-primary transition-colors truncate">
                            {app.name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <span className="bg-muted px-2 py-0.5 rounded-md truncate max-w-[120px] md:max-w-none">{app.type}</span>
                            <span className="hidden sm:inline">•</span> 
                            <span className="hidden sm:inline">Presencial</span>
                        </div>
                    </div>

                    <div className="text-right">
                         <span className={cn(
                            "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
                            app.status === 'Concluído' && "bg-emerald-50 text-emerald-700 border-emerald-100",
                            app.status === 'Confirmado' && "bg-blue-50 text-blue-700 border-blue-100",
                            app.status === 'Em andamento' && "bg-amber-50 text-amber-700 border-amber-100",
                            app.status === 'Pendente' && "bg-slate-50 text-slate-600 border-slate-100",
                         )}>
                             {app.status}
                         </span>
                    </div>
                    
                    <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full hover:bg-muted transition-colors text-muted-foreground">
                        <ArrowRight size={16} />
                    </div>
                </div>
                ))}
            </div>
            {/* Footer da Card */}
            <div className="p-4 bg-muted/10 border-t border-border text-center">
                 <p className="text-xs text-muted-foreground">Você tem mais 2 consultas agendadas para tarde.</p>
            </div>
          </div>
        </div>

        {/* --- SIDEBAR DIREITA (Ações & Lembretes) --- */}
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground px-1">Ações Rápidas</h3>
            
            {/* Card de Novo Paciente (Primary Color) */}
            <Link href="/dashboard/patients/new" className="block group">
                <div className="bg-primary rounded-3xl p-6 text-primary-foreground relative overflow-hidden shadow-lg shadow-primary/20 transition-transform hover:-translate-y-1">
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                            <Plus size={24} className="text-white" />
                        </div>
                        <h4 className="text-xl font-bold mb-2">Novo Paciente</h4>
                        <p className="text-primary-foreground/80 text-sm mb-6 leading-relaxed">
                            Inicie uma nova anamnese e cadastre o perfil clínico.
                        </p>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-90 group-hover:gap-3 transition-all">
                            <span>Começar Cadastro</span> <ArrowRight size={12} />
                        </div>
                    </div>
                    
                    {/* Elementos Decorativos Sutis */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
                </div>
            </Link>
            
            {/* Lista de Lembretes Minimalista */}
            <div className="bg-white border border-border rounded-3xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-5">
                    <div className="p-1.5 bg-amber-100 rounded-md">
                         <Activity size={14} className="text-amber-600" />
                    </div>
                    <h4 className="font-semibold text-sm text-foreground">Lembretes & Pendências</h4>
                </div>
                
                <div className="space-y-4">
                    <div className="flex gap-3 items-start group">
                         <div className="mt-1 w-4 h-4 rounded border border-muted-foreground/30 flex items-center justify-center cursor-pointer hover:border-primary peer">
                            <CheckCircle2 size={0} className="text-primary opacity-0 peer-checked:opacity-100 transition-opacity" />
                         </div>
                         <div className="flex-1">
                            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors cursor-pointer">Enviar dieta da Carla M.</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Prazo: Hoje, 18:00</p>
                         </div>
                    </div>
                    <div className="w-full h-px bg-border/50"></div>
                    <div className="flex gap-3 items-start group">
                         <div className="mt-1 w-4 h-4 rounded border border-muted-foreground/30 flex items-center justify-center cursor-pointer hover:border-primary"></div>
                         <div className="flex-1">
                            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors cursor-pointer">Revisar exames do Sr. Antônio</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Pendente há 2 dias</p>
                         </div>
                    </div>
                    <div className="w-full h-px bg-border/50"></div>
                     <div className="flex gap-3 items-start group">
                         <div className="mt-1 w-4 h-4 rounded border border-muted-foreground/30 flex items-center justify-center cursor-pointer hover:border-primary"></div>
                         <div className="flex-1">
                            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors cursor-pointer">Confirmar agenda de amanhã</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Secretária virtual</p>
                         </div>
                    </div>
                </div>
                
                <Button variant="link" className="w-full mt-4 h-auto p-0 text-xs text-muted-foreground hover:text-primary">
                    Ver todos os lembretes
                </Button>
            </div>
        </div>

      </div>
    </div>
  );
}