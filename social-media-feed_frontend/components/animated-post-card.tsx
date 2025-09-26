"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
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

interface AnimatedPostCardProps {
  post: Post;
  onPostUpdate?: (updatedPost: Post) => void;
  index: number;
}

export function AnimatedPostCard({
  post,
  onPostUpdate,
  index,
}: AnimatedPostCardProps) {
  const [isLiking, setIsLiking] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [localPost, setLocalPost] = useState(post);
  const [showComments, setShowComments] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(localPost.likes);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const handleLike = async () => {
    if (isLiking) return;

    // Optimistic update for immediate feedback
    const newLikedState = !localPost.isLiked;
    const newLikeCount = likeCount + (newLikedState ? 1 : -1);

    setLikeCount(newLikeCount);
    setLocalPost((prev) => ({
      ...prev,
      isLiked: newLikedState,
      likes: newLikeCount,
    }));
    setIsLiking(true);

    try {
      const actualLikedState = await graphqlClient.likePost(localPost.id);
      const updatedPost = {
        ...localPost,
        isLiked: actualLikedState,
        likes: newLikeCount,
      };
      setLocalPost(updatedPost);
      onPostUpdate?.(updatedPost);
    } catch (error) {
      // Revert optimistic update on error
      setLikeCount(localPost.likes);
      setLocalPost((prev) => ({
        ...prev,
        isLiked: localPost.isLiked,
        likes: localPost.likes,
      }));
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

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut",
      },
    },
  };

  const likeVariants = {
    liked: {
      scale: [1, 1.2, 1],
      transition: { duration: 0.3 },
    },
    unliked: {
      scale: 1,
      transition: { duration: 0.2 },
    },
  };

  return (
    <>
      <motion.div
        ref={ref}
        variants={cardVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        whileHover={{
          y: -4,
          transition: { duration: 0.2 },
        }}
      >
        <Card className="w-full max-w-2xl mx-auto mb-6 transition-all duration-200 hover:shadow-lg border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <motion.div
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                  <AvatarImage
                    src={localPost.author.avatar || "/placeholder.svg"}
                    alt={localPost.author.name}
                  />
                  <AvatarFallback>
                    {localPost.author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm">
                    {localPost.author.name}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    @{localPost.author.username} •{" "}
                    {formatTimeAgo(localPost.createdAt)}
                  </p>
                </div>
              </motion.div>
              <motion.div
                className="flex items-center gap-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBookmark}
                    className={cn(
                      "transition-colors",
                      isBookmarked && "text-primary"
                    )}
                  >
                    <motion.div
                      animate={
                        isBookmarked ? { scale: [1, 1.2, 1] } : { scale: 1 }
                      }
                      transition={{ duration: 0.3 }}
                    >
                      <Bookmark
                        className={cn(
                          "h-4 w-4",
                          isBookmarked && "fill-current"
                        )}
                      />
                    </motion.div>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </CardHeader>

          <CardContent className="pb-3">
            <motion.p
              className="text-sm leading-relaxed mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.4 }}
            >
              {localPost.content}
            </motion.p>

            {localPost.media && (
              <motion.div
                className="rounded-lg overflow-hidden"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + 0.5 }}
                whileHover={{ scale: 1.02 }}
              >
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
              </motion.div>
            )}
          </CardContent>

          <CardFooter className="pt-3 border-t">
            <motion.div
              className="flex items-center justify-between w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.6 }}
            >
              <div className="flex items-center space-x-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
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
                    <motion.div
                      variants={likeVariants}
                      animate={localPost.isLiked ? "liked" : "unliked"}
                    >
                      <Heart
                        className={cn(
                          "h-4 w-4 transition-all",
                          localPost.isLiked && "fill-current"
                        )}
                      />
                    </motion.div>
                    <motion.span
                      className="text-xs"
                      key={likeCount}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {likeCount}
                    </motion.span>
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowComments(!showComments)}
                    className="flex items-center space-x-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-xs">{localPost.comments}</span>
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowShareDialog(true)}
                    disabled={isSharing}
                    className="flex items-center space-x-2"
                  >
                    <motion.div
                      animate={isSharing ? { rotate: 360 } : { rotate: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Share className="h-4 w-4" />
                    </motion.div>
                    <span className="text-xs">{localPost.shares}</span>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </CardFooter>

          <motion.div
            initial={false}
            animate={{
              height: showComments ? "auto" : 0,
              opacity: showComments ? 1 : 0,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <CommentSection
              postId={localPost.id}
              isOpen={showComments}
              onClose={() => setShowComments(false)}
            />
          </motion.div>
        </Card>
      </motion.div>

      <ShareDialog
        post={localPost}
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        onShare={handleShare}
      />
    </>
  );
}
