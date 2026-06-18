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
      name: 'Minh Dev',
      role: 'developer',
    },
    {
      email: 'anhtuan.dev@gmail.com',
      password: 'free123',
      name: 'Anh Tuấn',
      role: 'developer',
    },
    {
      email: 'baoanh.react@gmail.com',
      password: 'free123',
      name: 'Bảo Anh',
      role: 'developer',
    },
    {
      email: 'khanh.n8n@gmail.com',
      password: 'free123',
      name: 'Khánh Nguyễn',
      role: 'developer',
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

  // Seed developer profiles
  const developersToSeed = [
    {
      email: 'minhdev@gmail.com',
      name: 'Minh Dev',
      skills: ['React', 'Node.js', 'n8n', 'Web'],
      rateType: 'hourly',
      rateValue: 20,
      status: 'Approved',
      title: 'Developer',
    },
    {
      email: 'anhtuan.dev@gmail.com',
      name: 'Anh Tuấn',
      skills: ['Node.js', 'Express', 'PostgreSQL', 'Docker'],
      rateType: 'hourly',
      rateValue: 25,
      status: 'Approved',
      title: 'Backend Developer',
    },
    {
      email: 'baoanh.react@gmail.com',
      name: 'Bảo Anh',
      skills: ['React', 'Next.js', 'TailwindCSS', 'Redux'],
      rateType: 'hourly',
      rateValue: 22,
      status: 'Approved',
      title: 'Frontend Developer',
    },
    {
      email: 'khanh.n8n@gmail.com',
      name: 'Khánh Nguyễn',
      skills: ['n8n', 'Make.com', 'Zapier', 'Python'],
      rateType: 'hourly',
      rateValue: 30,
      status: 'Approved',
      title: 'AI Automation Specialist',
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
