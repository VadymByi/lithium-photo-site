import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL;

  // Создаем пул соединений через стандартный драйвер pg
  const pool = new pg.Pool({ connectionString });

  // Создаем адаптер Prisma для этого пула
  const adapter = new PrismaPg(pool);

  // Передаем адаптер в конструктор клиента
  return new PrismaClient({
    adapter,
    log: ['query', 'error', 'warn'],
  });
};

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
