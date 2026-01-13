'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Loader2, ArrowRight, Leaf, Lock, Mail } from 'lucide-react'; // Instalar lucide-react se não tiver

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
      setError(err.response?.data?.message || 'Credenciais inválidas. Verifique seus dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-background">
      
      {/* --- LADO ESQUERDO: VISUAL BRANDING --- */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary overflow-hidden flex-col justify-between p-16 text-primary-foreground">
        {/* Background Orgânico Abstrato (CSS Only) */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
           <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white rounded-full mix-blend-overlay blur-3xl -translate-y-1/2 translate-x-1/3"></div>
           <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-400 rounded-full mix-blend-overlay blur-3xl translate-y-1/3 -translate-x-1/3"></div>
        </div>

        {/* Logo/Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold tracking-tight">NutriPlan</span>
        </div>

        {/* Citações / Proposta de Valor */}
        <div className="relative z-10 max-w-lg">
          <h1 className="text-5xl font-light leading-tight mb-6">
            A ciência da nutrição, <br />
            <span className="font-serif italic text-emerald-200">simplificada.</span>
          </h1>
          <p className="text-primary-foreground/80 text-lg font-light leading-relaxed">
            Gerencie dietas, acompanhe pacientes e otimize seu tempo clínico em uma única plataforma inteligente.
          </p>
        </div>

        {/* Footer da imagem */}
        <div className="relative z-10 flex items-center gap-4 text-xs font-medium text-primary-foreground/60 uppercase tracking-widest">
          <span>Software para Nutricionistas</span>
          <div className="h-px w-8 bg-white/30"></div>
          <span>v2.0</span>
        </div>
      </div>

      {/* --- LADO DIREITO: FORMULÁRIO --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-background relative">
        <div className="w-full max-w-[420px] space-y-8">
          
          <div className="text-center lg:text-left">
             {/* Mobile Logo (Apenas visível em telas pequenas) */}
            <div className="flex lg:hidden justify-center mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Leaf className="w-6 h-6" />
              </div>
            </div>

            <h2 className="text-3xl font-semibold text-foreground tracking-tight">Bem-vindo de volta</h2>
            <p className="text-muted-foreground mt-2 text-sm">
              Acesse seu painel para gerenciar seus pacientes.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {error && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail Profissional</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="dr.nome@exemplo.com" 
                    className="pl-10 h-11 bg-muted/30 border-input transition-all focus:bg-background focus:ring-2 focus:ring-primary/20"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <Link href="/forgot-password" className="text-xs text-primary font-medium hover:underline">
                    Esqueceu a senha?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-10 h-11 bg-muted/30 border-input transition-all focus:bg-background focus:ring-2 focus:ring-primary/20"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Autenticando...
                </>
              ) : (
                <>
                  Entrar no Sistema <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Novo por aqui?
              </span>
            </div>
          </div>

          <div className="text-center">
            <Link 
              href="/register" 
              className="inline-flex items-center justify-center text-sm font-medium text-primary hover:text-primary/80 transition-colors hover:underline underline-offset-4"
            >
              Criar minha conta profissional
            </Link>
          </div>

          {/* Rodapé discreto */}
          <p className="text-center text-[10px] text-muted-foreground mt-8">
            Protegido por reCAPTCHA e sujeito à Política de Privacidade e Termos de Uso da NutriPlan.
          </p>
        </div>
      </div>
    </div>
  );
}