"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AnimatedFeedHeader } from "@/components/animated-feed-header";
import { AnimatedFeedSidebar } from "@/components/animated-sidebar";
import { AnimatedMobileNavigation } from "@/components/animated-mobile-nav";
import { usePostsGraphQL } from "@/hooks/use-posts-graphql";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { CreatePostDialog } from "@/components/create-post-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { GraphQLPostCard } from "@/components/graphql-post-card";
import { GraphQLLoading, FeedSkeleton } from "@/components/graphql-loading";
import { ErrorMessage } from "@/components/error-message";

export default function HomePage() {
  const {
    posts,
    newPosts,
    loading,
    error,
    hasNextPage,
    isFetchingNextPage,
    loadMorePosts,
    loadNewPosts,
    likePost,
    sharePost,
  } = usePostsGraphQL();

  const { loadMoreRef } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage: loadMorePosts,
    rootMargin: "200px",
  });

  const handleLoadNewPosts = () => {
    loadNewPosts();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AnimatedFeedHeader />
        <main className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <FeedSkeleton />
          </motion.div>
        </main>
        <AnimatedMobileNavigation />
      </div>
    );
  }

  if (error && posts.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <AnimatedFeedHeader />
        <main className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ErrorMessage
              message={error}
              onRetry={() => window.location.reload()}
            />
          </motion.div>
        </main>
        <AnimatedMobileNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <AnimatedFeedHeader />

      <motion.div
        className="container mx-auto px-4 py-8 max-w-7xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="flex gap-8">
          {/* Main Feed */}
          <main className="flex-1 max-w-2xl mx-auto lg:mx-0">
            {/* Create Post Section */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CreatePostDialog>
                <Button className="w-full justify-start text-left font-normal text-muted-foreground bg-muted hover:bg-muted/80">
                  <Plus className="h-4 w-4 mr-2" />
                  What's on your mind?
                </Button>
              </CreatePostDialog>
            </motion.div>

            <motion.div
              className="mb-8 p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-lg font-semibold mb-2">
                Welcome to SocialFeed!
              </h2>
              <p className="text-muted-foreground text-sm">
                Create posts, like, comment, and connect with others in the
                community.
              </p>
            </motion.div>

            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <GraphQLPostCard
                      post={post}
                      onLike={likePost}
                      onShare={sharePost}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Infinite Scroll Trigger */}
              {hasNextPage && (
                <motion.div
                  ref={loadMoreRef}
                  className="flex justify-center py-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {isFetchingNextPage && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <GraphQLLoading
                        message="Loading more posts..."
                        size="sm"
                      />
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* End of Feed Message */}
              {!hasNextPage && posts.length > 0 && (
                <motion.div
                  className="text-center py-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-muted-foreground text-sm">
                    You've reached the end of your feed
                  </p>
                  <p className="text-muted-foreground text-xs mt-1">
                    Create a new post to get started!
                  </p>
                </motion.div>
              )}

              {/* Empty State */}
              {posts.length === 0 && !loading && (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Plus className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Be the first to share something with the community!
                  </p>
                  <CreatePostDialog>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create your first post
                    </Button>
                  </CreatePostDialog>
                </motion.div>
              )}
            </div>
          </main>

          {/* Sidebar */}
          <AnimatedFeedSidebar />
        </div>
      </motion.div>

      <AnimatedMobileNavigation />
    </div>
  );
}
