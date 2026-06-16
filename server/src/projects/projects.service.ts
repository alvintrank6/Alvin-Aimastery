import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) { return this.prisma.project.create({ data }); }
  async findAll() { return this.prisma.project.findMany({ orderBy: { createdAt: 'desc' } }); }
  async findOne(id: string) { return this.prisma.project.findUnique({ where: { id } }); }
  async update(id: string, data: any) { return this.prisma.project.update({ where: { id }, data }); }
  async remove(id: string) { return this.prisma.project.delete({ where: { id } }); }
}
