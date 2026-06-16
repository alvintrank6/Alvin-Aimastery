import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getTrafficMetrics(filter: string = 'day') {
    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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

  async getFinanceLogs() {
    return this.prisma.financeLog.findMany();
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
}
