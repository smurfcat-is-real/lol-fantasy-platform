import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the global object in development to prevent
// exhausting your database connection limit due to hot reloading
declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
