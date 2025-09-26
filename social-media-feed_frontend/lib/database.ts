// Database implementation using Prisma
import { PrismaClient } from "@prisma/client";

// Create a single instance of PrismaClient
const prisma = new PrismaClient();

// Export the prisma instance
export { prisma };
