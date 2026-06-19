import { Controller, Post, Body, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() signInDto: Record<string, any>) {
    const user = await this.authService.validateUser(signInDto.email, signInDto.password);
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác.');
    }
    return this.authService.handleLogin2FA(user);
  }

  @HttpCode(HttpStatus.OK)
  @Post('verify-2fa')
  async verify2FA(@Body() body: Record<string, any>) {
    const { tempToken, code } = body;
    if (!tempToken || !code) {
      throw new UnauthorizedException('Thiếu mã OTP hoặc mã phiên đăng nhập.');
    }
    return this.authService.verify2FA(tempToken, code);
  }

  @Post('register')
  async register(@Body() signUpDto: Record<string, any>) {
    return this.authService.register(signUpDto);
  }
}
