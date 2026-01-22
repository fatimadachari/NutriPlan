'use client';

import { useState } from 'react';
import { useAuthActions } from '@/hooks/use-auth.hook';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordStrength } from '@/components/features/password-strength';
import { validatePassword } from '@/utils/password-validator';
import Link from 'next/link';
import { Loader2, ArrowRight, Leaf, Lock, Mail, User, FileBadge, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const { register, loading, error, setError } = useAuthActions();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [crn, setCrn] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validar senha antes de enviar
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setError('Senha não atende aos requisitos de segurança');
      return;
    }

    await register({ fullName, email, password, crn });
  };

  const inputClasses = "h-11 bg-muted/30 border-input transition-all focus:bg-background focus:ring-2 focus:ring-primary/20";
  const iconClasses = "absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors";

  return (
    <div className="min-h-screen w-full flex bg-background">
      
      {/* LADO ESQUERDO: BRANDING */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary overflow-hidden flex-col justify-between p-16 text-primary-foreground">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
           <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white rounded-full mix-blend-overlay blur-3xl -translate-y-1/2 translate-x-1/3"></div>
           <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-400 rounded-full mix-blend-overlay blur-3xl translate-y-1/3 -translate-x-1/3"></div>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold tracking-tight">NutriPlan</span>
        </div>

        <div className="relative z-10 max-w-lg">
          <h1 className="text-5xl font-light leading-tight mb-6">
            Comece sua <br />
            jornada <span className="font-serif italic text-emerald-200">digital.</span>
          </h1>
          <p className="text-primary-foreground/80 text-lg font-light leading-relaxed">
            Junte-se à plataforma líder para nutricionistas e potencialize seus atendimentos clínicos com tecnologia.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-xs font-medium text-primary-foreground/60 uppercase tracking-widest">
          <span>Software para Nutricionistas</span>
          <div className="h-px w-8 bg-white/30"></div>
          <span>Cadastro</span>
        </div>
      </div>

      {/* LADO DIREITO: FORMULÁRIO */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-background relative overflow-y-auto">
        <div className="w-full max-w-[420px] space-y-8 py-8">
          
          <div className="text-center lg:text-left">
            <div className="flex lg:hidden justify-center mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Leaf className="w-6 h-6" />
              </div>
            </div>

            <h2 className="text-3xl font-semibold text-foreground tracking-tight">Crie sua conta profissional</h2>
            <p className="text-muted-foreground mt-2 text-sm">
              Preencha os dados abaixo para iniciar.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {error && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {error}
              </div>
            )}

            <div className="space-y-4">
              
              {/* Nome Completo */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Nome Completo</Label>
                <div className="relative group">
                  <User className={iconClasses} />
                  <Input 
                    id="fullName" 
                    placeholder="Ex: Dr. João Silva" 
                    className={`pl-10 ${inputClasses}`}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Email e CRN */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <div className="relative group">
                    <Mail className={iconClasses} />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="seu@email.com" 
                      className={`pl-10 ${inputClasses}`}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="crn">CRN</Label>
                  <div className="relative group">
                    <FileBadge className={iconClasses} />
                    <Input 
                      id="crn" 
                      placeholder="12345/SP" 
                      className={`pl-10 ${inputClasses}`}
                      value={crn}
                      onChange={(e) => setCrn(e.target.value.toUpperCase())}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Senha com Toggle de Visibilidade */}
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative group">
                  <Lock className={iconClasses} />
                  <Input 
                    id="password" 
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Crie uma senha segura" 
                    className={`pl-10 pr-10 ${inputClasses}`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-primary transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Indicador de Força da Senha */}
              <PasswordStrength password={password} show={passwordFocused || password.length > 0} />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Criando conta...
                </>
              ) : (
                <>
                  Finalizar Cadastro <ArrowRight className="ml-2 h-4 w-4" />
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
                Já possui cadastro?
              </span>
            </div>
          </div>

          <div className="text-center">
            <Link 
              href="/login" 
              className="inline-flex items-center justify-center text-sm font-medium text-primary hover:text-primary/80 transition-colors hover:underline underline-offset-4"
            >
              Acesse sua conta
            </Link>
          </div>

          <p className="text-center text-[10px] text-muted-foreground mt-8">
            Ao se cadastrar, você concorda com nossos Termos de Uso e Política de Privacidade.
          </p>
        </div>
      </div>
    </div>
  );
}