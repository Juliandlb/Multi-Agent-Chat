// Import the PrismaClient constructor from the Prisma package
import { PrismaClient } from '@prisma/client';

// Create a global variable to store the Prisma client instance
// This prevents creating multiple instances in development (hot reload)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Export a single Prisma client instance
// Use the existing instance if it exists, otherwise create a new one
export const prisma =
  globalForPrisma.prisma ?? new PrismaClient();

// In development, store the Prisma client instance on the global object
// This avoids exhausting database connections due to hot reloading
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;