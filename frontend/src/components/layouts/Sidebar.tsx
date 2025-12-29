'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, LogOut, Home } from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/patients', label: 'Pacientes', icon: Users },
  ];

  return (
    <div className="w-64 bg-white border-r min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xl font-bold">N</span>
          </div>
          <div>
            <h2 className="font-bold text-lg">NutriPlan</h2>
            <p className="text-xs text-gray-500">{user?.fullName}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-green-50 text-green-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={logout}
        >
          <LogOut size={20} className="mr-3" />
          Sair
        </Button>
      </div>
    </div>
  );
}