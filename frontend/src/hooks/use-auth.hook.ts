import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { LoginDto, RegisterDto } from '@/dtos/auth.dto';
import { User } from '@/types/auth.types';

export function useAuthActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const login = async (dto: LoginDto) => {
    setLoading(true);
    setError(null);

    const result = await authService.login(dto);

    if (result.success && result.data) {
      localStorage.setItem('token', result.data.token);
      localStorage.setItem('user', JSON.stringify(result.data));
      router.push('/dashboard');
    } else {
      setError(result.error || 'Erro ao fazer login');
    }

    setLoading(false);
    return result;
  };

  const register = async (dto: RegisterDto) => {
    setLoading(true);
    setError(null);

    const result = await authService.register(dto);

    if (result.success && result.data) {
      localStorage.setItem('token', result.data.token);
      localStorage.setItem('user', JSON.stringify(result.data));
      router.push('/dashboard');
    } else {
      setError(result.error || 'Erro ao criar conta');
    }

    setLoading(false);
    return result;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return { login, register, logout, loading, error, setError };
}