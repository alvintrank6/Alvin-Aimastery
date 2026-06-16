import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

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
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding demo accounts...');

  const users = [
    {
      email: 'admin@agency.com',
      password: 'admin123',
      name: 'Super Admin',
      role: 'admin',
    },
    {
      email: 'manager@agency.com',
      password: 'manager123',
      name: 'Manager',
      role: 'manager',
    },
    {
      email: 'minhdev@gmail.com',
      password: 'free123',
      name: 'Developer',
      role: 'freelancer',
    },
    {
      email: 'vana@techcorp.vn',
      password: 'client123',
      name: 'Client (TechCorp)',
      role: 'client',
    },
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const result = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        password: hashedPassword,
        name: user.name,
        role: user.role,
      },
      create: {
        email: user.email,
        password: hashedPassword,
        name: user.name,
        role: user.role,
      },
    });
    console.log(`Upserted user: ${result.email} with role ${result.role}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
