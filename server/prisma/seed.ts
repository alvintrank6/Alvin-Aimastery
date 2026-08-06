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
let cleanUrl = connectionString;
if (connectionString) {
  try {
    const parsed = new URL(connectionString);
    parsed.searchParams.delete('sslmode');
    cleanUrl = parsed.toString();
  } catch (e) {}
}
const pool = new Pool({ 
  connectionString: cleanUrl,
  ssl: connectionString?.includes('localhost') || connectionString?.includes('127.0.0.1')
    ? false
    : { rejectUnauthorized: false }
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding demo accounts...');

  const users = [
    {
      email: 'admin1@gmail.com',
      phone: '0901111111',
      password: 'admin123',
      name: 'Super Admin',
      role: 'admin',
    },
    {
      email: 'admin2@gmail.com',
      phone: '0902222222',
      password: 'admin123',
      name: 'Co-Admin',
      role: 'admin',
    },
    {
      email: 'manager1@gmail.com',
      phone: '0903333333',
      password: 'manager123',
      name: 'Manager One',
      role: 'manager',
    },
    {
      email: 'manager2@gmail.com',
      phone: '0904444444',
      password: 'manager123',
      name: 'Manager Two',
      role: 'manager',
    },
    {
      email: 'client1@gmail.com',
      phone: '0907777777',
      password: 'client123',
      name: 'Client A',
      role: 'client',
    },
    {
      email: 'client2@gmail.com',
      phone: '0908888888',
      password: 'client123',
      name: 'Client B',
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
        phone: user.phone,
      },
      create: {
        email: user.email,
        phone: user.phone,
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
