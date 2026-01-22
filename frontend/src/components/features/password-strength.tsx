'use client';

import { useMemo } from 'react';
import { Check, X } from 'lucide-react';
import { getPasswordRequirements, validatePassword } from '@/utils/password-validator';
import { cn } from '@/lib/utils';

interface PasswordStrengthProps {
  password: string;
  show: boolean;
}

export function PasswordStrength({ password, show }: PasswordStrengthProps) {
  const requirements = useMemo(() => getPasswordRequirements(password), [password]);
  const validation = useMemo(() => validatePassword(password), [password]);

  if (!show || !password) return null;

  const strengthConfig = {
    weak: {
      label: 'Fraca',
      color: 'bg-red-500',
      textColor: 'text-red-700',
      width: 'w-1/3',
    },
    medium: {
      label: 'Média',
      color: 'bg-yellow-500',
      textColor: 'text-yellow-700',
      width: 'w-2/3',
    },
    strong: {
      label: 'Forte',
      color: 'bg-green-500',
      textColor: 'text-green-700',
      width: 'w-full',
    },
  };

  const config = strengthConfig[validation.strength];

  return (
    <div className="space-y-3 p-3 rounded-lg bg-muted/50 border border-border animate-in slide-in-from-top-2 duration-300">
      {/* Barra de Força */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground font-medium">Força da senha</span>
          <span className={cn('font-semibold', config.textColor)}>{config.label}</span>
        </div>
        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <div
            className={cn('h-full transition-all duration-300 rounded-full', config.color, config.width)}
          />
        </div>
      </div>

      {/* Requisitos */}
      <div className="space-y-1.5">
        {requirements.map((req, index) => (
          <div
            key={index}
            className={cn(
              'flex items-center gap-2 text-xs transition-colors',
              req.met ? 'text-green-700' : 'text-muted-foreground'
            )}
          >
            {req.met ? (
              <Check className="h-3.5 w-3.5 text-green-600" />
            ) : (
              <X className="h-3.5 w-3.5 text-muted-foreground/50" />
            )}
            <span>{req.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}