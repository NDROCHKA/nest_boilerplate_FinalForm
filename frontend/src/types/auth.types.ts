import { User } from './user.types';

export interface AuthEmailLoginDto {
  email: string;
  password: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  tokenExpires: number; // timestamp in ms
  user: User;
}

export interface RefreshResponse {
  token: string;
  refreshToken: string;
  tokenExpires: number;
}

export interface VerifyOtpDto {
  email: string;
  otpCode: string;
}

export interface ResendOtpDto {
  email: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface VerifyPasswordResetOtpDto {
  email: string;
  otpCode: string;
}

export interface VerifyPasswordResetOtpResponse {
  resetToken: string;
  expiresInSeconds: number;
}

export interface ResetPasswordDto {
  email: string;
  resetToken: string;
  newPassword: string;
}
