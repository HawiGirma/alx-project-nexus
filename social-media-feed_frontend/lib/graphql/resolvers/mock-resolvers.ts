import { PubSub } from "graphql-subscriptions";
import {
  mockUsers,
  mockPosts,
  mockComments,
  mockTrendingTopics,
  getMockUser,
  getMockUserByUsername,
  getMockPosts,
  getMockPost,
  getMockComments,
  getMockUserPosts,
  searchMockUsers,
  searchMockPosts,
} from "@/lib/mock-data";

// Create a PubSub instance for subscriptions
export const pubsub = new PubSub();

// Helper function to get current user
function getCurrentUserId(): string {
  return "current-user";
}

// Helper function to check if user liked a post (mock implementation)
function isPostLikedByUser(postId: string, userId: string): boolean {
  const post = mockPosts.find((p) => p.id === postId);
  return post ? post.isLiked : false;
}

// Helper function to check if user bookmarked a post (mock implementation)
function isPostBookmarkedByUser(postId: string, userId: string): boolean {
  const post = mockPosts.find((p) => p.id === postId);
  return post ? post.isBookmarked : false;
}

// Helper function to check if user liked a comment (mock implementation)
function isCommentLikedByUser(commentId: string, userId: string): boolean {
  const comment = mockComments.find((c) => c.id === commentId);
  return comment ? comment.isLiked : false;
}

