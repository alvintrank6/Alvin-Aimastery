import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class FreelancersService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) { return this.prisma.freelancer.create({ data }); }
  async findAll() { return this.prisma.freelancer.findMany({ orderBy: { createdAt: 'desc' } }); }
  async findOne(id: string) { return this.prisma.freelancer.findUnique({ where: { id } }); }
  async update(id: string, data: any) { return this.prisma.freelancer.update({ where: { id }, data }); }
  async remove(id: string) { return this.prisma.freelancer.delete({ where: { id } }); }
}
