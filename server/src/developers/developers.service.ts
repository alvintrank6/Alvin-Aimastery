import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DevelopersService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    let user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      const hashedPassword = await bcrypt.hash('free123', 10);
      user = await this.prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          name: data.name,
          role: 'developer',
        },
      });
    }

    return this.prisma.developer.create({
      data: {
        ...data,
        id: user.id,
      },
    });
  }

  async findAll() { return this.prisma.developer.findMany({ orderBy: { createdAt: 'desc' } }); }
  async findOne(id: string) { return this.prisma.developer.findUnique({ where: { id } }); }
  async update(id: string, data: any) { return this.prisma.developer.update({ where: { id }, data }); }
  async remove(id: string) { return this.prisma.developer.delete({ where: { id } }); }
}

