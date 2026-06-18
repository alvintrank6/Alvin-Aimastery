import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    if (data.clientEmail) {
      let user = await this.prisma.user.findUnique({
        where: { email: data.clientEmail },
      });

      if (!user) {
        const hashedPassword = await bcrypt.hash('client123', 10);
        await this.prisma.user.create({
          data: {
            email: data.clientEmail,
            password: hashedPassword,
            name: data.clientName || 'Client',
            role: 'client',
          },
        });
      }
    }

    return this.prisma.project.create({ data });
  }

  async findAll() { return this.prisma.project.findMany({ orderBy: { createdAt: 'desc' } }); }
  async findOne(id: string) { return this.prisma.project.findUnique({ where: { id } }); }
  async update(id: string, data: any) { return this.prisma.project.update({ where: { id }, data }); }
  async remove(id: string) { return this.prisma.project.delete({ where: { id } }); }
}

