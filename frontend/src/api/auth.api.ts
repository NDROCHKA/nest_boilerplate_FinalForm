import { client } from './client';
import { AuthEmailLoginDto, LoginResponse, VerifyOtpDto, ResendOtpDto } from '../types/auth.types';
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
};
