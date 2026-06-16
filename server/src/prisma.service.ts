import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';


import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    let connectionString = process.env.DATABASE_URL;
    if (connectionString?.startsWith('prisma+postgres://')) {
      const url = new URL(connectionString);
      const apiKey = url.searchParams.get('api_key');
      if (apiKey) {
        const decoded = Buffer.from(apiKey, 'base64').toString('utf8');
        connectionString = JSON.parse(decoded).databaseUrl;
      }
    }
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
