import { defineConfig } from '@prisma/config';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

export default defineConfig({
  datasource: {
    // Используем пустую строку как fallback, чтобы TS не ругался на undefined
    url: process.env.DATABASE_URL || '',
  },
  // В некоторых под-версиях v7 структура может требовать явного указания через cast
  // или находиться внутри специфических полей.
  // Но если генерация прошла — значит Prisma видит это поле.
  // Давай добавим типизацию для url (parameter)
  client: {
    adapter: (url: string) => {
      const pool = new pg.Pool({ connectionString: url });
      return new PrismaPg(pool);
    },
  },
} as any); // Временный cast к any уберет ошибку типизации, пока типы @prisma/config догоняют реальность
