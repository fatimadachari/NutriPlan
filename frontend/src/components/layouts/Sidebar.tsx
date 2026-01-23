"use client";

import { useAuth } from "@/contexts/auth.context";
import { useAuthActions } from "@/hooks/use-auth.hook";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  LogOut,
  Settings,
  Leaf,
  CalendarDays,
  Utensils,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const { user } = useAuth();
  const { logout } = useAuthActions();
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Visão Geral", icon: LayoutDashboard },
    { href: "/dashboard/patients", label: "Meus Pacientes", icon: Users },
    { href: "/dashboard/schedule", label: "Agenda", icon: CalendarDays },
    { href: "/dashboard/meal-plans", label: "Planos Alimentares", icon: Utensils },
    { href: "/dashboard/analytics", label: "Relatórios", icon: BarChart3 },
    { href: "/dashboard/settings", label: "Configurações", icon: Settings },
  ];

  return (
    <aside className="w-72 h-screen fixed left-0 top-0 bg-primary text-primary-foreground flex flex-col z-50 shadow-2xl border-r border-white/10 transition-all duration-300 overflow-hidden">
      
      {/* BACKGROUND VISUAL */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] right-[-50%] w-[500px] h-[500px] bg-white rounded-full mix-blend-overlay blur-3xl opacity-50"></div>
        <div className="absolute bottom-[-10%] left-[-20%] w-[400px] h-[400px] bg-emerald-400 rounded-full mix-blend-overlay blur-3xl opacity-40"></div>
      </div>

      {/* HEADER */}
      <div className="p-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 shadow-lg">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight leading-none">
              NutriPlan
            </h1>
            <span className="text-[10px] uppercase tracking-widest text-primary-foreground/60 font-medium mt-1 block">
              Painel Clínico
            </span>
          </div>
        </div>
      </div>

      {/* NAVEGAÇÃO */}
      <nav className="flex-1 px-4 space-y-2 relative z-10 overflow-y-auto py-4 scrollbar-hide">
        <p className="px-4 text-[10px] font-bold text-primary-foreground/40 uppercase tracking-widest mb-3">
          Menu Principal
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group relative border",
                  isActive
                    ? "bg-white/15 border-white/10 text-white shadow-sm backdrop-blur-sm"
                    : "border-transparent text-primary-foreground/70 hover:bg-white/10 hover:text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={18}
                    className={cn(
                      "transition-colors",
                      isActive ? "text-emerald-200" : "group-hover:text-emerald-200"
                    )}
                  />
                  <span className="text-sm font-medium tracking-wide">
                    {item.label}
                  </span>
                </div>

                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-200 shadow-[0_0_8px_rgba(167,243,208,0.5)]" />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* RODAPÉ / PERFIL */}
      <div className="p-4 border-t border-white/10 relative z-10 bg-black/10 backdrop-blur-md">
        <div className="flex items-center gap-3 p-2 rounded-2xl hover:bg-white/5 transition-colors group cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-200 to-teal-300 flex items-center justify-center text-primary font-bold shadow-lg ring-2 ring-white/10">
            {user?.fullName?.charAt(0) || "D"}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate text-white">
              {user?.fullName || "Dr. Usuário"}
            </p>
            <p className="text-[10px] text-primary-foreground/60 truncate">
              {user?.email || "nutri@exemplo.com"}
            </p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              logout();
            }}
            className="p-2 rounded-lg hover:bg-red-500/20 text-primary-foreground/60 hover:text-red-200 transition-colors"
            title="Sair"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}