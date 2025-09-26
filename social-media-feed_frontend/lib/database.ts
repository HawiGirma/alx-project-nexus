// Database implementation using Prisma
import { PrismaClient } from "@prisma/client";

// Check if we're in a serverless environment (like Vercel)
const isServerless =
  process.env.VERCEL === "1" || process.env.NODE_ENV === "production";

// Create a single instance of PrismaClient
let prisma: PrismaClient;

if (isServerless) {
  // In serverless environments, we'll use mock data instead of Prisma
  prisma = null as any;
} else {
  try {
    prisma = new PrismaClient();
  } catch (error) {
    console.warn(
      "Failed to initialize Prisma client, falling back to mock data:",
      error
    );
    prisma = null as any;
  }
}

// Export the prisma instance
export { prisma };
