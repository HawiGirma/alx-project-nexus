"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Users, Plus, RefreshCw } from "lucide-react";
import { useSuggestedUsers } from "@/hooks/use-suggested-users";
import { useFollowUser } from "@/hooks/use-follow-user";
import { Skeleton } from "@/components/ui/skeleton";

export function CommunitySection() {
  const { suggestedUsers, loading, error, refetch } = useSuggestedUsers(4);
  const { followUser, unfollowUser, loading: followLoading } = useFollowUser();
  const [followingUsers, setFollowingUsers] = useState<Set<string>>(new Set());

  const handleFollowToggle = async (
    userId: string,
    isCurrentlyFollowing: boolean
  ) => {
    if (isCurrentlyFollowing) {
      await unfollowUser(userId);
      setFollowingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    } else {
      await followUser(userId);
      setFollowingUsers((prev) => new Set(prev).add(userId));
    }
  };

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Community
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-2">
              Failed to load community suggestions
            </p>
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Community
          <Button
            size="sm"
            variant="ghost"
            onClick={() => refetch()}
            className="ml-auto h-6 w-6 p-0"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-8 w-8 rounded-full" />
              ))
            : suggestedUsers.slice(0, 4).map((user) => (
                <Avatar
                  key={user.id}
                  className="h-8 w-8 border-2 border-background"
                >
                  <AvatarImage
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.name}
                  />
                  <AvatarFallback className="text-xs">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              ))}
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <Plus className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-7 w-16" />
              </div>
            ))
          ) : suggestedUsers.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">
                No community suggestions found
              </p>
            </div>
          ) : (
            suggestedUsers.slice(0, 3).map((user) => {
              const isFollowing = followingUsers.has(user.id);
              return (
                <div
                  key={user.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.name}
                      />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        @{user.username}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={isFollowing ? "secondary" : "default"}
                    className="text-xs px-3 py-1 h-7"
                    onClick={() => handleFollowToggle(user.id, isFollowing)}
                    disabled={followLoading}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
