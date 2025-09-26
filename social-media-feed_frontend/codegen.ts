import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./lib/graphql/schema.graphql",
  documents: [
    "lib/graphql/queries/**/*.ts",
    "lib/graphql/mutations/**/*.ts",
    "lib/graphql/subscriptions/**/*.ts",
  ],
  generates: {
    "./lib/graphql/generated/": {
      preset: "client",
      plugins: [],
      presetConfig: {
        gqlTagName: "gql",
      },
    },
    "./lib/graphql/generated/types.ts": {
      plugins: ["typescript"],
    },
    "./lib/graphql/generated/operations.ts": {
      plugins: ["typescript-operations", "typescript-react-apollo"],
      config: {
        withHooks: true,
        withComponent: false,
        withHOC: false,
      },
    },
    "./lib/graphql/generated/introspection.json": {
      plugins: ["introspection"],
    },
  },
  ignoreNoDocuments: true,
};

export default config;
