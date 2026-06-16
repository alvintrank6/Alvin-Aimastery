import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PayoutRequestsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) { return this.prisma.payoutRequest.create({ data }); }
  async findAll() { return this.prisma.payoutRequest.findMany({ orderBy: { createdAt: 'desc' } }); }
  async findOne(id: string) { return this.prisma.payoutRequest.findUnique({ where: { id } }); }
  async update(id: string, data: any) { return this.prisma.payoutRequest.update({ where: { id }, data }); }
  async remove(id: string) { return this.prisma.payoutRequest.delete({ where: { id } }); }
}
