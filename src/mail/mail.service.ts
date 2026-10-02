import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { AllConfigType } from '../config/config.type';

@Injectable()
export class MailService implements OnModuleInit {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService<AllConfigType>) {}

  private escapeHtml(value: string): string {
    return value.replace(/[&<>'"]/g, (character) => {
      const entities: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;',
      };
      return entities[character];
    });
  }

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

  async sendOtp(to: string, otpCode: string, userName?: string): Promise<void> {
    const defaultName = this.configService.get('mail.defaultName', {
      infer: true,
    });
    const defaultEmail = this.configService.get('mail.defaultEmail', {
      infer: true,
    });

    const greeting = userName ? `Hi ${this.escapeHtml(userName)}` : 'Hi there';

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

  async sendOrderConfirmed(
    to: string,
    orderId: number,
    userName?: string,
  ): Promise<void> {
    const defaultName = this.configService.get('mail.defaultName', {
      infer: true,
    });
    const defaultEmail = this.configService.get('mail.defaultEmail', {
      infer: true,
    });

    const greeting = userName ? `Hi ${this.escapeHtml(userName)}` : 'Hi there';

    const html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px; background: #0f1015; border-radius: 12px; border: 1px solid #222530; color: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #d63031; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 1px;">Order Confirmed!</h2>
        </div>
        <p style="color: #d1d5db; margin: 0 0 16px 0; font-size: 15px;">${greeting},</p>
        <p style="color: #9ca3af; margin: 0 0 24px 0; font-size: 15px; line-height: 1.6;">
          Your order <strong style="color: #ffffff;">#${orderId}</strong> has been officially confirmed by our team! Your items are now being prepared for delivery.
        </p>
        <div style="background: #181a20; border-radius: 8px; padding: 20px; border-left: 4px solid #d63031; margin-bottom: 24px;">
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #e5e7eb;"><strong>Shipping Status:</strong> Preparing for shipment</p>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #9ca3af;"><strong>⏱️ Estimated Delivery:</strong> 4 to 7 Days</p>
          <p style="margin: 0; font-size: 14px; color: #9ca3af;"><strong>💵 Payment Method:</strong> Cash on Delivery ($4.00 shipping fee included)</p>
        </div>
        <p style="color: #6b7280; margin: 0; font-size: 13px; text-align: center;">
          Thank you for choosing <strong>Crusader Collective</strong> — Wear the Armor of Faith.
        </p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: `"${defaultName}" <${defaultEmail}>`,
        to,
        subject: `🚚 Order #${orderId} Confirmed - Crusader Collective`,
        html,
      });

      this.logger.log(
        `Order confirmed email sent to ${to} for order #${orderId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send order confirmed email to ${to}`,
        error instanceof Error ? error.stack : error,
      );
    }
  }

  async sendOrderDelivered(
    to: string,
    orderId: number,
    userName?: string,
  ): Promise<void> {
    const defaultName = this.configService.get('mail.defaultName', {
      infer: true,
    });
    const defaultEmail = this.configService.get('mail.defaultEmail', {
      infer: true,
    });

    const greeting = userName ? `Hi ${this.escapeHtml(userName)}` : 'Hi there';

    const html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px; background: #0f1015; border-radius: 12px; border: 1px solid #222530; color: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #00d2a0; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 1px;">Order Delivered!</h2>
        </div>
        <p style="color: #d1d5db; margin: 0 0 16px 0; font-size: 15px;">${greeting},</p>
        <p style="color: #9ca3af; margin: 0 0 24px 0; font-size: 15px; line-height: 1.6;">
          Great news! Your order <strong style="color: #ffffff;">#${orderId}</strong> has been successfully delivered.
        </p>
        <div style="background: #181a20; border-radius: 8px; padding: 20px; border-left: 4px solid #00d2a0; margin-bottom: 24px;">
          <p style="margin: 0; font-size: 14px; color: #e5e7eb;">We hope you love your new Crusader gear! If you have any questions, feel free to reach out to our team on Instagram <strong>@crusader.lb</strong>.</p>
        </div>
        <p style="color: #6b7280; margin: 0; font-size: 13px; text-align: center;">
          Thank you for choosing <strong>Crusader Collective</strong> — Wear the Armor of Faith.
        </p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: `"${defaultName}" <${defaultEmail}>`,
        to,
        subject: `✅ Order #${orderId} Delivered - Crusader Collective`,
        html,
      });

      this.logger.log(
        `Order delivered email sent to ${to} for order #${orderId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send order delivered email to ${to}`,
        error instanceof Error ? error.stack : error,
      );
    }
  }
}
