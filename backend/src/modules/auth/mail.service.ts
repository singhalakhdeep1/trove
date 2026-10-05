import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);
    private transporter: nodemailer.Transporter | null = null;

    constructor(private config: ConfigService) {
        const host = this.config.get<string>('SMTP_HOST');
        if (host) {
            this.transporter = nodemailer.createTransport({
                host,
                port: Number(this.config.get('SMTP_PORT') || 587),
                secure: this.config.get('SMTP_SECURE') === 'true',
                auth: this.config.get('SMTP_USER')
                    ? { user: this.config.get('SMTP_USER'), pass: this.config.get('SMTP_PASS') }
                    : undefined,
            });
        }
    }

    async sendPasswordReset(to: string, token: string): Promise<void> {
        if (!this.transporter) {
            // Never log the token itself: it is a credential.
            this.logger.warn('SMTP_HOST is not configured; password reset email was not sent');
            return;
        }

        const frontend = this.config.get<string>('FRONTEND_URL') || 'http://localhost:3000';
        const link = `${frontend}/reset-password?token=${encodeURIComponent(token)}`;

        await this.transporter.sendMail({
            from: this.config.get<string>('MAIL_FROM') || 'no-reply@trove.local',
            to,
            subject: 'Reset your Trove password',
            text: `Use the link below to reset your password. It expires in 1 hour.\n\n${link}\n\nIf you did not request this, ignore this email.`,
        });
    }
}
