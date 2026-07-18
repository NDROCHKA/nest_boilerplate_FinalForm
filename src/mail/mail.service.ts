import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { AllConfigType } from '../config/config.type';

@Injectable()
export class MailService implements OnModuleInit {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  async onModuleInit(): Promise<void> {
    const host = this.configService.get('mail.host', { infer: true });
    const port = this.configService.get('mail.port', { infer: true });
    const user = this.configService.get('mail.user', { infer: true });
    const pass = this.configService.get('mail.password', { infer: true });

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465 (SSL), false for 587 (TLS)
      auth: {
        user,
        pass,
      },
    });

    // Verify connection on startup
    try {
      await this.transporter.verify();
      this.logger.log('Mail transporter is ready');
    } catch (error) {
      this.logger.warn(
        'Mail transporter verification failed. Emails may not send.',
        error instanceof Error ? error.message : error,
      );
    }
  }

  async sendOtp(
    to: string,
    otpCode: string,
    userName?: string,
  ): Promise<void> {
    const defaultName = this.configService.get('mail.defaultName', {
      infer: true,
    });
    const defaultEmail = this.configService.get('mail.defaultEmail', {
      infer: true,
    });

    const greeting = userName ? `Hi ${userName}` : 'Hi there';

    const html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb;">
        <h2 style="color: #111827; margin: 0 0 8px 0; font-size: 22px;">Verify your email</h2>
        <p style="color: #6b7280; margin: 0 0 24px 0; font-size: 15px;">${greeting}, use the code below to verify your email address.</p>
        <div style="background: #f3f4f6; border-radius: 8px; padding: 20px; text-align: center; margin: 0 0 24px 0;">
          <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #111827; font-family: 'Courier New', monospace;">${otpCode}</span>
        </div>
        <p style="color: #9ca3af; margin: 0; font-size: 13px;">This code expires in <strong>5 minutes</strong>. If you didn't request this, you can safely ignore this email.</p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: `"${defaultName}" <${defaultEmail}>`,
        to,
        subject: `${otpCode} is your verification code`,
        html,
      });

      this.logger.log(`OTP email sent to ${to}`);
    } catch (error) {
      this.logger.error(
        `Failed to send OTP email to ${to}`,
        error instanceof Error ? error.stack : error,
      );
      throw error;
    }
  }
}
