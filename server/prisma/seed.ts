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
      email: 'dev1@gmail.com',
      phone: '0905555555',
      password: 'dev123',
      name: 'Minh Dev',
      role: 'developer',
    },
    {
      email: 'dev2@gmail.com',
      phone: '0906666666',
      password: 'dev123',
      name: 'Anh Tuấn',
      role: 'developer',
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

  // Seed developer profiles
  const developersToSeed = [
    {
      email: 'dev1@gmail.com',
      name: 'Minh Dev',
      skills: ['React', 'Node.js', 'n8n', 'Web'],
      rateType: 'hourly',
      rateValue: 20,
      status: 'Approved',
      title: 'Developer',
    },
    {
      email: 'dev2@gmail.com',
      name: 'Anh Tuấn',
      skills: ['Node.js', 'Express', 'PostgreSQL', 'Docker'],
      rateType: 'hourly',
      rateValue: 25,
      status: 'Approved',
      title: 'Backend Developer',
    },
  ];

  for (const devData of developersToSeed) {
    const devUser = await prisma.user.findUnique({
      where: { email: devData.email }
    });
    if (devUser) {
      await prisma.developer.upsert({
        where: { email: devData.email },
        update: {
          name: devData.name,
          skills: devData.skills,
          rateType: devData.rateType,
          rateValue: devData.rateValue,
          status: devData.status,
          title: devData.title,
        },
        create: {
          id: devUser.id, // Match the user id!
          email: devData.email,
          name: devData.name,
          skills: devData.skills,
          rateType: devData.rateType,
          rateValue: devData.rateValue,
          status: devData.status,
          title: devData.title,
        }
      });
      console.log(`Upserted developer profile for ${devData.email}`);
    }
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
