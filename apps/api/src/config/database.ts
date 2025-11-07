import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export const disconnectDatabase = async (): Promise<void> => {
  await prisma.$disconnect();
};

export const connectDatabase = async (): Promise<void> => {
  await prisma.$connect();
};

export default prisma;
