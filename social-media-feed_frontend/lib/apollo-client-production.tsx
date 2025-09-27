"use client";

import type React from "react";
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
  ApolloLink,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { ApolloProvider as BaseApolloProvider } from "@apollo/client/react";

// Error handling link
const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => {
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        );
      });
    }

    if (networkError) {
      console.error(`[Network error]: ${networkError}`);

      // Handle specific network errors
      if ("statusCode" in networkError) {
        switch (networkError.statusCode) {
          case 401:
            console.error("Unauthorized - check authentication");
            break;
          case 403:
            console.error("Forbidden - insufficient permissions");
            break;
          case 500:
            console.error("Server error - please try again later");
            break;
          default:
            console.error(`Network error: ${networkError.statusCode}`);
        }
      }
    }
  }
);

// HTTP link for queries and mutations
const httpLink = createHttpLink({
  uri: "/api/graphql",
  credentials: "same-origin",
  // Add timeout for production
  fetchOptions: {
    timeout: 30000, // 30 seconds
  },
});

// Auth link to add headers if needed
const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth-token") : null;

  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  };
});

// Retry link for failed requests
const retryLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((result) => {
    // Handle retry logic here if needed
    return result;
  });
});

// Enhanced cache configuration for production
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        posts: {
          keyArgs: false,
          merge(existing, incoming, { args }) {
            if (!existing) return incoming;
            if (!incoming) return existing;

            // Handle pagination properly
            const existingEdges = existing.edges || [];
            const incomingEdges = incoming.edges || [];

            // Check if this is a fresh fetch (no cursor) or pagination
            if (!args?.after) {
              return incoming; // Fresh fetch, replace existing
            }

            // Pagination, append new edges
            return {
              ...incoming,
              edges: [...existingEdges, ...incomingEdges],
            };
          },
        },
        userPosts: {
          keyArgs: ["userId"],
          merge(existing, incoming, { args }) {
            if (!existing) return incoming;
            if (!incoming) return existing;

            const existingEdges = existing.edges || [];
            const incomingEdges = incoming.edges || [];

            if (!args?.after) {
              return incoming;
            }

            return {
              ...incoming,
              edges: [...existingEdges, ...incomingEdges],
            };
          },
        },
      },
    },
    Post: {
      fields: {
        likes: {
          merge: true,
        },
        comments: {
          merge: true,
        },
        shares: {
          merge: true,
        },
        isLiked: {
          merge: true,
        },
        isBookmarked: {
          merge: true,
        },
      },
    },
    User: {
      fields: {
        followers: {
          merge: true,
        },
        following: {
          merge: true,
        },
        posts: {
          merge: true,
        },
      },
    },
  },
});

// Create the Apollo Client with production optimizations
const client = new ApolloClient({
  link: from([errorLink, retryLink, authLink, httpLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all",
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "cache-and-network",
      // Add polling for real-time updates in production
      pollInterval: 0, // Disabled by default, can be enabled for specific queries
    },
    query: {
      errorPolicy: "all",
      fetchPolicy: "cache-first",
      // Shorter timeout for queries
      context: {
        timeout: 20000, // 20 seconds
      },
    },
    mutate: {
      errorPolicy: "all",
      // Optimistic updates for better UX
      context: {
        timeout: 30000, // 30 seconds for mutations
      },
    },
  },
  // Production-specific settings
  ssrMode: typeof window === "undefined",
  ssrForceFetchDelay: 100,
  connectToDevTools: process.env.NODE_ENV === "development",
});

// Production Apollo Provider with error boundary
export function ApolloProvider({ children }: { children: React.ReactNode }) {
  return <BaseApolloProvider client={client}>{children}</BaseApolloProvider>;
}

// Export client for direct use if needed
export { client };

// Utility functions for production use
export const apolloUtils = {
  // Clear cache for logout
  clearCache: () => {
    client.clearStore();
  },

  // Refetch all active queries
  refetchAll: () => {
    client.refetchQueries({ include: "active" });
  },

  // Get cache size (useful for monitoring)
  getCacheSize: () => {
    return client.cache.extract();
  },
};

