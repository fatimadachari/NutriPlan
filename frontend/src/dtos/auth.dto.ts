export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  fullName: string;
  email: string;
  password: string;
  crn: string;
}

export interface AuthResponseDto {
  token: string;
  email: string;
  fullName: string;
  userId: string;
  expiresAt: string;
}