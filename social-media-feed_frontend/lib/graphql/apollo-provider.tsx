"use client";

import type React from "react";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider as BaseApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { from } from "@apollo/client";

// HTTP Link for GraphQL endpoint
const httpLink = createHttpLink({
  uri: "/api/graphql",
});

// Auth link to add authorization headers
const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth-token") : null;

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Error link for handling GraphQL and network errors
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

// Apollo Client configuration
const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          posts: {
            keyArgs: [],
            merge(existing = { edges: [], pageInfo: {} }, incoming) {
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
          isLiked: {
            merge: (existing, incoming) => incoming,
          },
          likes: {
            merge: (existing, incoming) => incoming,
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all",
    },
    query: {
      errorPolicy: "all",
    },
  },
});

export function ApolloProvider({ children }: { children: React.ReactNode }) {
  return <BaseApolloProvider client={client}>{children}</BaseApolloProvider>;
}

export { client as apolloClient };
