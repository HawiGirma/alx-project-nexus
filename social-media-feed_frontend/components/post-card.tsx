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
import { type Post, graphqlClient } from "@/lib/graphql";
import { CommentSection } from "@/components/comment-section";
import { ShareDialog } from "@/components/share-dialog";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: Post;
  onPostUpdate?: (updatedPost: Post) => void;
}

export function PostCard({ post, onPostUpdate }: PostCardProps) {
  const [isLiking, setIsLiking] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [localPost, setLocalPost] = useState(post);
  const [showComments, setShowComments] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;

    setIsLiking(true);
    try {
      const newLikedState = await graphqlClient.likePost(localPost.id);
      const updatedPost = {
        ...localPost,
        isLiked: newLikedState,
        likes: localPost.likes + (newLikedState ? 1 : -1),
      };
      setLocalPost(updatedPost);
      onPostUpdate?.(updatedPost);
    } catch (error) {
      console.error("Failed to like post:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = async () => {
    if (isSharing) return;

    setIsSharing(true);
    try {
      await graphqlClient.sharePost(localPost.id);
      const updatedPost = {
        ...localPost,
        shares: localPost.shares + 1,
      };
      setLocalPost(updatedPost);
      onPostUpdate?.(updatedPost);
    } catch (error) {
      console.error("Failed to share post:", error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
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
                  src={localPost.author.avatar || "/placeholder.svg"}
                  alt={localPost.author.name}
                />
                <AvatarFallback>
                  {localPost.author.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm">{localPost.author.name}</p>
                <p className="text-muted-foreground text-xs">
                  @{localPost.author.username} •{" "}
                  {formatTimeAgo(localPost.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className={cn(
                  "transition-colors",
                  isBookmarked && "text-primary"
                )}
              >
                <Bookmark
                  className={cn("h-4 w-4", isBookmarked && "fill-current")}
                />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-3">
          <p className="text-sm leading-relaxed mb-3">{localPost.content}</p>

          {localPost.media && (
            <div className="rounded-lg overflow-hidden">
              {localPost.media.type === "image" ? (
                <img
                  src={localPost.media.url || "/placeholder.svg"}
                  alt="Post media"
                  className="w-full h-auto max-h-96 object-cover"
                />
              ) : (
                <video
                  src={localPost.media.url}
                  poster={localPost.media.thumbnail}
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
                  localPost.isLiked && "text-red-500 hover:text-red-600"
                )}
              >
                <Heart
                  className={cn(
                    "h-4 w-4 transition-all",
                    localPost.isLiked && "fill-current",
                    isLiking && "scale-110"
                  )}
                />
                <span className="text-xs">{localPost.likes}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowComments(!showComments)}
                className="flex items-center space-x-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs">{localPost.comments}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowShareDialog(true)}
                disabled={isSharing}
                className="flex items-center space-x-2"
              >
                <Share className={cn("h-4 w-4", isSharing && "scale-110")} />
                <span className="text-xs">{localPost.shares}</span>
              </Button>
            </div>
          </div>
        </CardFooter>

        <CommentSection
          postId={localPost.id}
          isOpen={showComments}
          onClose={() => setShowComments(false)}
        />
      </Card>

      <ShareDialog
        post={localPost}
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        onShare={handleShare}
      />
    </>
  );
}
