"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { useProfile, UserPost } from "@/hooks/use-profile";
import { formatDistanceToNow } from "date-fns";

interface UserPostsProps {
  userId: string;
  username: string;
  userAvatar: string;
  userName: string;
}

export function UserPosts({
  userId,
  username,
  userAvatar,
  userName,
}: UserPostsProps) {
  const { posts, loading, error, hasNextPage } = useProfile(username);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const handleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Unknown time";
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Failed to load posts</p>
        </CardContent>
      </Card>
    );
  }

  if (posts.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
          <p className="text-muted-foreground">
            {username === "you"
              ? "Share your first post to get started!"
              : `${userName} hasn't posted anything yet.`}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post: UserPost) => {
        const isLiked = likedPosts.has(post.id);
        return (
          <Card key={post.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={userAvatar} alt={userName} />
                  <AvatarFallback>
                    {userName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{userName}</span>
                    <Badge variant="outline" className="text-xs">
                      @{username}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(post.createdAt)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-auto h-6 w-6 p-0"
                    >
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </div>

                  <p className="text-sm leading-relaxed">{post.content}</p>

                  {post.media && (
                    <div className="mt-3">
                      {post.media.type === "IMAGE" ? (
                        <img
                          src={post.media.url}
                          alt="Post media"
                          className="rounded-lg max-w-full h-auto max-h-96 object-cover"
                        />
                      ) : (
                        <video
                          src={post.media.url}
                          controls
                          className="rounded-lg max-w-full h-auto max-h-96"
                        />
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1 hover:text-primary transition-colors ${
                        isLiked ? "text-red-500" : ""
                      }`}
                    >
                      <Heart
                        className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`}
                      />
                      {isLiked ? post.likes + 1 : post.likes}
                    </button>
                    <button className="flex items-center gap-1 hover:text-primary transition-colors">
                      <MessageCircle className="h-4 w-4" />
                      {post.comments}
                    </button>
                    <button className="flex items-center gap-1 hover:text-primary transition-colors">
                      <Share2 className="h-4 w-4" />
                      {post.shares}
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {hasNextPage && (
        <div className="text-center pt-4">
          <Button variant="outline" size="sm">
            Load More Posts
          </Button>
        </div>
      )}
    </div>
  );
}
