import { Module } from '@nestjs/common';
import { PayoutRequestsController } from './payouts.controller';
import { PayoutRequestsService } from './payouts.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [PayoutRequestsController],
  providers: [PayoutRequestsService, PrismaService],
})
export class PayoutsModule {}
