import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

async function createAdmin() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: { password: hashedPassword },
    create: {
      email: 'admin@example.com',
      name: 'Admin',
      password: hashedPassword,
    },
  });
  console.log('Admin updated/created', user.email);
}

createAdmin();
