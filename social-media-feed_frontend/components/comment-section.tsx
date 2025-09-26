"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Reply, MoreHorizontal } from "lucide-react";
import { useCommentsGraphQL } from "@/hooks/use-comments-graphql";
import { useMutation } from "@apollo/client/react";
import { LIKE_COMMENT, UNLIKE_COMMENT } from "@/lib/graphql/mutations/posts";
import { cn } from "@/lib/utils";

interface CommentSectionProps {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CommentSection({
  postId,
  isOpen,
  onClose,
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLiking, setIsLiking] = useState<string | null>(null);

  const { comments, loading, error, addComment } = useCommentsGraphQL(postId);

  const [likeCommentMutation] = useMutation(LIKE_COMMENT, {
    update: (cache, { data: mutationData }) => {
      if (mutationData?.likeComment) {
        cache.modify({
          id: cache.identify(mutationData.likeComment),
          fields: {
            likes: () => mutationData.likeComment.likes,
            isLiked: () => mutationData.likeComment.isLiked,
          },
        });
      }
    },
  });

  const [unlikeCommentMutation] = useMutation(UNLIKE_COMMENT, {
    update: (cache, { data: mutationData }) => {
      if (mutationData?.unlikeComment) {
        cache.modify({
          id: cache.identify(mutationData.unlikeComment),
          fields: {
            likes: () => mutationData.unlikeComment.likes,
            isLiked: () => mutationData.unlikeComment.isLiked,
          },
        });
      }
    },
  });

  const handleSubmitComment = async () => {
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addComment(postId, newComment);
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (isLiking === commentId) return;

    setIsLiking(commentId);
    try {
      const comment = comments.find((c) => c.id === commentId);
      if (comment?.isLiked) {
        await unlikeCommentMutation({ variables: { commentId } });
      } else {
        await likeCommentMutation({ variables: { commentId } });
      }
    } catch (error) {
      console.error("Failed to like/unlike comment:", error);
    } finally {
      setIsLiking(null);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (!isOpen) return null;

  return (
    <div className="border-t bg-muted/20 p-4 space-y-4">
      {/* Comment Input */}
      <div className="flex gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src="/user-profile-illustration.png"
            alt="Your profile"
          />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <Textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[80px] resize-none text-sm"
          />
          <div className="flex justify-between items-center">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSubmitComment}
              disabled={!newComment.trim() || isSubmitting}
            >
              {isSubmitting ? "Posting..." : "Comment"}
            </Button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {loading && (
          <div className="text-center py-4 text-muted-foreground">
            <p className="text-sm">Loading comments...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-4 text-red-500">
            <p className="text-sm">Failed to load comments: {error}</p>
          </div>
        )}

        {!loading &&
          !error &&
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={comment.author.avatar || "/placeholder.svg"}
                  alt={comment.author.name}
                />
                <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">
                      {comment.author.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      @{comment.author.username}
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
                <div className="flex items-center gap-4 px-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLikeComment(comment.id)}
                    disabled={isLiking === comment.id}
                    className={cn(
                      "h-auto p-0 text-xs transition-colors",
                      comment.isLiked && "text-red-500 hover:text-red-600"
                    )}
                  >
                    <Heart
                      className={cn(
                        "h-3 w-3 mr-1 transition-all",
                        comment.isLiked && "fill-current",
                        isLiking === comment.id && "scale-110"
                      )}
                    />
                    {comment.likes > 0 && comment.likes}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-xs"
                  >
                    <Reply className="h-3 w-3 mr-1" />
                    Reply
                  </Button>
                  <Button variant="ghost" size="sm" className="h-auto p-0">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

        {!loading && !error && comments.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  );
}
