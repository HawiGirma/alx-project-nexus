import { createYoga } from "graphql-yoga";
import { createSchema } from "graphql-yoga";
import { readFileSync } from "fs";
import { join } from "path";
import { resolvers } from "@/lib/graphql/resolvers";
import { checkDatabaseConnection } from "@/lib/database";

// Set environment variable for database if not already set (only for local development)
if (!process.env.DATABASE_URL && process.env.NODE_ENV !== "production") {
  process.env.DATABASE_URL = "file:./dev.db";
}

// Read the GraphQL schema
const typeDefs = readFileSync(
  join(process.cwd(), "lib/graphql/schema.graphql"),
  "utf8"
);

// Create the schema
const schema = createSchema({
  typeDefs,
  resolvers,
});

// Create the GraphQL Yoga server
const yoga = createYoga({
  schema,
  graphqlEndpoint: "/api/graphql",
  context: async ({ request }) => {
    // Check database connection health
    const dbHealthy = await checkDatabaseConnection();

    return {
      request,
      dbHealthy,
    };
  },
  plugins: [
    {
      onRequest: async ({ request }) => {
        // Log requests in development
        if (process.env.NODE_ENV === "development") {
          console.log(`GraphQL request: ${request.method} ${request.url}`);
        }
      },
    },
    {
      onRequestParse: async ({ request, requestParser }) => {
        // Add request timing for production monitoring
        const startTime = Date.now();
        return {
          onRequestParseDone: () => {
            const duration = Date.now() - startTime;
            if (process.env.NODE_ENV === "production" && duration > 5000) {
              console.warn(`Slow GraphQL request: ${duration}ms`);
            }
          },
        };
      },
    },
  ],
});

export { yoga as GET, yoga as POST };
