import { Module } from '@nestjs/common';
import { FreelancersController } from './freelancers.controller';
import { FreelancersService } from './freelancers.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [FreelancersController],
  providers: [FreelancersService, PrismaService],
})
export class FreelancersModule {}
