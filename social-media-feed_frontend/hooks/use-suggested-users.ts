import { useQuery } from "@apollo/client/react";
import { GET_SUGGESTED_USERS } from "@/lib/graphql/queries/posts";

export interface SuggestedUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  posts: number;
}

export function useSuggestedUsers(first: number = 4) {
  const { data, loading, error, refetch } = useQuery<{
    suggestedUsers: SuggestedUser[];
  }>(GET_SUGGESTED_USERS, {
    variables: { first },
    errorPolicy: "all",
  });

  return {
    suggestedUsers: data?.suggestedUsers || [],
    loading,
    error,
    refetch,
  };
}
