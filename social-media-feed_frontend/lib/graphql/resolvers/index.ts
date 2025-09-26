import { prisma } from "@/lib/database";
import { PubSub } from "graphql-subscriptions";

// Define types locally instead of importing from Prisma
type MediaType = "IMAGE" | "VIDEO" | "GIF";

// Create a PubSub instance for subscriptions
export const pubsub = new PubSub();

// Helper function to check if user liked a post
async function isPostLikedByUser(
  postId: string,
  userId: string
): Promise<boolean> {
  try {
    const like = await prisma.postLike.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });
    return !!like;
  } catch (error) {
    console.error("Error checking like status:", error);
    return false; // Default to false if there's an error
  }
}

// Helper function to get like count for a post
async function getPostLikeCount(postId: string): Promise<number> {
  try {
    const likes = await prisma.postLike.findMany({
      where: { postId },
    });
    return likes.length;
  } catch (error) {
    console.error("Error getting like count:", error);
    return 0;
  }
}

// Helper function to get comment count for a post
async function getPostCommentCount(postId: string): Promise<number> {
  try {
    const comments = await prisma.comment.findMany({
      where: { postId },
    });
    return comments.length;
  } catch (error) {
    console.error("Error getting comment count:", error);
    return 0;
  }
}

// Helper function to check if user liked a comment
async function isCommentLikedByUser(
  commentId: string,
  userId: string
): Promise<boolean> {
  const like = await prisma.commentLike.findUnique({
    where: {
      userId_commentId: {
        userId,
        commentId,
      },
    },
  });
  return !!like;
}

// Helper function to check if user bookmarked a post
async function isPostBookmarkedByUser(
  postId: string,
  userId: string
): Promise<boolean> {
  try {
    const bookmark = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });
    return !!bookmark;
  } catch (error) {
    console.error("Error checking bookmark status:", error);
    return false; // Default to false if there's an error
  }
}

// Helper function to get current user
function getCurrentUserId(): string {
  // For server-side GraphQL resolvers, we'll use a default user ID
  // In a real app, this would come from JWT token or session context
  return "current-user";
}

