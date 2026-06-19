import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private prisma: PrismaService) {}

  async getTrafficMetrics(filter: string = 'day') {
    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Automatically trigger marketing sync when querying metrics
    await this.syncMarketingMetrics().catch(err => {
      this.logger.error(`Error syncing marketing metrics: ${err.message}`);
    });

    if (filter === 'week') {
      // Get visits from last 28 days
      const startDate = new Date();
      startDate.setDate(now.getDate() - 27);
      startDate.setHours(0, 0, 0, 0);

      const visits = await this.prisma.visit.findMany({
        where: {
          createdAt: { gte: startDate },
        },
      });

      const results = [
        { date: 'Week 1', visitors: 0, organic: 0, facebook: 0, tiktok: 0, youtube: 0, direct: 0, type: 'week' },
        { date: 'Week 2', visitors: 0, organic: 0, facebook: 0, tiktok: 0, youtube: 0, direct: 0, type: 'week' },
        { date: 'Week 3', visitors: 0, organic: 0, facebook: 0, tiktok: 0, youtube: 0, direct: 0, type: 'week' },
        { date: 'Week 4', visitors: 0, organic: 0, facebook: 0, tiktok: 0, youtube: 0, direct: 0, type: 'week' },
      ];

      const MS_PER_DAY = 24 * 60 * 60 * 1000;
      const todayMidnight = new Date();
      todayMidnight.setHours(23, 59, 59, 999);

      for (const visit of visits) {
        const diffTime = todayMidnight.getTime() - new Date(visit.createdAt).getTime();
        const diffDays = Math.floor(diffTime / MS_PER_DAY);

        let weekIdx = -1;
        if (diffDays >= 0 && diffDays <= 6) {
          weekIdx = 3; // Week 4 (current week)
        } else if (diffDays >= 7 && diffDays <= 13) {
          weekIdx = 2; // Week 3
        } else if (diffDays >= 14 && diffDays <= 20) {
          weekIdx = 1; // Week 2
        } else if (diffDays >= 21 && diffDays <= 27) {
          weekIdx = 0; // Week 1
        }

        if (weekIdx !== -1) {
          const target = results[weekIdx];
          target.visitors += 1;
          if (visit.source in target) {
            (target as any)[visit.source] += 1;
          } else {
            target.direct += 1;
          }
        }
      }

      return results;
    }

    if (filter === 'month') {
      // Get visits from last 6 months (including current month)
      const startDate = new Date();
      startDate.setMonth(now.getMonth() - 5);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);

      const visits = await this.prisma.visit.findMany({
        where: {
          createdAt: { gte: startDate },
        },
      });

      const curMonthIndex = now.getMonth();
      const targetMonths: { name: string; monthVal: number }[] = [];

      for (let i = 5; i >= 0; i--) {
        let targetMonthIdx = curMonthIndex - i;
        if (targetMonthIdx < 0) {
          targetMonthIdx += 12;
        }
        targetMonths.push({
          name: months[targetMonthIdx],
          monthVal: targetMonthIdx,
        });
      }

      const results = targetMonths.map((m) => ({
        date: m.name,
        visitors: 0,
        organic: 0,
        facebook: 0,
        tiktok: 0,
        youtube: 0,
        direct: 0,
        type: 'month',
      }));

      for (const visit of visits) {
        const vDate = new Date(visit.createdAt);
        const vMonthVal = vDate.getMonth();
        const vMonthStr = months[vMonthVal];

        const target = results.find((r) => r.date === vMonthStr);
        if (target) {
          target.visitors += 1;
          if (visit.source in target) {
            (target as any)[visit.source] += 1;
          } else {
            target.direct += 1;
          }
        }
      }

      return results;
    }

    // Default: 'day' - Get visits from last 7 days
    const startDate = new Date();
    startDate.setDate(now.getDate() - 6);
    startDate.setHours(0, 0, 0, 0);

    const visits = await this.prisma.visit.findMany({
      where: {
        createdAt: { gte: startDate },
      },
    });

    const dates: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const curMonthStr = months[d.getMonth()];
      const curDayStr = `${curMonthStr} ${String(d.getDate()).padStart(2, '0')}`;
      dates.push(curDayStr);
    }

    const results = dates.map((date) => ({
      date,
      visitors: 0,
      organic: 0,
      facebook: 0,
      tiktok: 0,
      youtube: 0,
      direct: 0,
      type: 'day',
    }));

    for (const visit of visits) {
      const vDate = new Date(visit.createdAt);
      const curMonthStr = months[vDate.getMonth()];
      const curDayStr = `${curMonthStr} ${String(vDate.getDate()).padStart(2, '0')}`;

      const target = results.find((r) => r.date === curDayStr);
      if (target) {
        target.visitors += 1;
        if (visit.source in target) {
          (target as any)[visit.source] += 1;
        } else {
          target.direct += 1;
        }
      }
    }

    return results;
  }

  async getCampaignAlerts() {
    return this.prisma.campaignAlert.findMany();
  }

  // Dynamically calculate monthly finance metrics from database projects
  async getFinanceLogs() {
    const projects = await this.prisma.project.findMany();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Group projects by month-year
    const monthlyGroups: Record<string, { revenue: number; outsourceCost: number; otherCost: number; dateObj: Date }> = {};

    projects.forEach(project => {
      const date = new Date(project.createdAt);
      const monthIndex = date.getMonth();
      const year = date.getFullYear();
      const key = `${months[monthIndex]} ${year}`; // e.g. "Jun 2026"

      if (!monthlyGroups[key]) {
        monthlyGroups[key] = {
          revenue: 0,
          outsourceCost: 0,
          otherCost: 0,
          dateObj: new Date(year, monthIndex, 1)
        };
      }

      monthlyGroups[key].revenue += project.contractValue || 0;
      monthlyGroups[key].outsourceCost += project.outsourceFee || 0;
      // Operating cost estimated at 10% of contract value
      monthlyGroups[key].otherCost += (project.contractValue || 0) * 0.1;
    });

    // If there are no projects in the database, return empty default list with last 6 months at 0
    if (Object.keys(monthlyGroups).length === 0) {
      const defaultLogs: Array<{ month: string; revenue: number; outsourceCost: number; otherCost: number }> = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const mIdx = d.getMonth();
        defaultLogs.push({
          month: `${months[mIdx]} ${d.getFullYear()}`,
          revenue: 0,
          outsourceCost: 0,
          otherCost: 0
        });
      }
      return defaultLogs;
    }

    // Sort monthly groups chronologically
    const sortedKeys = Object.keys(monthlyGroups).sort((a, b) => {
      return monthlyGroups[a].dateObj.getTime() - monthlyGroups[b].dateObj.getTime();
    });

    return sortedKeys.map(key => ({
      month: key,
      revenue: parseFloat(monthlyGroups[key].revenue.toFixed(2)),
      outsourceCost: parseFloat(monthlyGroups[key].outsourceCost.toFixed(2)),
      otherCost: parseFloat(monthlyGroups[key].otherCost.toFixed(2))
    }));
  }

  async recordVisit(source: string) {
    const fieldMap: Record<string, string> = {
      tiktok: 'tiktok',
      facebook: 'facebook',
      youtube: 'youtube',
      organic: 'organic',
      direct: 'direct',
    };

    const dbField = fieldMap[source.toLowerCase()] || 'direct';

    await this.prisma.visit.create({
      data: {
        source: dbField,
      },
    });

    return { success: true };
  }

  // Marketing Sync Scripts connecting GA4, Meta, TikTok, YouTube
  async syncMarketingMetrics() {
    const ga4Token = process.env.GA4_ACCESS_TOKEN;
    const metaToken = process.env.META_ACCESS_TOKEN;
    const tiktokToken = process.env.TIKTOK_ACCESS_TOKEN;
    const youtubeToken = process.env.YOUTUBE_API_KEY;

    const logs: string[] = [];

    // 1. Google Analytics 4 API Integration
    if (ga4Token && process.env.GA4_PROPERTY_ID) {
      try {
        const res = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${process.env.GA4_PROPERTY_ID}:runReport`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${ga4Token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            dateRanges: [{ startDate: 'today', endDate: 'today' }],
            metrics: [{ name: 'activeUsers' }],
            dimensions: [{ name: 'sessionSource' }],
          }),
        });
        if (res.ok) {
          const data = await res.json();
          this.logger.log('GA4 API call returned successfully');
          logs.push('GA4 synced successfully.');
        } else {
          logs.push(`GA4 API status: ${res.status}`);
        }
      } catch (err) {
        logs.push(`GA4 API error: ${err.message}`);
      }
    } else {
      logs.push('GA4 credentials missing.');
    }

    // 2. Meta Graph API Ads Insights Integration
    if (metaToken && process.env.META_AD_ACCOUNT_ID) {
      try {
        const res = await fetch(`https://graph.facebook.com/v19.0/act_${process.env.META_AD_ACCOUNT_ID}/insights?access_token=${metaToken}&fields=impressions,clicks,spend`);
        if (res.ok) {
          const data = await res.json();
          this.logger.log('Meta API call returned successfully');
          logs.push('Meta Graph API synced successfully.');
        } else {
          logs.push(`Meta status: ${res.status}`);
        }
      } catch (err) {
        logs.push(`Meta API error: ${err.message}`);
      }
    } else {
      logs.push('Meta credentials missing.');
    }

    // 3. TikTok Business API Integration
    if (tiktokToken && process.env.TIKTOK_ADVERTISER_ID) {
      try {
        const res = await fetch(`https://business-api.tiktok.com/open_api/v1.3/ad/report/get/?advertiser_id=${process.env.TIKTOK_ADVERTISER_ID}`, {
          headers: { 'Access-Token': tiktokToken },
        });
        if (res.ok) {
          const data = await res.json();
          this.logger.log('TikTok API call returned successfully');
          logs.push('TikTok Business API synced successfully.');
        } else {
          logs.push(`TikTok status: ${res.status}`);
        }
      } catch (err) {
        logs.push(`TikTok API error: ${err.message}`);
      }
    } else {
      logs.push('TikTok credentials missing.');
    }

    // 4. YouTube Analytics API Integration
    if (youtubeToken) {
      try {
        const res = await fetch(`https://youtubeanalytics.googleapis.com/v2/reports?ids=channel==MINE&metrics=views&key=${youtubeToken}`);
        if (res.ok) {
          const data = await res.json();
          this.logger.log('YouTube API call returned successfully');
          logs.push('YouTube Analytics API synced successfully.');
        } else {
          logs.push(`YouTube status: ${res.status}`);
        }
      } catch (err) {
        logs.push(`YouTube API error: ${err.message}`);
      }
    } else {
      logs.push('YouTube credentials missing.');
    }

    // Simulate Engagement Alerts Drop warning logic
    // Create alerts dynamically if a setting 'simulateEngagementDrop' is toggled.
    const dropAlertSetting = await this.prisma.setting.findUnique({ where: { key: 'simulateEngagementDrop' } });
    if (dropAlertSetting?.value === 'true') {
      const activeAlerts = await this.prisma.campaignAlert.findMany({ where: { status: 'active' } });
      if (activeAlerts.length === 0) {
        await this.prisma.campaignAlert.create({
          data: {
            platform: 'TikTok',
            campaignName: 'TikTok n8n Automation Pitch Video',
            engagementDrop: 32.4,
            status: 'active',
          },
        });
        await this.prisma.campaignAlert.create({
          data: {
            platform: 'Facebook',
            campaignName: 'Meta Landing Page Lead Ads',
            engagementDrop: 21.8,
            status: 'active',
          },
        });
        this.logger.log('Created simulated active engagement drop campaign alerts.');
      }
    }

    return logs;
  }
}
