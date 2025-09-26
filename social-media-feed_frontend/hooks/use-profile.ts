import { useQuery, useMutation } from "@apollo/client/react";
import {
  GET_USER_BY_USERNAME,
  GET_USER_POSTS,
} from "@/lib/graphql/queries/posts";
import { UPDATE_PROFILE } from "@/lib/graphql/mutations/posts";

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  location?: string;
  website?: string;
  followers: number;
  following: number;
  posts: number;
  createdAt: string;
}

export interface UserPost {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  createdAt: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
  media?: {
    type: string;
    url: string;
    thumbnail?: string;
  };
}

export function useProfile(username?: string) {
  const { data, loading, error, refetch } = useQuery<{
    userByUsername: UserProfile;
  }>(GET_USER_BY_USERNAME, {
    variables: { username: username || "you" },
    skip: !username,
    errorPolicy: "all",
  });

  const { data: postsData, loading: postsLoading } = useQuery<{
    userPosts: {
      edges: Array<{
        node: UserPost;
        cursor: string;
      }>;
      pageInfo: {
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        startCursor?: string;
        endCursor?: string;
      };
    };
  }>(GET_USER_POSTS, {
    variables: { userId: data?.userByUsername?.id, first: 10 },
    skip: !data?.userByUsername?.id,
    errorPolicy: "all",
  });

  return {
    profile: data?.userByUsername || null,
    posts: postsData?.userPosts?.edges?.map((edge) => edge.node) || [],
    hasNextPage: postsData?.userPosts?.pageInfo?.hasNextPage || false,
    loading: loading || postsLoading,
    error,
    refetch,
  };
}

export function useUpdateProfile() {
  const [updateProfile, { loading, error }] = useMutation(UPDATE_PROFILE, {
    errorPolicy: "all",
  });

  const handleUpdateProfile = async (updates: {
    name?: string;
    bio?: string;
    avatar?: string;
    location?: string;
    website?: string;
  }) => {
    try {
      const result = await updateProfile({
        variables: updates,
      });
      return result.data?.updateProfile;
    } catch (err) {
      console.error("Error updating profile:", err);
      throw err;
    }
  };

  return {
    updateProfile: handleUpdateProfile,
    loading,
    error,
  };
}
