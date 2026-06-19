import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  private isUuid(str: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
  }

  async create(data: any) { return this.prisma.setting.create({ data }); }
  async findAll() { return this.prisma.setting.findMany({ orderBy: { createdAt: 'desc' } }); }
  
  async findOne(idOrKey: string) {
    if (this.isUuid(idOrKey)) {
      return this.prisma.setting.findUnique({ where: { id: idOrKey } });
    }
    return this.prisma.setting.findUnique({ where: { key: idOrKey } });
  }

  async update(idOrKey: string, data: any) {
    if (this.isUuid(idOrKey)) {
      return this.prisma.setting.update({ where: { id: idOrKey }, data });
    }
    return this.prisma.setting.upsert({
      where: { key: idOrKey },
      update: { value: data.value },
      create: { key: idOrKey, value: data.value },
    });
  }

  async remove(idOrKey: string) {
    if (this.isUuid(idOrKey)) {
      return this.prisma.setting.delete({ where: { id: idOrKey } });
    }
    return this.prisma.setting.delete({ where: { key: idOrKey } });
  }
}

