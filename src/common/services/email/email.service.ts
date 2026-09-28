import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { Mail, Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: Transporter;
  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.getOrThrow<string>('EMAIL_USER'),
        pass: this.configService.getOrThrow<string>('EMAIL_PASS'),
      },
    });
  }
  sendEmail = async ({ to, subject, html }: Mail.Options) => {
    const info = await this.transporter.sendMail({
      from: `"E-commerce App" <${this.configService.getOrThrow<string>('EMAIL_USER')}>`,
      to,
      subject,
      html,
    });
    console.log('email send', info.messageId);
  };
}
