// Production database configuration
import { PrismaClient } from "@prisma/client";

// Global variable to prevent multiple instances in development
declare global {
  var __prisma: PrismaClient | undefined;
}

// Create a single instance of PrismaClient with production optimizations
function createPrismaClient(): PrismaClient {
  const isProduction = process.env.NODE_ENV === "production";

  return new PrismaClient({
    log: isProduction
      ? ["error"] // Only log errors in production
      : ["query", "error", "warn"], // Full logging in development
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    // Production optimizations
    ...(isProduction && {
      // Connection pooling for production
      __internal: {
        engine: {
          connectTimeout: 60000,
          queryTimeout: 30000,
        },
      },
    }),
  });
}

// Initialize Prisma client based on environment
let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  // In production, create a new instance
  prisma = createPrismaClient();
} else {
  // In development, use global variable to prevent multiple instances
  if (!global.__prisma) {
    global.__prisma = createPrismaClient();
  }
  prisma = global.__prisma;
}

// Database connection health check
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    console.log("✅ Database connected successfully");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return false;
  }
}

// Graceful shutdown
export async function disconnectDatabase(): Promise<void> {
  try {
    await prisma.$disconnect();
    console.log("✅ Database disconnected successfully");
  } catch (error) {
    console.error("❌ Error disconnecting from database:", error);
  }
}

// Export the prisma instance
export { prisma };

