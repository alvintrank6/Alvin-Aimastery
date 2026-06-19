import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DevelopersService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService
  ) {}

  async create(data: any) {
    const { phone, ...devData } = data;

    let user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      const hashedPassword = await bcrypt.hash('free123', 10);
      user = await this.prisma.user.create({
        data: {
          email: data.email,
          phone: phone || null,
          password: hashedPassword,
          name: data.name,
          role: 'developer',
        },
      });
    } else if (phone) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { phone },
      });
    }

    const developer = await this.prisma.developer.create({
      data: {
        ...devData,
        id: user.id,
      },
    });

    // Send email alert to admin asynchronously
    this.mailService.sendDeveloperRegistrationAlert(developer).catch(err => {
      console.error('Failed to send registration email alert:', err);
    });

    return developer;
  }

  async findAll() { return this.prisma.developer.findMany({ orderBy: { createdAt: 'desc' } }); }
  async findOne(id: string) { return this.prisma.developer.findUnique({ where: { id } }); }
  async update(id: string, data: any) { return this.prisma.developer.update({ where: { id }, data }); }
  async remove(id: string) { return this.prisma.developer.delete({ where: { id } }); }
}

