"use client";

import { usePostsGraphQL } from "@/hooks/use-posts-graphql";
import { GraphQLPostCard } from "@/components/graphql-post-card";
import { Button } from "@/components/ui/button";
import { GraphQLLoading, FeedSkeleton } from "@/components/graphql-loading";
import { RefreshCw } from "lucide-react";

export function DemoGraphQLFeed() {
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

  if (loading && posts.length === 0) {
    return <FeedSkeleton />;
  }

  if (error && posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">Error loading posts: {error}</p>
        <Button onClick={() => window.location.reload()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* New Posts Indicator */}
      {newPosts.length > 0 && (
        <div className="text-center">
          <Button
            onClick={loadNewPosts}
            variant="outline"
            className="mb-4 bg-transparent"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Load {newPosts.length} new post{newPosts.length !== 1 ? "s" : ""}
          </Button>
        </div>
      )}

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map((post) => (
          <GraphQLPostCard
            key={post.id}
            post={post}
            onLike={likePost}
            onShare={sharePost}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasNextPage && (
        <div className="text-center py-6">
          <Button
            onClick={loadMorePosts}
            disabled={isFetchingNextPage}
            variant="outline"
          >
            {isFetchingNextPage ? (
              <GraphQLLoading message="Loading more..." size="sm" />
            ) : (
              "Load more posts"
            )}
          </Button>
        </div>
      )}

      {/* End of Feed */}
      {!hasNextPage && posts.length > 0 && (
        <div className="text-center py-6 text-muted-foreground">
          <p>You've reached the end of the feed!</p>
        </div>
      )}
    </div>
  );
}
