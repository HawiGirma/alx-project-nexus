"use client";

import { useQuery, useMutation, useSubscription } from "@apollo/client/react";
import { useState, useCallback } from "react";
import { GET_POSTS } from "@/lib/graphql/queries/posts";
import {
  LIKE_POST,
  UNLIKE_POST,
  CREATE_POST,
  SHARE_POST,
} from "@/lib/graphql/mutations/posts";
import { POST_ADDED } from "@/lib/graphql/subscriptions/posts";
import type { Post } from "@/lib/graphql";

interface UsePostsGraphQLReturn {
  posts: Post[];
  newPosts: Post[];
  loading: boolean;
  error: string | null;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  loadMorePosts: () => void;
  updatePost: (updatedPost: Post) => void;
  addPost: (newPost: Post) => void;
  addNewPost: (newPost: Post) => void;
  loadNewPosts: () => void;
  likePost: (postId: string) => Promise<void>;
  sharePost: (postId: string) => Promise<void>;
  createPost: (
    content: string,
    mediaUrl?: string,
    mediaType?: "IMAGE" | "VIDEO"
  ) => Promise<void>;
}

export function usePostsGraphQL(): UsePostsGraphQLReturn {
  const [newPosts, setNewPosts] = useState<Post[]>([]);

  // Query for posts with pagination
  const { data, loading, error, fetchMore, refetch } = useQuery(GET_POSTS, {
    variables: { first: 10 },
    errorPolicy: "all",
    notifyOnNetworkStatusChange: true,
  });

  // Mutations
  const [likePostMutation] = useMutation(LIKE_POST, {
    optimisticResponse: (vars) => ({
      likePost: {
        id: vars.postId,
        likes: 0, // Will be updated by the real response
        isLiked: true,
        __typename: "Post",
      },
    }),
    update: (cache, { data: mutationData }) => {
      if (mutationData?.likePost) {
        cache.modify({
          id: cache.identify(mutationData.likePost),
          fields: {
            likes: () => mutationData.likePost.likes,
            isLiked: () => mutationData.likePost.isLiked,
          },
        });
      }
    },
  });

  const [unlikePostMutation] = useMutation(UNLIKE_POST, {
    optimisticResponse: (vars) => ({
      unlikePost: {
        id: vars.postId,
        likes: 0, // Will be updated by the real response
        isLiked: false,
        __typename: "Post",
      },
    }),
    update: (cache, { data: mutationData }) => {
      if (mutationData?.unlikePost) {
        cache.modify({
          id: cache.identify(mutationData.unlikePost),
          fields: {
            likes: () => mutationData.unlikePost.likes,
            isLiked: () => mutationData.unlikePost.isLiked,
          },
        });
      }
    },
  });

  const [sharePostMutation] = useMutation(SHARE_POST, {
    update: (cache, { data: mutationData }) => {
      if (mutationData?.sharePost) {
        cache.modify({
          id: cache.identify(mutationData.sharePost),
          fields: {
            shares: () => mutationData.sharePost.shares,
          },
        });
      }
    },
  });

  const [createPostMutation] = useMutation(CREATE_POST, {
    update: (cache, { data: mutationData }) => {
      if (mutationData?.createPost) {
        const existingPosts = cache.readQuery({
          query: GET_POSTS,
          variables: { first: 10 },
        });
        if (existingPosts) {
          cache.writeQuery({
            query: GET_POSTS,
            variables: { first: 10 },
            data: {
              posts: {
                ...existingPosts.posts,
                edges: [
                  {
                    node: mutationData.createPost,
                    cursor: mutationData.createPost.id,
                  },
                  ...existingPosts.posts.edges,
                ],
              },
            },
          });
        }
      }
    },
  });

  // Note: Subscriptions disabled for now - using polling instead
  // const { data: newPostData } = useSubscription(POST_ADDED, {
  //   onData: ({ data: subscriptionData }) => {
  //     if (subscriptionData.data?.postAdded) {
  //       setNewPosts((prev) => [subscriptionData.data.postAdded, ...prev])
  //     }
  //   },
  // })

  const posts = data?.posts?.edges?.map((edge) => edge.node) || [];
  const hasNextPage = data?.posts?.pageInfo?.hasNextPage || false;
  const endCursor = data?.posts?.pageInfo?.endCursor;

  const loadMorePosts = useCallback(() => {
    if (hasNextPage && endCursor) {
      fetchMore({
        variables: {
          first: 5,
          after: endCursor,
        },
      });
    }
  }, [hasNextPage, endCursor, fetchMore]);

  const updatePost = useCallback((updatedPost: Post) => {
    // Apollo cache will handle this automatically with proper cache updates
    console.log("Post updated:", updatedPost.id);
  }, []);

  const addPost = useCallback((newPost: Post) => {
    // This will be handled by the createPost mutation
    console.log("Post added:", newPost.id);
  }, []);

  const addNewPost = useCallback((newPost: Post) => {
    setNewPosts((prev) => [newPost, ...prev]);
  }, []);

  const loadNewPosts = useCallback(() => {
    // Refetch to get the latest posts including the new ones
    refetch();
    setNewPosts([]);
  }, [refetch]);

  const likePost = useCallback(
    async (postId: string) => {
      try {
        // Check current like status from cache
        const currentPost = posts.find((p) => p.id === postId);
        if (currentPost?.isLiked) {
          await unlikePostMutation({ variables: { postId } });
        } else {
          await likePostMutation({ variables: { postId } });
        }
      } catch (err) {
        console.error("Failed to like/unlike post:", err);
      }
    },
    [posts, likePostMutation, unlikePostMutation]
  );

  const sharePost = useCallback(
    async (postId: string) => {
      try {
        await sharePostMutation({ variables: { postId } });
      } catch (err) {
        console.error("Failed to share post:", err);
      }
    },
    [sharePostMutation]
  );

  const createPost = useCallback(
    async (
      content: string,
      mediaUrl?: string,
      mediaType?: "IMAGE" | "VIDEO"
    ) => {
      try {
        await createPostMutation({
          variables: {
            content,
            mediaUrl,
            mediaType,
          },
        });
      } catch (err) {
        console.error("Failed to create post:", err);
      }
    },
    [createPostMutation]
  );

  return {
    posts,
    newPosts,
    loading,
    error: error?.message || null,
    hasNextPage,
    isFetchingNextPage: loading,
    loadMorePosts,
    updatePost,
    addPost,
    addNewPost,
    loadNewPosts,
    likePost,
    sharePost,
    createPost,
  };
}
