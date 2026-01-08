'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function RegisterPage() {
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [crn, setCrn] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register({ fullName, email, password, crn });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#04120f] p-4 relative overflow-hidden">
      
      {/* --- BACKGROUND DINÂMICO DE ALTA ENERGIA (IGUAL AO LOGIN) --- */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-15%] left-[-10%] w-[700px] h-[700px] bg-emerald-500/40 rounded-full blur-[120px] animate-float"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-lime-400/30 rounded-full blur-[100px] animate-float-delayed"></div>
        <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-teal-500/30 rounded-full blur-[110px] animate-float"></div>
        <div className="absolute bottom-[20%] left-[20%] w-[300px] h-[300px] bg-emerald-300/20 rounded-full blur-[60px] animate-orbit"></div>
      </div>

      {/* --- CARD DE REGISTO --- */}
      <div className="relative z-10 flex flex-col md:flex-row w-full max-w-4xl bg-white/[0.03] backdrop-blur-2xl rounded-[3rem] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.5)] min-h-[550px] border border-white/10">
        
        {/* LADO ESQUERDO: BANNER COLORIDO */}
        <div className="w-full md:w-[35%] bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-900 p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10 group">
              <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)] group-hover:rotate-12 transition-transform duration-500">
                <span className="text-emerald-900 text-2xl font-black">N</span>
              </div>
              <span className="text-2xl font-black tracking-tighter">Nutri<span className="text-emerald-300">Plan</span></span>
            </div>
            
            <h1 className="text-4xl font-black leading-[1.1] mb-4">
              Junte-se <br />
              à nossa <br />
              <span className="text-emerald-300 italic">rede.</span>
            </h1>
            <p className="text-emerald-100/70 text-sm font-medium leading-relaxed">
              Comece a transformar a vida dos seus pacientes hoje mesmo.
            </p>
          </div>

          <div className="relative z-10 text-emerald-300/50 text-[10px] font-black uppercase tracking-[0.3em]">
            Gestão Profissional
          </div>
        </div>

        {/* LADO DIREITO: FORMULÁRIO */}
        <div className="w-full md:w-[65%] p-10 md:p-14 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-8">
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Criar Conta</h2>
              <div className="h-1.5 w-10 bg-emerald-500 rounded-full mt-2"></div>
            </div>
            
            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold animate-bounce-subtle">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-slate-400 text-[10px] uppercase font-black tracking-widest ml-1">Nome Completo</Label>
                <Input
                  placeholder="Dr. João Silva"
                  className="h-12 bg-slate-50 border-slate-100 focus:border-emerald-500 focus:bg-white rounded-2xl transition-all font-medium text-slate-700"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-slate-400 text-[10px] uppercase font-black tracking-widest ml-1">E-mail</Label>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    className="h-12 bg-slate-50 border-slate-100 focus:border-emerald-500 focus:bg-white rounded-2xl transition-all font-medium text-slate-700"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-slate-400 text-[10px] uppercase font-black tracking-widest ml-1">CRN</Label>
                  <Input
                    placeholder="0000/P"
                    className="h-12 bg-slate-50 border-slate-100 focus:border-emerald-500 focus:bg-white rounded-2xl transition-all font-medium text-slate-700"
                    value={crn}
                    onChange={(e) => setCrn(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-slate-400 text-[10px] uppercase font-black tracking-widest ml-1">Palavra-passe</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="h-12 bg-slate-50 border-slate-100 focus:border-emerald-500 focus:bg-white rounded-2xl transition-all font-medium text-slate-700"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <div className="flex flex-col gap-4 pt-6">
                <Button 
                  type="submit" 
                  className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl shadow-[0_15px_30px_-5px_rgba(16,185,129,0.4)] font-black text-base transition-all active:scale-95"
                  disabled={loading}
                >
                  {loading ? 'A criar conta...' : 'Concluir Registo'}
                </Button>
                <p className="text-center text-slate-400 text-xs font-bold uppercase tracking-tighter">
                  Já tens uma conta?{' '}
                  <Link href="/login" className="text-emerald-600 hover:text-emerald-700">Faz login</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

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
        .animate-float { animation: float 15s infinite ease-in-out; }
        .animate-float-delayed { animation: float 18s infinite ease-in-out reverse; animation-delay: 2s; }
        .animate-orbit { animation: orbit 25s infinite linear; }
        .animate-bounce-subtle { animation: bounce-subtle 0.5s ease-in-out infinite; }
      `}</style>
    </div>
  );
}