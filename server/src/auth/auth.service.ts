import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private tempOtps = new Map<string, { code: string; expires: number; user: any }>();

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private mailService: MailService
  ) {}

  async validateUser(emailOrPhone: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmailOrPhone(emailOrPhone);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    };
  }

  async handleLogin2FA(user: any) {
    const twoFaSetting = await this.prisma.setting.findUnique({ where: { key: 'twoFA' } });
    const is2FAEnabled = twoFaSetting?.value === 'true' && (user.role === 'admin' || user.role === 'manager');

    if (is2FAEnabled) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const tempToken = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);

      // Store temp session in memory (expires in 5 minutes)
      this.tempOtps.set(tempToken, {
        code,
        expires: Date.now() + 5 * 60 * 1000,
        user,
      });

      // Send the OTP email to admin
      await this.mailService.sendTwoFactorCode(user.email, code);

      return {
        require2FA: true,
        tempToken,
      };
    }

    // Standard direct login if 2FA is disabled
    return this.login(user);
  }

  async verify2FA(tempToken: string, code: string) {
    const cached = this.tempOtps.get(tempToken);
    if (!cached) {
      throw new UnauthorizedException('Mã xác thực không hợp lệ hoặc đã hết hạn.');
    }

    if (Date.now() > cached.expires) {
      this.tempOtps.delete(tempToken);
      throw new UnauthorizedException('Phiên xác thực đã quá thời gian (5 phút). Vui lòng đăng nhập lại.');
    }

    if (cached.code !== code) {
      throw new UnauthorizedException('Mã OTP nhập vào không chính xác.');
    }

    // Generate JWT payload upon success
    const result = await this.login(cached.user);
    this.tempOtps.delete(tempToken);
    return result;
  }

  async register(data: any) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.usersService.create({
      ...data,
      password: hashedPassword
    });
    return this.login(user);
  }
}