export const mockResolvers = {
  Query: {
    posts: async (
      _: any,
      { first = 10, after }: { first?: number; after?: string }
    ) => {
      const posts = getMockPosts(first, after);
      const currentUserId = getCurrentUserId();

      // Add author information to each post
      const postsWithAuthors = posts.map((post) => {
        const author = getMockUser(post.authorId);
        return {
          ...post,
          author,
          isLiked: isPostLikedByUser(post.id, currentUserId),
          isBookmarked: isPostBookmarkedByUser(post.id, currentUserId),
        };
      });

      const edges = postsWithAuthors.map((post) => ({
        node: post,
        cursor: post.id,
      }));

      const hasNextPage = posts.length === first;
      const endCursor = posts[posts.length - 1]?.id;

      return {
        edges,
        pageInfo: {
          hasNextPage,
          hasPreviousPage: !!after,
          startCursor: posts[0]?.id,
          endCursor,
        },
      };
    },

    post: async (_: any, { id }: { id: string }) => {
      const post = getMockPost(id);
      if (!post) return null;

      const currentUserId = getCurrentUserId();
      const author = getMockUser(post.authorId);

      return {
        ...post,
        author,
        isLiked: isPostLikedByUser(post.id, currentUserId),
        isBookmarked: isPostBookmarkedByUser(post.id, currentUserId),
      };
    },

    comments: async (
      _: any,
      { postId, first = 20 }: { postId: string; first?: number }
    ) => {
      const comments = getMockComments(postId, first);
      const currentUserId = getCurrentUserId();

      const commentsWithAuthors = comments.map((comment) => {
        const author = getMockUser(comment.authorId);
        return {
          ...comment,
          author,
          isLiked: isCommentLikedByUser(comment.id, currentUserId),
        };
      });

      return commentsWithAuthors;
    },

    user: async (_: any, { id }: { id: string }) => {
      return getMockUser(id);
    },

    userByUsername: async (_: any, { username }: { username: string }) => {
      return getMockUserByUsername(username);
    },

    searchUsers: async (
      _: any,
      { query, first = 10 }: { query: string; first?: number }
    ) => {
      return searchMockUsers(query, first);
    },

    searchPosts: async (
      _: any,
      { query, first = 10 }: { query: string; first?: number }
    ) => {
      const posts = searchMockPosts(query, first);
      const currentUserId = getCurrentUserId();

      const postsWithAuthors = posts.map((post) => {
        const author = getMockUser(post.authorId);
        return {
          ...post,
          author,
          isLiked: isPostLikedByUser(post.id, currentUserId),
          isBookmarked: isPostBookmarkedByUser(post.id, currentUserId),
        };
      });

      return postsWithAuthors;
    },

    userPosts: async (
      _: any,
      {
        userId,
        first = 10,
        after,
      }: { userId: string; first?: number; after?: string }
    ) => {
      const posts = getMockUserPosts(userId, first, after);
      const currentUserId = getCurrentUserId();

      const postsWithAuthors = posts.map((post) => {
        const author = getMockUser(post.authorId);
        return {
          ...post,
          author,
          isLiked: isPostLikedByUser(post.id, currentUserId),
          isBookmarked: isPostBookmarkedByUser(post.id, currentUserId),
        };
      });

      const edges = postsWithAuthors.map((post) => ({
        node: post,
        cursor: post.id,
      }));

      const hasNextPage = posts.length === first;
      const endCursor = posts[posts.length - 1]?.id;

      return {
        edges,
        pageInfo: {
          hasNextPage,
          hasPreviousPage: !!after,
          startCursor: posts[0]?.id,
          endCursor,
        },
      };
    },

    me: async () => {
      return getMockUser(getCurrentUserId());
    },

    trendingTopics: async (_: any, { first = 5 }: { first?: number }) => {
      return mockTrendingTopics.slice(0, first);
    },

    suggestedUsers: async (_: any, { first = 4 }: { first?: number }) => {
      // Return users that are not the current user
      return mockUsers
        .filter((user) => user.id !== getCurrentUserId())
        .slice(0, first);
    },
  },

  Mutation: {
    likePost: async (_: any, { postId }: { postId: string }) => {
      const post = getMockPost(postId);
      if (!post) throw new Error("Post not found");

      const currentUserId = getCurrentUserId();
      const author = getMockUser(post.authorId);

      // Toggle like status
      const updatedPost = {
        ...post,
        author,
        likes: post.isLiked ? post.likes - 1 : post.likes + 1,
        isLiked: !post.isLiked,
      };

      return updatedPost;
    },

    unlikePost: async (_: any, { postId }: { postId: string }) => {
      const post = getMockPost(postId);
      if (!post) throw new Error("Post not found");

      const currentUserId = getCurrentUserId();
      const author = getMockUser(post.authorId);

      return {
        ...post,
        author,
        likes: Math.max(0, post.likes - 1),
        isLiked: false,
      };
    },

    createPost: async (
      _: any,
      {
        content,
        mediaUrl,
        mediaType,
      }: { content: string; mediaUrl?: string; mediaType?: string }
    ) => {
      const currentUserId = getCurrentUserId();
      const author = getMockUser(currentUserId);

      const newPost = {
        id: `post-${Date.now()}`,
        content,
        authorId: currentUserId,
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: 0,
        shares: 0,
        isLiked: false,
        isBookmarked: false,
        media: mediaUrl
          ? {
              type: mediaType || "IMAGE",
              url: mediaUrl,
              thumbnail: mediaUrl,
            }
          : null,
        author,
      };

      // Publish subscription
      pubsub.publish("POST_ADDED", { postAdded: newPost });

      return newPost;
    },

    sharePost: async (_: any, { postId }: { postId: string }) => {
      const post = getMockPost(postId);
      if (!post) throw new Error("Post not found");

      const currentUserId = getCurrentUserId();
      const author = getMockUser(post.authorId);

      return {
        ...post,
        author,
        shares: post.shares + 1,
      };
    },

    createComment: async (
      _: any,
      { postId, content }: { postId: string; content: string }
    ) => {
      const currentUserId = getCurrentUserId();
      const author = getMockUser(currentUserId);

      const newComment = {
        id: `comment-${Date.now()}`,
        content,
        authorId: currentUserId,
        postId,
        createdAt: new Date().toISOString(),
        likes: 0,
        isLiked: false,
        author,
      };

      // Publish subscription
      pubsub.publish("COMMENT_ADDED", { commentAdded: newComment });

      return newComment;
    },

    likeComment: async (_: any, { commentId }: { commentId: string }) => {
      const comment = mockComments.find((c) => c.id === commentId);
      if (!comment) throw new Error("Comment not found");

      const author = getMockUser(comment.authorId);

      return {
        ...comment,
        author,
        likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
        isLiked: !comment.isLiked,
      };
    },

    unlikeComment: async (_: any, { commentId }: { commentId: string }) => {
      const comment = mockComments.find((c) => c.id === commentId);
      if (!comment) throw new Error("Comment not found");

      const author = getMockUser(comment.authorId);

      return {
        ...comment,
        author,
        likes: Math.max(0, comment.likes - 1),
        isLiked: false,
      };
    },

    deletePost: async (_: any, { postId }: { postId: string }) => {
      const post = getMockPost(postId);
      if (!post) throw new Error("Post not found");

      const currentUserId = getCurrentUserId();
      if (post.authorId !== currentUserId) throw new Error("Unauthorized");

      return true;
    },

    deleteComment: async (_: any, { commentId }: { commentId: string }) => {
      const comment = mockComments.find((c) => c.id === commentId);
      if (!comment) throw new Error("Comment not found");

      const currentUserId = getCurrentUserId();
      if (comment.authorId !== currentUserId) throw new Error("Unauthorized");

      return true;
    },

    followUser: async (_: any, { userId }: { userId: string }) => {
      const currentUserId = getCurrentUserId();
      if (userId === currentUserId) {
        throw new Error("Cannot follow yourself");
      }

      return getMockUser(userId);
    },

    unfollowUser: async (_: any, { userId }: { userId: string }) => {
      return getMockUser(userId);
    },

    bookmarkPost: async (_: any, { postId }: { postId: string }) => {
      const post = getMockPost(postId);
      if (!post) throw new Error("Post not found");

      const currentUserId = getCurrentUserId();
      const author = getMockUser(post.authorId);

      return {
        ...post,
        author,
        isBookmarked: true,
      };
    },

    unbookmarkPost: async (_: any, { postId }: { postId: string }) => {
      const post = getMockPost(postId);
      if (!post) throw new Error("Post not found");

      const currentUserId = getCurrentUserId();
      const author = getMockUser(post.authorId);

      return {
        ...post,
        author,
        isBookmarked: false,
      };
    },

    updateProfile: async (
      _: any,
      {
        name,
        bio,
        avatar,
        location,
        website,
      }: {
        name?: string;
        bio?: string;
        avatar?: string;
        location?: string;
        website?: string;
      }
    ) => {
      const currentUserId = getCurrentUserId();
      const user = getMockUser(currentUserId);

      return {
        ...user,
        name: name || user.name,
        bio: bio || user.bio,
        avatar: avatar || user.avatar,
        location: location || user.location,
        website: website || user.website,
      };
    },
  },

  Subscription: {
    postAdded: {
      subscribe: () => (pubsub as any).asyncIterator("POST_ADDED"),
    },
    commentAdded: {
      subscribe: () => (pubsub as any).asyncIterator("COMMENT_ADDED"),
    },
    postLiked: {
      subscribe: (_: any, { postId }: { postId: string }) =>
        (pubsub as any).asyncIterator(`POST_LIKED_${postId}`),
    },
  },
};


