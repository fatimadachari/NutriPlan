'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
    } catch (err: any) {
      setError(err.response?.data?.message || 'E-mail ou senha inválidos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#04120f] p-4 relative overflow-hidden">
      
      {/* --- BACKGROUND DINÂMICO DE ALTA ENERGIA --- */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Esmeralda Intenso */}
        <div className="absolute top-[-15%] left-[-10%] w-[700px] h-[700px] bg-emerald-500/40 rounded-full blur-[120px] animate-float"></div>
        
        {/* Lima Neon para contraste */}
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-lime-400/30 rounded-full blur-[100px] animate-float-delayed"></div>
        
        {/* Turquesa Profundo */}
        <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-teal-500/30 rounded-full blur-[110px] animate-float"></div>
        
        {/* Ponto de Luz em Movimento Rápido */}
        <div className="absolute bottom-[20%] left-[20%] w-[300px] h-[300px] bg-emerald-300/20 rounded-full blur-[60px] animate-orbit"></div>
      </div>

      {/* --- CARD DE LOGIN --- */}
      <div className="relative z-10 flex flex-col md:flex-row w-full max-w-3xl bg-white/[0.03] backdrop-blur-2xl rounded-[3rem] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.5)] min-h-[480px] border border-white/10">
        
        {/* LADO ESQUERDO: BANNER COLORIDO */}
        <div className="w-full md:w-[42%] bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-900 p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Efeito de Vidro Refletido */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10 group">
              <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)] group-hover:rotate-12 transition-transform duration-500">
                <span className="text-emerald-900 text-2xl font-black">N</span>
              </div>
              <span className="text-2xl font-black tracking-tighter">Nutri<span className="text-emerald-300">Plan</span></span>
            </div>
            
            <h1 className="text-4xl font-black leading-[1.1] mb-4 drop-shadow-md">
              A sua <br />
              <span className="text-emerald-300 italic">melhor</span> <br />
              versão.
            </h1>
            <p className="text-emerald-100/70 text-sm font-medium leading-relaxed max-w-[180px]">
              Entre e assuma o controle da sua saúde hoje.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-2 text-emerald-300/50 text-[10px] font-black uppercase tracking-[0.3em]">
            <div className="w-8 h-[1px] bg-emerald-300/30"></div>
            Desde 2026
          </div>
        </div>

        {/* LADO DIREITO: FORMULÁRIO CLEAN */}
        <div className="w-full md:w-[58%] p-10 md:p-14 flex flex-col justify-center bg-white">
          <div className="max-w-sm mx-auto w-full">
            <div className="mb-8">
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Login</h2>
              <div className="h-1.5 w-10 bg-emerald-500 rounded-full mt-2"></div>
            </div>
            
            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold animate-bounce-subtle">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label className="text-slate-400 text-[10px] uppercase font-black tracking-widest ml-1">E-mail Profissional</Label>
                <Input
                  type="email"
                  placeholder="exemplo@nutriplan.com.br"
                  className="h-12 bg-slate-50 border-slate-100 focus:border-emerald-500 focus:bg-white rounded-2xl transition-all font-medium text-slate-700"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-slate-400 text-[10px] uppercase font-black tracking-widest ml-1">Senha</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="h-12 bg-slate-50 border-slate-100 focus:border-emerald-500 focus:bg-white rounded-2xl transition-all font-medium text-slate-700"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-4 pt-4">
                <Button 
                  type="submit" 
                  className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl shadow-[0_15px_30px_-5px_rgba(16,185,129,0.4)] font-black text-base transition-all active:scale-95 flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? 'Autenticando...' : 'Entrar no Sistema'}
                </Button>
                <p className="text-center text-slate-400 text-xs font-bold uppercase tracking-tighter">
                  Ainda não tem conta?{' '}
                  <Link href="/register" className="text-emerald-600 hover:text-emerald-700">Cadastre-se agora</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* --- ANIMAÇÕES CUSTOMIZADAS --- */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -40px) scale(1.1); }
        }
        @keyframes orbit {
          0% { transform: rotate(0deg) translateX(100px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(100px) rotate(-360deg); }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-float {
          animation: float 15s infinite ease-in-out;
        }
        .animate-float-delayed {
          animation: float 18s infinite ease-in-out reverse;
          animation-delay: 2s;
        }
        .animate-orbit {
          animation: orbit 25s infinite linear;
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 0.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}