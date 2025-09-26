"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Heart,
  MessageCircle,
  Share,
  MoreHorizontal,
  Bookmark,
} from "lucide-react";
import type { Post } from "@/lib/graphql";
import { useCommentsGraphQL } from "@/hooks/use-comments-graphql";
import { CommentSection } from "@/components/comment-section";
import { ShareDialog } from "@/components/share-dialog";
import { useMutation } from "@apollo/client/react";
import { BOOKMARK_POST, UNBOOKMARK_POST } from "@/lib/graphql/mutations/posts";
import { cn } from "@/lib/utils";

interface GraphQLPostCardProps {
  post: Post;
  onLike?: (postId: string) => Promise<void>;
  onShare?: (postId: string) => Promise<void>;
}

export function GraphQLPostCard({
  post,
  onLike,
  onShare,
}: GraphQLPostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);

  const { comments, addComment } = useCommentsGraphQL(
    showComments ? post.id : undefined
  );

  const [bookmarkPostMutation] = useMutation(BOOKMARK_POST, {
    update: (cache, { data: mutationData }) => {
      if (mutationData?.bookmarkPost) {
        cache.modify({
          id: cache.identify(mutationData.bookmarkPost),
          fields: {
            isBookmarked: () => mutationData.bookmarkPost.isBookmarked,
          },
        });
      }
    },
  });

  const [unbookmarkPostMutation] = useMutation(UNBOOKMARK_POST, {
    update: (cache, { data: mutationData }) => {
      if (mutationData?.unbookmarkPost) {
        cache.modify({
          id: cache.identify(mutationData.unbookmarkPost),
          fields: {
            isBookmarked: () => mutationData.unbookmarkPost.isBookmarked,
          },
        });
      }
    },
  });

  const handleLike = async () => {
    if (isLiking || !onLike) return;

    setIsLiking(true);
    try {
      await onLike(post.id);
    } catch (error) {
      console.error("Failed to like post:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = async () => {
    if (isSharing || !onShare) return;

    setIsSharing(true);
    try {
      await onShare(post.id);
    } catch (error) {
      console.error("Failed to share post:", error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleBookmark = async () => {
    if (isBookmarking) return;

    setIsBookmarking(true);
    try {
      if (post.isBookmarked) {
        await unbookmarkPostMutation({ variables: { postId: post.id } });
      } else {
        await bookmarkPostMutation({ variables: { postId: post.id } });
      }
    } catch (error) {
      console.error("Failed to bookmark/unbookmark post:", error);
    } finally {
      setIsBookmarking(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;

    // For older posts, show the actual date
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto mb-6 transition-all duration-200 hover:shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={post.author.avatar || "/placeholder.svg"}
                  alt={post.author.name}
                />
                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm">{post.author.name}</p>
                <p className="text-muted-foreground text-xs">
                  @{post.author.username} • {formatTimeAgo(post.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                disabled={isBookmarking}
                className={cn(
                  "transition-colors",
                  post.isBookmarked && "text-primary"
                )}
              >
                <Bookmark
                  className={cn(
                    "h-4 w-4",
                    post.isBookmarked && "fill-current",
                    isBookmarking && "scale-110"
                  )}
                />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-3">
          <p className="text-sm leading-relaxed mb-3">{post.content}</p>

          {post.media && (
            <div className="rounded-lg overflow-hidden">
              {post.media.type === "image" ? (
                <img
                  src={post.media.url || "/placeholder.svg"}
                  alt="Post media"
                  className="w-full h-auto max-h-96 object-cover"
                />
              ) : (
                <video
                  src={post.media.url}
                  poster={post.media.thumbnail}
                  controls
                  className="w-full h-auto max-h-96"
                />
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-3 border-t">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                disabled={isLiking}
                className={cn(
                  "flex items-center space-x-2 transition-colors",
                  post.isLiked && "text-red-500 hover:text-red-600"
                )}
              >
                <Heart
                  className={cn(
                    "h-4 w-4 transition-all",
                    post.isLiked && "fill-current",
                    isLiking && "scale-110"
                  )}
                />
                <span className="text-xs">{post.likes}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowComments(!showComments)}
                className="flex items-center space-x-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs">{post.comments}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowShareDialog(true)}
                disabled={isSharing}
                className="flex items-center space-x-2"
              >
                <Share className={cn("h-4 w-4", isSharing && "scale-110")} />
                <span className="text-xs">{post.shares}</span>
              </Button>
            </div>
          </div>
        </CardFooter>

        <CommentSection
          postId={post.id}
          isOpen={showComments}
          onClose={() => setShowComments(false)}
        />
      </Card>

      <ShareDialog
        post={post}
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        onShare={handleShare}
      />
    </>
  );
}
