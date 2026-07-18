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
