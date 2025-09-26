"use client";

import type React from "react";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { ApolloProvider as BaseApolloProvider } from "@apollo/client/react";

// HTTP link for queries and mutations
const httpLink = createHttpLink({
  uri: "/api/graphql",
});

// Enhanced Apollo Client configuration
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          posts: {
            keyArgs: false,
            merge(existing, incoming) {
              if (!existing) return incoming;
              if (!incoming) return existing;

              return {
                ...incoming,
                edges: [...existing.edges, ...incoming.edges],
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
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all",
      notifyOnNetworkStatusChange: true,
    },
    query: {
      errorPolicy: "all",
    },
    mutate: {
      errorPolicy: "all",
    },
  },
});

export function ApolloProvider({ children }: { children: React.ReactNode }) {
  return <BaseApolloProvider client={client}>{children}</BaseApolloProvider>;
}

export { client };
