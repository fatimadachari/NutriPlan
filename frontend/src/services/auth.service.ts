import { apiClient } from '@/lib/api-client';
import { LoginDto, RegisterDto, AuthResponseDto } from '@/dtos/auth.dto';
import { Result } from '@/utils/result';
import { AxiosError } from 'axios';

export class AuthService {
  private readonly basePath = '/auth';

  async login(dto: LoginDto): Promise<Result<AuthResponseDto>> {
    try {
      const response = await apiClient.post<AuthResponseDto>(
        `${this.basePath}/login`,
        dto
      );
      return Result.ok(response.data);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async register(dto: RegisterDto): Promise<Result<AuthResponseDto>> {
    try {
      const response = await apiClient.post<AuthResponseDto>(
        `${this.basePath}/register`,
        dto
      );
      return Result.ok(response.data);
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError<T>(error: unknown): Result<T> {
    if (error instanceof AxiosError) {
      const data = error.response?.data;

      // Erros de validação estruturados
      if (data?.errors) {
        return Result.failWithErrors(data.errors);
      }

      // Erro simples com mensagem
      if (data?.message) {
        return Result.fail(data.message);
      }
    }

    return Result.fail('Erro ao processar requisição. Tente novamente.');
  }
}

export const authService = new AuthService();