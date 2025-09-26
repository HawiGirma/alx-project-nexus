import { useQuery } from "@apollo/client/react";
import { GET_TRENDING_TOPICS } from "@/lib/graphql/queries/posts";

export interface TrendingTopic {
  id: string;
  hashtag: string;
  posts: number;
  trend: "UP" | "DOWN" | "STABLE";
}

export function useTrendingTopics(first: number = 5) {
  const { data, loading, error, refetch } = useQuery<{
    trendingTopics: TrendingTopic[];
  }>(GET_TRENDING_TOPICS, {
    variables: { first },
    pollInterval: 30000, // Refresh every 30 seconds
    errorPolicy: "all",
  });

  return {
    trendingTopics: data?.trendingTopics || [],
    loading,
    error,
    refetch,
  };
}
