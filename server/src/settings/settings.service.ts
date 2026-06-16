import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) { return this.prisma.setting.create({ data }); }
  async findAll() { return this.prisma.setting.findMany({ orderBy: { createdAt: 'desc' } }); }
  async findOne(id: string) { return this.prisma.setting.findUnique({ where: { id } }); }
  async update(id: string, data: any) { return this.prisma.setting.update({ where: { id }, data }); }
  async remove(id: string) { return this.prisma.setting.delete({ where: { id } }); }
}
