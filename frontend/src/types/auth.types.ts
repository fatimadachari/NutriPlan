export interface User {
  userId: string;
  email: string;
  fullName: string;
  token: string;
  expiresAt: string;
}

export interface AuthError {
  message?: string;
  errors?: Record<string, string[]>;
}