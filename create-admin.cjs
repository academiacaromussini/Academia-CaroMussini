const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const adapter = new PrismaPg({ connectionString: 'postgresql://postgres.xhdikcbmruyvgyeobpfw:CaroMussini@aws-1-us-east-2.pooler.supabase.com:5432/postgres' });
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashed = await bcrypt.hash('admin123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'admin@academia.com' },
    update: { password: hashed, role: 'ADMIN' },
    create: { name: 'Admin', email: 'admin@academia.com', password: hashed, role: 'ADMIN' }
  });
  console.log('Listo:', user.email, user.role);
  await prisma.$disconnect();
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); });
