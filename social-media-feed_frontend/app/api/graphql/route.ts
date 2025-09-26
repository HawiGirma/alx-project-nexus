import { createYoga } from "graphql-yoga";
import { createSchema } from "graphql-yoga";
import { readFileSync } from "fs";
import { join } from "path";
import { resolvers } from "@/lib/graphql/resolvers";

// Set environment variable for database if not already set
if (!process.env.DATABASE_URL && process.env.VERCEL !== "1") {
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
    return {
      request,
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
  ],
});

export { yoga as GET, yoga as POST };
