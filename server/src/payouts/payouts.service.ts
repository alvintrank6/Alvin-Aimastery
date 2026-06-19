import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PayoutRequestsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    const { projectId, amount } = data;

    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    // Get tax rate from settings, fallback to project.taxRate, then default to 10
    let taxRate = 10;
    try {
      const setting = await this.prisma.setting.findUnique({ where: { key: 'taxRate' } });
      if (setting) {
        taxRate = parseFloat(setting.value) || 10;
      }
    } catch (e) {
      // ignore
    }

    const finalTaxRate = project.taxRate !== undefined ? project.taxRate : taxRate;
    const payoutAmount = amount !== undefined ? amount : project.outsourceFee;
    const taxDeducted = (payoutAmount * finalTaxRate) / 100;
    const netAmount = payoutAmount - taxDeducted;

    // Create PayoutRequest
    const payoutRequest = await this.prisma.payoutRequest.create({
      data: {
        projectId: project.id,
        projectName: project.name,
        developerId: project.assigneeId || 'Unassigned',
        developerName: project.assigneeName || 'Unassigned Developer',
        amount: payoutAmount,
        taxDeducted,
        netAmount,
        status: 'Pending',
      },
    });

    // Update project payout status
    await this.prisma.project.update({
      where: { id: project.id },
      data: { payoutStatus: 'Requested' },
    });

    return payoutRequest;
  }

  async findAll() {
    return this.prisma.payoutRequest.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    return this.prisma.payoutRequest.findUnique({ where: { id } });
  }

  async update(id: string, data: any) {
    const payout = await this.prisma.payoutRequest.update({
      where: { id },
      data,
    });

    // Update matching project
    if (data.status === 'Approved') {
      await this.prisma.project.update({
        where: { id: payout.projectId },
        data: { payoutStatus: 'Approved' },
      });
    } else if (data.status === 'Paid') {
      await this.prisma.project.update({
        where: { id: payout.projectId },
        data: { payoutStatus: 'Paid' },
      });
    }

    return payout;
  }

  async remove(id: string) {
    const payout = await this.prisma.payoutRequest.findUnique({ where: { id } });
    if (payout) {
      await this.prisma.project.update({
        where: { id: payout.projectId },
        data: { payoutStatus: 'None' },
      });
    }
    return this.prisma.payoutRequest.delete({ where: { id } });
  }
}
