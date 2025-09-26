"use client";

import { useQuery, useMutation, useSubscription } from "@apollo/client/react";
import { useState, useCallback } from "react";
import { GET_COMMENTS } from "@/lib/graphql/queries/posts";
import { CREATE_COMMENT } from "@/lib/graphql/mutations/posts";
import { COMMENT_ADDED } from "@/lib/graphql/subscriptions/posts";
import type { Comment } from "@/lib/graphql";

interface UseCommentsGraphQLReturn {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  addComment: (postId: string, content: string) => Promise<void>;
  loadComments: (postId: string) => void;
}

export function useCommentsGraphQL(postId?: string): UseCommentsGraphQLReturn {
  const [comments, setComments] = useState<Comment[]>([]);

  // Query for comments
  const { data, loading, error, refetch } = useQuery(GET_COMMENTS, {
    variables: { postId: postId || "", first: 20 },
    skip: !postId,
    errorPolicy: "all",
  });

  // Mutation for creating comments
  const [createCommentMutation] = useMutation(CREATE_COMMENT, {
    update: (cache, { data: mutationData }) => {
      if (mutationData?.createComment && postId) {
        const existingComments = cache.readQuery({
          query: GET_COMMENTS,
          variables: { postId, first: 20 },
        });

        if (existingComments) {
          cache.writeQuery({
            query: GET_COMMENTS,
            variables: { postId, first: 20 },
            data: {
              comments: [
                mutationData.createComment,
                ...existingComments.comments,
              ],
            },
          });
        }

        // Update post comment count
        cache.modify({
          id: `Post:${postId}`,
          fields: {
            comments: (existing) => existing + 1,
          },
        });
      }
    },
  });

  // Note: Subscriptions disabled for now - using polling instead
  // const { data: newCommentData } = useSubscription(COMMENT_ADDED, {
  //   variables: { postId: postId || "" },
  //   skip: !postId,
  //   onData: ({ data: subscriptionData }) => {
  //     if (subscriptionData.data?.commentAdded) {
  //       setComments((prev) => [subscriptionData.data.commentAdded, ...prev])
  //     }
  //   },
  // })

  const loadComments = useCallback(
    (newPostId: string) => {
      if (newPostId) {
        refetch({ postId: newPostId, first: 20 });
      }
    },
    [refetch]
  );

  const addComment = useCallback(
    async (postId: string, content: string) => {
      try {
        await createCommentMutation({
          variables: { postId, content },
        });
      } catch (err) {
        console.error("Failed to add comment:", err);
      }
    },
    [createCommentMutation]
  );

  return {
    comments: data?.comments || comments,
    loading,
    error: error?.message || null,
    addComment,
    loadComments,
  };
}