export const resolvers = {
  Query: {
    posts: async (
      _: any,
      { first = 10, after }: { first?: number; after?: string }
    ) => {
      const posts = await prisma.post.findMany({
        take: first,
        skip: after ? 1 : 0,
        cursor: after ? { id: after } : undefined,
        orderBy: { createdAt: "desc" },
        include: {
          author: true,
          media: true,
          _count: {
            select: {
              likes: true,
              comments: true,
              shares: true,
            },
          },
        },
      });

      const currentUserId = getCurrentUserId();

      // Add isLiked and isBookmarked fields to each post
      const postsWithLikes = await Promise.all(
        posts.map(async (post: any) => ({
          ...post,
          likes: await getPostLikeCount(post.id),
          comments: await getPostCommentCount(post.id),
          shares: post._count.shares,
          isLiked: await isPostLikedByUser(post.id, currentUserId),
          isBookmarked: await isPostBookmarkedByUser(post.id, currentUserId),
        }))
      );

      const edges = postsWithLikes.map((post) => ({
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
      const post = await prisma.post.findUnique({
        where: { id },
        include: {
          author: true,
          media: true,
          _count: {
            select: {
              likes: true,
              comments: true,
              shares: true,
            },
          },
        },
      });

      if (!post) return null;

      const currentUserId = getCurrentUserId();
      const isLiked = await isPostLikedByUser(post.id, currentUserId);
      const isBookmarked = await isPostBookmarkedByUser(post.id, currentUserId);

      return {
        ...post,
        likes: post._count.likes,
        comments: post._count.comments,
        shares: post._count.shares,
        isLiked,
        isBookmarked,
      };
    },

    comments: async (
      _: any,
      { postId, first = 20 }: { postId: string; first?: number }
    ) => {
      const comments = await prisma.comment.findMany({
        where: { postId },
        take: first,
        orderBy: { createdAt: "desc" },
        include: {
          author: true,
          _count: {
            select: {
              likes: true,
            },
          },
        },
      });

      const currentUserId = getCurrentUserId();

      const commentsWithLikes = await Promise.all(
        comments.map(async (comment: any) => ({
          ...comment,
          likes: comment._count.likes,
          isLiked: await isCommentLikedByUser(comment.id, currentUserId),
        }))
      );

      return commentsWithLikes;
    },

    user: async (_: any, { id }: { id: string }) => {
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              authoredPosts: true,
            },
          },
        },
      });

      if (!user) return null;

      return {
        ...user,
        posts: user._count.authoredPosts,
      };
    },

    userByUsername: async (_: any, { username }: { username: string }) => {
      const user = await prisma.user.findUnique({
        where: { username },
        include: {
          _count: {
            select: {
              authoredPosts: true,
            },
          },
        },
      });

      if (!user) return null;

      return {
        ...user,
        posts: user._count.authoredPosts,
      };
    },

    searchUsers: async (
      _: any,
      { query, first = 10 }: { query: string; first?: number }
    ) => {
      const users = await prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { username: { contains: query, mode: "insensitive" } },
          ],
        },
        take: first,
        include: {
          _count: {
            select: {
              authoredPosts: true,
            },
          },
        },
      });

      return users.map((user: any) => ({
        ...user,
        posts: user._count.authoredPosts,
      }));
    },

    searchPosts: async (
      _: any,
      { query, first = 10 }: { query: string; first?: number }
    ) => {
      const posts = await prisma.post.findMany({
        where: {
          content: { contains: query, mode: "insensitive" },
        },
        take: first,
        orderBy: { createdAt: "desc" },
        include: {
          author: true,
          media: true,
          _count: {
            select: {
              likes: true,
              comments: true,
              shares: true,
            },
          },
        },
      });

      const currentUserId = getCurrentUserId();

      const postsWithLikes = await Promise.all(
        posts.map(async (post: any) => ({
          ...post,
          likes: post._count.likes,
          comments: post._count.comments,
          shares: post._count.shares,
          isLiked: await isPostLikedByUser(post.id, currentUserId),
          isBookmarked: await isPostBookmarkedByUser(post.id, currentUserId),
        }))
      );

      return postsWithLikes;
    },

    userPosts: async (
      _: any,
      {
        userId,
        first = 10,
        after,
      }: { userId: string; first?: number; after?: string }
    ) => {
      const posts = await prisma.post.findMany({
        where: { authorId: userId },
        take: first,
        skip: after ? 1 : 0,
        cursor: after ? { id: after } : undefined,
        orderBy: { createdAt: "desc" },
        include: {
          author: true,
          media: true,
          _count: {
            select: {
              likes: true,
              comments: true,
              shares: true,
            },
          },
        },
      });

      const currentUserId = getCurrentUserId();

      const postsWithLikes = await Promise.all(
        posts.map(async (post: any) => ({
          ...post,
          likes: post._count.likes,
          comments: post._count.comments,
          shares: post._count.shares,
          isLiked: await isPostLikedByUser(post.id, currentUserId),
          isBookmarked: await isPostBookmarkedByUser(post.id, currentUserId),
        }))
      );

      const edges = postsWithLikes.map((post) => ({
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
      const currentUserId = getCurrentUserId();
      const user = await prisma.user.findUnique({
        where: { id: currentUserId },
        include: {
          _count: {
            select: {
              authoredPosts: true,
            },
          },
        },
      });

      if (!user) {
        // Create a default user if none exists
        const newUser = await prisma.user.create({
          data: {
            id: currentUserId,
            name: "You",
            username: "you",
            avatar: "/diverse-user-avatars.png",
            bio: "Social media enthusiast",
          },
          include: {
            _count: {
              select: {
                authoredPosts: true,
              },
            },
          },
        });
        return {
          ...newUser,
          posts: newUser._count.authoredPosts,
        };
      }

      return {
        ...user,
        posts: user._count.authoredPosts,
      };
    },

    trendingTopics: async (_: any, { first = 5 }: { first?: number }) => {
      // Extract hashtags from posts and count their usage
      const posts = await prisma.post.findMany({
        select: { content: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 1000, // Get recent posts to analyze
      });

      // Extract hashtags and count them
      const hashtagCounts: { [key: string]: number } = {};
      const hashtagTrends: {
        [key: string]: { recent: number; older: number };
      } = {};

      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      posts.forEach((post: any) => {
        const hashtags = post.content.match(/#\w+/g) || [];
        const isRecent = new Date(post.createdAt) > oneDayAgo;

        hashtags.forEach((hashtag: any) => {
          const cleanHashtag = hashtag.substring(1).toLowerCase();
          hashtagCounts[cleanHashtag] = (hashtagCounts[cleanHashtag] || 0) + 1;

          if (!hashtagTrends[cleanHashtag]) {
            hashtagTrends[cleanHashtag] = { recent: 0, older: 0 };
          }

          if (isRecent) {
            hashtagTrends[cleanHashtag].recent++;
          } else {
            hashtagTrends[cleanHashtag].older++;
          }
        });
      });

      // Convert to trending topics with trend direction
      const trendingTopics = Object.entries(hashtagCounts)
        .map(([hashtag, posts]) => {
          const trend = hashtagTrends[hashtag];
          let trendDirection: "UP" | "DOWN" | "STABLE" = "STABLE";

          if (trend.recent > trend.older) {
            trendDirection = "UP";
          } else if (trend.recent < trend.older) {
            trendDirection = "DOWN";
          }

          return {
            id: hashtag,
            hashtag: hashtag.charAt(0).toUpperCase() + hashtag.slice(1),
            posts,
            trend: trendDirection,
          };
        })
        .sort((a, b) => b.posts - a.posts)
        .slice(0, first);

      // If we don't have enough real hashtags, add some default ones
      if (trendingTopics.length < first) {
        const defaultTopics = [
          {
            id: "webdevelopment",
            hashtag: "WebDevelopment",
            posts: 1234,
            trend: "UP" as const,
          },
          {
            id: "reactjs",
            hashtag: "ReactJS",
            posts: 987,
            trend: "UP" as const,
          },
          {
            id: "typescript",
            hashtag: "TypeScript",
            posts: 756,
            trend: "STABLE" as const,
          },
          { id: "nextjs", hashtag: "NextJS", posts: 543, trend: "UP" as const },
          {
            id: "tailwindcss",
            hashtag: "TailwindCSS",
            posts: 432,
            trend: "STABLE" as const,
          },
        ];

        const existingHashtags = new Set(
          trendingTopics.map((t) => t.hashtag.toLowerCase())
        );
        const additionalTopics = defaultTopics
          .filter((t) => !existingHashtags.has(t.hashtag.toLowerCase()))
          .slice(0, first - trendingTopics.length);

        trendingTopics.push(...additionalTopics);
      }

      return trendingTopics;
    },

    suggestedUsers: async (_: any, { first = 4 }: { first?: number }) => {
      const currentUserId = getCurrentUserId();

      // Get users that the current user is not already following
      const following = await prisma.follow.findMany({
        where: { followerId: currentUserId },
        select: { followingId: true },
      });

      const followingIds = following.map((f: any) => f.followingId);
      followingIds.push(currentUserId); // Exclude current user

      // Get suggested users (users with most posts that current user doesn't follow)
      const suggestedUsers = await prisma.user.findMany({
        where: {
          id: { notIn: followingIds },
        },
        include: {
          _count: {
            select: {
              authoredPosts: true,
            },
          },
        },
        orderBy: {
          authoredPosts: {
            _count: "desc",
          },
        },
        take: first,
      });

      // If we don't have enough real users, add some default ones
      if (suggestedUsers.length < first) {
        const defaultUsers = [
          {
            id: "user-1",
            name: "Emma Wilson",
            username: "emmawilson",
            avatar: "/woman-developer.png",
            bio: "Full-stack developer passionate about React and Node.js",
            followers: 1250,
            following: 340,
            posts: 45,
            createdAt: new Date(),
            _count: { authoredPosts: 45 },
          },
          {
            id: "user-2",
            name: "David Kim",
            username: "davidkim",
            avatar: "/man-runner.png",
            bio: "UI/UX Designer & fitness enthusiast",
            followers: 890,
            following: 210,
            posts: 32,
            createdAt: new Date(),
            _count: { authoredPosts: 32 },
          },
          {
            id: "user-3",
            name: "Sofia Rodriguez",
            username: "sofiarodriguez",
            avatar: "/woman-designer.png",
            bio: "Creative designer and art director",
            followers: 2100,
            following: 180,
            posts: 67,
            createdAt: new Date(),
            _count: { authoredPosts: 67 },
          },
          {
            id: "user-4",
            name: "James Chen",
            username: "jameschen",
            avatar: "/diverse-user-avatars.png",
            bio: "Tech entrepreneur and startup advisor",
            followers: 3400,
            following: 420,
            posts: 89,
            createdAt: new Date(),
            _count: { authoredPosts: 89 },
          },
        ];

        const existingUserIds = new Set(suggestedUsers.map((u: any) => u.id));
        const additionalUsers = defaultUsers
          .filter((u) => !existingUserIds.has(u.id))
          .slice(0, first - suggestedUsers.length);

        suggestedUsers.push(...additionalUsers);
      }

      return suggestedUsers.map((user: any) => ({
        ...user,
        posts: user._count.authoredPosts,
      }));
    },
  },

  Mutation: {
    likePost: async (_: any, { postId }: { postId: string }) => {
      const currentUserId = getCurrentUserId();

      // Check if already liked
      const existingLike = await prisma.postLike.findUnique({
        where: {
          userId_postId: {
            userId: currentUserId,
            postId,
          },
        },
      });

      if (existingLike) {
        // Unlike the post
        await prisma.postLike.delete({
          where: {
            userId_postId: {
              userId: currentUserId,
              postId,
            },
          },
        });
      } else {
        // Like the post
        await prisma.postLike.create({
          data: {
            userId: currentUserId,
            postId,
          },
        });
      }

      // Get updated post
      const post = await prisma.post.findUnique({
        where: { id: postId },
        include: {
          author: true,
          media: true,
          _count: {
            select: {
              likes: true,
              comments: true,
              shares: true,
            },
          },
        },
      });

      if (!post) throw new Error("Post not found");

      const isLiked = !existingLike;
      const isBookmarked = await isPostBookmarkedByUser(post.id, currentUserId);
      const likeCount = await getPostLikeCount(post.id);
      const commentCount = await getPostCommentCount(post.id);

      return {
        ...post,
        likes: likeCount,
        comments: commentCount,
        shares: post._count.shares,
        isLiked,
        isBookmarked,
      };
    },

    unlikePost: async (_: any, { postId }: { postId: string }) => {
      const currentUserId = getCurrentUserId();

      await prisma.postLike.deleteMany({
        where: {
          userId: currentUserId,
          postId,
        },
      });

      // Get updated post
      const post = await prisma.post.findUnique({
        where: { id: postId },
        include: {
          author: true,
          media: true,
          _count: {
            select: {
              likes: true,
              comments: true,
              shares: true,
            },
          },
        },
      });

      if (!post) throw new Error("Post not found");

      const isBookmarked = await isPostBookmarkedByUser(post.id, currentUserId);

      return {
        ...post,
        likes: post._count.likes,
        comments: post._count.comments,
        shares: post._count.shares,
        isLiked: false,
        isBookmarked,
      };
    },

    createPost: async (
      _: any,
      {
        content,
        mediaUrl,
        mediaType,
      }: { content: string; mediaUrl?: string; mediaType?: MediaType }
    ) => {
      const currentUserId = getCurrentUserId();

      // Ensure the current user exists in the database
      let user = await prisma.user.findUnique({
        where: { id: currentUserId },
      });

      if (!user) {
        // Create the current user if they don't exist
        user = await prisma.user.create({
          data: {
            id: currentUserId,
            name: "Current User",
            username: "currentuser",
            avatar: "/diverse-user-avatars.png",
            bio: "Social media enthusiast",
          },
        });
      }

      const post = await prisma.post.create({
        data: {
          content,
          authorId: currentUserId,
          media: mediaUrl
            ? {
                create: {
                  type: mediaType || "IMAGE",
                  url: mediaUrl,
                },
              }
            : undefined,
        },
        include: {
          author: true,
          media: true,
          _count: {
            select: {
              likes: true,
              comments: true,
              shares: true,
            },
          },
        },
      });

      // Publish subscription
      pubsub.publish("POST_ADDED", { postAdded: post });

      return {
        ...post,
        likes: post._count.likes,
        comments: post._count.comments,
        shares: post._count.shares,
        isLiked: false,
        isBookmarked: false,
      };
    },

    sharePost: async (_: any, { postId }: { postId: string }) => {
      const currentUserId = getCurrentUserId();

      await prisma.postShare.create({
        data: {
          userId: currentUserId,
          postId,
        },
      });

      // Get updated post
      const post = await prisma.post.findUnique({
        where: { id: postId },
        include: {
          author: true,
          media: true,
          _count: {
            select: {
              likes: true,
              comments: true,
              shares: true,
            },
          },
        },
      });

      if (!post) throw new Error("Post not found");

      const isLiked = await isPostLikedByUser(post.id, currentUserId);
      const isBookmarked = await isPostBookmarkedByUser(post.id, currentUserId);

      return {
        ...post,
        likes: post._count.likes,
        comments: post._count.comments,
        shares: post._count.shares,
        isLiked,
        isBookmarked,
      };
    },

    createComment: async (
      _: any,
      { postId, content }: { postId: string; content: string }
    ) => {
      const currentUserId = getCurrentUserId();

      const comment = await prisma.comment.create({
        data: {
          content,
          authorId: currentUserId,
          postId,
        },
        include: {
          author: true,
          _count: {
            select: {
              likes: true,
            },
          },
        },
      });

      // Publish subscription
      pubsub.publish("COMMENT_ADDED", { commentAdded: comment });

      return {
        ...comment,
        likes: comment._count.likes,
        isLiked: false,
      };
    },

    likeComment: async (_: any, { commentId }: { commentId: string }) => {
      const currentUserId = getCurrentUserId();

      // Check if already liked
      const existingLike = await prisma.commentLike.findUnique({
        where: {
          userId_commentId: {
            userId: currentUserId,
            commentId,
          },
        },
      });

      if (existingLike) {
        // Unlike the comment
        await prisma.commentLike.delete({
          where: {
            userId_commentId: {
              userId: currentUserId,
              commentId,
            },
          },
        });
      } else {
        // Like the comment
        await prisma.commentLike.create({
          data: {
            userId: currentUserId,
            commentId,
          },
        });
      }

      // Get updated comment
      const comment = await prisma.comment.findUnique({
        where: { id: commentId },
        include: {
          author: true,
          _count: {
            select: {
              likes: true,
            },
          },
        },
      });

      if (!comment) throw new Error("Comment not found");

      const isLiked = !existingLike;

      return {
        ...comment,
        likes: comment._count.likes,
        isLiked,
      };
    },

    unlikeComment: async (_: any, { commentId }: { commentId: string }) => {
      const currentUserId = getCurrentUserId();

      await prisma.commentLike.deleteMany({
        where: {
          userId: currentUserId,
          commentId,
        },
      });

      // Get updated comment
      const comment = await prisma.comment.findUnique({
        where: { id: commentId },
        include: {
          author: true,
          _count: {
            select: {
              likes: true,
            },
          },
        },
      });

      if (!comment) throw new Error("Comment not found");

      return {
        ...comment,
        likes: comment._count.likes,
        isLiked: false,
      };
    },

    deletePost: async (_: any, { postId }: { postId: string }) => {
      const currentUserId = getCurrentUserId();

      // Check if user owns the post
      const post = await prisma.post.findUnique({
        where: { id: postId },
      });

      if (!post) throw new Error("Post not found");
      if (post.authorId !== currentUserId) throw new Error("Unauthorized");

      await prisma.post.delete({
        where: { id: postId },
      });

      return true;
    },

    deleteComment: async (_: any, { commentId }: { commentId: string }) => {
      const currentUserId = getCurrentUserId();

      // Check if user owns the comment
      const comment = await prisma.comment.findUnique({
        where: { id: commentId },
      });

      if (!comment) throw new Error("Comment not found");
      if (comment.authorId !== currentUserId) throw new Error("Unauthorized");

      await prisma.comment.delete({
        where: { id: commentId },
      });

      return true;
    },

    followUser: async (_: any, { userId }: { userId: string }) => {
      const currentUserId = getCurrentUserId();

      if (userId === currentUserId) {
        throw new Error("Cannot follow yourself");
      }

      // Check if already following
      const existingFollow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: currentUserId,
            followingId: userId,
          },
        },
      });

      if (!existingFollow) {
        await prisma.follow.create({
          data: {
            followerId: currentUserId,
            followingId: userId,
          },
        });
      }

      // Get updated user
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          _count: {
            select: {
              authoredPosts: true,
            },
          },
        },
      });

      if (!user) throw new Error("User not found");

      return {
        ...user,
        posts: user._count.authoredPosts,
      };
    },

    unfollowUser: async (_: any, { userId }: { userId: string }) => {
      const currentUserId = getCurrentUserId();

      await prisma.follow.deleteMany({
        where: {
          followerId: currentUserId,
          followingId: userId,
        },
      });

      // Get updated user
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          _count: {
            select: {
              authoredPosts: true,
            },
          },
        },
      });

      if (!user) throw new Error("User not found");

      return {
        ...user,
        posts: user._count.authoredPosts,
      };
    },

    bookmarkPost: async (_: any, { postId }: { postId: string }) => {
      const currentUserId = getCurrentUserId();

      // Check if already bookmarked
      const existingBookmark = await prisma.bookmark.findUnique({
        where: {
          userId_postId: {
            userId: currentUserId,
            postId,
          },
        },
      });

      if (!existingBookmark) {
        // Create bookmark
        await prisma.bookmark.create({
          data: {
            userId: currentUserId,
            postId,
          },
        });
      }

      // Get updated post
      const post = await prisma.post.findUnique({
        where: { id: postId },
        include: {
          author: true,
          media: true,
          _count: {
            select: {
              likes: true,
              comments: true,
              shares: true,
            },
          },
        },
      });

      if (!post) throw new Error("Post not found");

      const isLiked = await isPostLikedByUser(post.id, currentUserId);
      const isBookmarked = true; // We just bookmarked it

      return {
        ...post,
        likes: post._count.likes,
        comments: post._count.comments,
        shares: post._count.shares,
        isLiked,
        isBookmarked,
      };
    },

    unbookmarkPost: async (_: any, { postId }: { postId: string }) => {
      const currentUserId = getCurrentUserId();

      // Remove bookmark
      await prisma.bookmark.deleteMany({
        where: {
          userId: currentUserId,
          postId,
        },
      });

      // Get updated post
      const post = await prisma.post.findUnique({
        where: { id: postId },
        include: {
          author: true,
          media: true,
          _count: {
            select: {
              likes: true,
              comments: true,
              shares: true,
            },
          },
        },
      });

      if (!post) throw new Error("Post not found");

      const isLiked = await isPostLikedByUser(post.id, currentUserId);
      const isBookmarked = false; // We just unbookmarked it

      return {
        ...post,
        likes: post._count.likes,
        comments: post._count.comments,
        shares: post._count.shares,
        isLiked,
        isBookmarked,
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

      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (bio !== undefined) updateData.bio = bio;
      if (avatar !== undefined) updateData.avatar = avatar;
      if (location !== undefined) updateData.location = location;
      if (website !== undefined) updateData.website = website;

      const updatedUser = await prisma.user.update({
        where: { id: currentUserId },
        data: updateData,
        include: {
          _count: {
            select: {
              authoredPosts: true,
            },
          },
        },
      });

      return {
        ...updatedUser,
        posts: updatedUser._count.authoredPosts,
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
