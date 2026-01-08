'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [quote, setQuote] = useState("");

  const quotes = [
    "Preparando seu consultório digital...",
    "Sua melhor versão começa aqui.",
    "Organizando planos e metas...",
    "Nutrindo o seu sucesso...",
    "Transformando saúde em dados..."
  ];

  useEffect(() => {
    // Escolhe uma frase aleatória ao montar o componente
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);

    if (!loading) {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#04120f] relative overflow-hidden">
      
      {/* --- BACKGROUND DINÂMICO (IGUAL AO LOGIN) --- */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-15%] left-[-10%] w-[700px] h-[700px] bg-emerald-500/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-lime-400/10 rounded-full blur-[100px] animate-pulse"></div>
      </div>

      {/* --- CONTEÚDO DE LOADING --- */}
      <div className="relative z-10 flex flex-col items-center max-w-xs text-center">
        
        {/* Logo Com Brilho Externo */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-emerald-500 rounded-[2rem] blur-2xl opacity-20 animate-pulse"></div>
          <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center relative z-10 animate-float">
            <span className="text-emerald-900 text-4xl font-black">N</span>
          </div>
        </div>

        {/* Texto de Status */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-white font-black text-xl tracking-tighter animate-fade-in">
              Nutri<span className="text-emerald-400 italic">Plan</span>
            </h2>
            <p className="text-emerald-100/40 text-[10px] uppercase font-black tracking-[0.3em]">
              Sincronizando Dados
            </p>
          </div>

          {/* Barra de Progresso Customizada */}
          <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-lime-400 w-1/3 rounded-full animate-progress"></div>
          </div>

          {/* Frase Motivacional */}
          <p className="text-emerald-100/60 text-sm font-medium italic animate-fade-in-delayed px-4">
            "{quote}"
          </p>
        </div>
      </div>

      {/* --- ANIMAÇÕES --- */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-15px) scale(1.05); }
        }
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: float 3s infinite ease-in-out;
        }
        .animate-progress {
          animation: progress 2s infinite ease-in-out;
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        .animate-fade-in-delayed {
          opacity: 0;
          animation: fade-in 0.8s ease-out 0.4s forwards;
        }
      `}</style>
    </div>
  );
}