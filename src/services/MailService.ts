import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

export interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export interface SentMessage {
  messageId: string;
  accepted: string[];
  rejected: string[];
  previewUrl: string | false;
}

/**
 * Email service built on nodemailer.
 *
 * Two ways to create:
 *   1. MailService.createEthereal()  — spins up a free disposable Ethereal account (no config needed)
 *   2. MailService.create()          — uses SMTP settings from env vars
 *
 * Ethereal is ideal for tests: emails are captured but never delivered,
 * and each sent message gets a preview URL you can open in a browser.
 *
 * Env vars for custom SMTP (used by MailService.create()):
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
 */
export class MailService {
  private constructor(
    private readonly transporter: Transporter<SMTPTransport.SentMessageInfo>,
    readonly senderAddress: string,
  ) {}

  /**
   * Create a service backed by a disposable Ethereal test account.
   * No configuration needed — account is generated on the fly.
   */
  static async createEthereal(): Promise<MailService> {
    const account = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: { user: account.user, pass: account.pass },
    });

    return new MailService(transporter, account.user);
  }

  /**
   * Create a service using SMTP settings from environment variables.
   * Falls back to Ethereal if SMTP_HOST is not set.
   */
  static async create(): Promise<MailService> {
    const host = process.env.SMTP_HOST;
    if (!host) return MailService.createEthereal();

    const transporter = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER ?? '',
        pass: process.env.SMTP_PASS ?? '',
      },
    });

    return new MailService(transporter, process.env.SMTP_USER ?? '');
  }

  async sendMail(options: MailOptions): Promise<SentMessage> {
    const info = await this.transporter.sendMail(options);

    return {
      messageId: info.messageId,
      accepted: info.accepted as string[],
      rejected: info.rejected as string[],
      previewUrl: nodemailer.getTestMessageUrl(info),
    };
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch {
      return false;
    }
  }

  close(): void {
    this.transporter.close();
  }
}
