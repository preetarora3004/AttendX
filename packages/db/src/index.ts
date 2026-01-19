import { PrismaClient } from '../generated/prisma/client'
import {PrismaPg} from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const client =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter: new PrismaPg({connectionString : Bun.env.DATABASE_URL}),
  });

if (Bun.env.NODE_ENV !== "production") globalForPrisma.prisma = client;