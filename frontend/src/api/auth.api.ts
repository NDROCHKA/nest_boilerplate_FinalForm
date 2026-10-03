import { client } from './client';
import {
  AuthEmailLoginDto,
  ForgotPasswordDto,
  LoginResponse,
  ResendOtpDto,
  ResetPasswordDto,
  VerifyOtpDto,
  VerifyPasswordResetOtpDto,
  VerifyPasswordResetOtpResponse,
} from '../types/auth.types';
import { CreateUserDto } from '../types/user.types';

export const authApi = {
  login: (data: AuthEmailLoginDto): Promise<LoginResponse> => {
    return client.post<LoginResponse>('auth/email/login', data);
  },
  register: (data: CreateUserDto): Promise<{ message: string }> => {
    return client.post<{ message: string }>('auth/email/register', data);
  },
  verifyOtp: (data: VerifyOtpDto): Promise<{ message: string }> => {
    return client.post<{ message: string }>('auth/email/verify-otp', data);
  },
  resendOtp: (data: ResendOtpDto): Promise<{ message: string }> => {
    return client.post<{ message: string }>('auth/email/resend-otp', data);
  },
  forgotPassword: (data: ForgotPasswordDto): Promise<{ message: string }> => {
    return client.post<{ message: string }>('auth/email/forgot-password', data);
  },
  verifyPasswordResetOtp: (
    data: VerifyPasswordResetOtpDto,
  ): Promise<VerifyPasswordResetOtpResponse> => {
    return client.post<VerifyPasswordResetOtpResponse>(
      'auth/email/verify-password-reset-otp',
      data,
    );
  },
  resetPassword: (data: ResetPasswordDto): Promise<{ message: string }> => {
    return client.post<{ message: string }>('auth/email/reset-password', data);
  },
};
