'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, BarChart3, LogOut } from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/patients', label: 'Pacientes', icon: Users },
    { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="w-72 h-screen fixed left-0 top-0 bg-gradient-to-b from-emerald-600 via-emerald-700 to-teal-900 flex flex-col z-50 shadow-2xl overflow-hidden text-white">
      
      {/* Header */}
      <div className="p-8 relative z-10">
        <div className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500">
            <span className="text-emerald-900 text-xl font-black">N</span>
          </div>
          <span className="text-xl font-black tracking-tighter">Nutri<span className="text-emerald-300">Plan</span></span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1.5 relative z-10">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isActive
                    ? 'bg-white/10 border border-white/10 shadow-lg translate-x-1'
                    : 'text-emerald-100/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={18} className={`${isActive ? 'text-emerald-300' : ''}`} />
                <span className="font-bold tracking-tight text-sm">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* --- RODAPÉ SIMPLIFICADO --- */}
      <div className="p-6 border-t border-white/10 relative z-10">
        {/* Info Usuário Clean */}
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="w-9 h-9 rounded-lg bg-emerald-400/20 border border-emerald-400/30 flex items-center justify-center font-black text-emerald-300 text-xs">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-sm truncate leading-tight">
              {user?.fullName || 'Usuário'}
            </span>
            <span className="text-[9px] text-emerald-300/50 font-black uppercase tracking-widest">
              Nutricionista
            </span>
          </div>
        </div>

        {/* Botão Sair Minimalista */}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-2 py-2 text-emerald-200/50 hover:text-red-400 transition-colors group"
        >
          <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Sair do Sistema</span>
        </button>
      </div>
    </div>
  );
}