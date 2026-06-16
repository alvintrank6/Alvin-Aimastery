const fs = require('fs');
const path = require('path');

const models = [
  { name: 'Lead', folder: 'leads' },
  { name: 'Freelancer', folder: 'freelancers' },
  { name: 'Project', folder: 'projects' },
  { name: 'PayoutRequest', folder: 'payouts' },
  { name: 'TrafficMetric', folder: 'analytics' },
  { name: 'Setting', folder: 'settings' }
];

const analyticsModels = ['TrafficMetric', 'CampaignAlert', 'FinanceLog'];

models.forEach(({ name, folder }) => {
  const dir = path.join(__dirname, 'src', folder);
  const camelName = name.charAt(0).toLowerCase() + name.slice(1);
  const pluralName = folder; // e.g. leads

  // Special logic for analytics
  if (folder === 'analytics') {
    const serviceContent = `import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getTrafficMetrics() { return this.prisma.trafficMetric.findMany(); }
  async getCampaignAlerts() { return this.prisma.campaignAlert.findMany(); }
  async getFinanceLogs() { return this.prisma.financeLog.findMany(); }
}
`;
    const controllerContent = `import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('traffic') getTraffic() { return this.analyticsService.getTrafficMetrics(); }
  @Get('alerts') getAlerts() { return this.analyticsService.getCampaignAlerts(); }
  @Get('finance') getFinance() { return this.analyticsService.getFinanceLogs(); }
}
`;
    const moduleContent = `import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService, PrismaService],
})
export class AnalyticsModule {}
`;
    fs.writeFileSync(path.join(dir, 'analytics.service.ts'), serviceContent);
    fs.writeFileSync(path.join(dir, 'analytics.controller.ts'), controllerContent);
    fs.writeFileSync(path.join(dir, 'analytics.module.ts'), moduleContent);
    return;
  }

  // Standard CRUD for others
  const serviceContent = `import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ${name}sService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) { return this.prisma.${camelName}.create({ data }); }
  async findAll() { return this.prisma.${camelName}.findMany({ orderBy: { createdAt: 'desc' } }); }
  async findOne(id: string) { return this.prisma.${camelName}.findUnique({ where: { id } }); }
  async update(id: string, data: any) { return this.prisma.${camelName}.update({ where: { id }, data }); }
  async remove(id: string) { return this.prisma.${camelName}.delete({ where: { id } }); }
}
`;
  const controllerContent = `import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ${name}sService } from './${folder}.service';

@Controller('${folder}')
export class ${name}sController {
  constructor(private readonly service: ${name}sService) {}

  @Post() create(@Body() data: any) { return this.service.create(data); }
  @Get() findAll() { return this.service.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(id); }
  @Put(':id') update(@Param('id') id: string, @Body() data: any) { return this.service.update(id, data); }
  @Delete(':id') remove(@Param('id') id: string) { return this.service.remove(id); }
}
`;
  const moduleContent = `import { Module } from '@nestjs/common';
import { ${name}sController } from './${folder}.controller';
import { ${name}sService } from './${folder}.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [${name}sController],
  providers: [${name}sService, PrismaService],
})
export class ${name}sModule {}
`;

  fs.writeFileSync(path.join(dir, folder + '.service.ts'), serviceContent);
  fs.writeFileSync(path.join(dir, folder + '.controller.ts'), controllerContent);
  fs.writeFileSync(path.join(dir, folder + '.module.ts'), moduleContent);
});

console.log('CRUD generated successfully');
