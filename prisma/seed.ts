import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Ensuring primary user in StudyFlow...');

  // Primary user
  const passwordHash = await bcrypt.hash('password123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'intan.zahra@uny.ac.id' },
    update: {
      name: 'Intan Zahra',
      passwordHash,
      role: 'Student',
      university: 'UNY',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    create: {
      email: 'intan.zahra@uny.ac.id',
      name: 'Intan Zahra',
      passwordHash,
      role: 'Student',
      university: 'UNY',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
  });

  console.log(`👤 User ready: ${user.name} (${user.email}) - zero dummy data.`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
