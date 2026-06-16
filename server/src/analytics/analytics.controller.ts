import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('traffic') getTraffic(@Query('filter') filter?: string) {
    return this.analyticsService.getTrafficMetrics(filter);
  }
  
  @Get('alerts') getAlerts() { return this.analyticsService.getCampaignAlerts(); }
  @Get('finance') getFinance() { return this.analyticsService.getFinanceLogs(); }
  
  @Post('track') track(@Body('source') source: string) {
    return this.analyticsService.recordVisit(source);
  }
}
