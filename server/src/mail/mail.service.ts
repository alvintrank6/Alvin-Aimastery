import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;
  private readonly logsDir = path.join(__dirname, '..', '..', 'logs');

  constructor() {
    this.initTransporter();
  }

  private initTransporter() {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (host && port && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port: parseInt(port),
        secure: parseInt(port) === 465,
        auth: { user, pass },
      });
      this.logger.log('SMTP mail transporter initialized successfully.');
    } else {
      this.logger.warn('SMTP settings missing in .env. Falling back to local logging.');
      if (!fs.existsSync(this.logsDir)) {
        fs.mkdirSync(this.logsDir, { recursive: true });
      }
    }
  }

  async sendMail(to: string, subject: string, html: string, text?: string) {
    if (this.transporter) {
      try {
        const from = process.env.SMTP_FROM || '"Alvin DropServicing" <no-reply@agency.com>';
        await this.transporter.sendMail({
          from,
          to,
          subject,
          text,
          html,
        });
        this.logger.log(`Email successfully sent to ${to}`);
        return true;
      } catch (error) {
        this.logger.error(`Failed to send email to ${to}: ${error.message}`);
      }
    }

    // Fallback: log to file
    const logFilePath = path.join(this.logsDir, 'email_alerts.log');
    const logEntry = `
========================================
[EMAIL SENT AT: ${new Date().toISOString()}]
TO: ${to}
SUBJECT: ${subject}
BODY:
${html}
========================================
\n`;
    try {
      fs.appendFileSync(logFilePath, logEntry, 'utf8');
      this.logger.log(`Email content logged to file: ${logFilePath}`);
    } catch (err) {
      this.logger.error(`Failed to write email to log file: ${err.message}`);
    }
    return false;
  }

  async sendDeveloperRegistrationAlert(dev: any) {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@agency.com';
    const skillsList = Array.isArray(dev.skills) ? dev.skills.join(', ') : dev.skills;
    const subject = `[Đăng Ký Mới] Ứng viên Outsource: ${dev.name}`;
    const html = `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #9B2A4C;">Đơn Đăng Ký Đối Tác Outsource Mới</h2>
        <p>Hệ thống vừa nhận được đơn đăng ký mới từ freelancer với thông tin như sau:</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; width: 150px;">Họ tên:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${dev.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Email:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${dev.email}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Vị trí ứng tuyển:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${dev.title || 'Developer'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Kỹ năng:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${skillsList}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Mức giá mong muốn:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${dev.rateValue} (${dev.rateType})</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Link Portfolio:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><a href="${dev.portfolio}" target="_blank">${dev.portfolio}</a></td>
          </tr>
        </table>
        <p style="margin-top: 25px;">Vui lòng truy cập Super Admin Dashboard để kiểm duyệt hồ sơ của ứng viên này.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;" />
        <p style="font-size: 11px; color: #888;">Thư điện tử được gửi tự động từ Drop Servicing Portal.</p>
      </div>
    `;
    return this.sendMail(adminEmail, subject, html);
  }

  async sendTwoFactorCode(email: string, code: string) {
    const subject = `[Bảo Mật] Mã Xác Thực 2FA Đăng Nhập Portal`;
    const html = `
      <div style="font-family: sans-serif; padding: 20px; color: #333; max-w: 400px; border: 1px solid #eee; border-radius: 10px;">
        <h3 style="color: #2C3E50; border-bottom: 2px solid #9B2A4C; padding-bottom: 10px; margin-top: 0;">Xác Thực Đăng Nhập 2FA</h3>
        <p>Mã xác thực đăng nhập của bạn là:</p>
        <div style="background-color: #F8F6F2; padding: 15px; border-radius: 8px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #9B2A4C; margin: 15px 0;">
          ${code}
        </div>
        <p style="font-size: 12px; color: #555;">Mã này có hiệu lực trong vòng 5 phút. Vui lòng không chia sẻ mã này với bất kỳ ai.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin-top: 20px;" />
        <p style="font-size: 10px; color: #888; margin-bottom: 0;">Drop Servicing Portal Security</p>
      </div>
    `;
    return this.sendMail(email, subject, html);
  }
}
