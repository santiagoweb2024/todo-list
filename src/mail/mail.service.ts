import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
@Injectable()
export class MailService {
  private readonly resend: Resend;
  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }
  async sendEmail(to: string, subject: string, text: string) {
    const { data, error } = await this.resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to,
      subject,
      text,
      html: '<p>Hello, World2!</p>',
    });

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }
}
