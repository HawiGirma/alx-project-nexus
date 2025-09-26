"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Hash, RefreshCw } from "lucide-react";
import { useTrendingTopics } from "@/hooks/use-trending-topics";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function TrendingSection() {
  const { trendingTopics, loading, error, refetch } = useTrendingTopics(5);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "UP":
        return "↗";
      case "DOWN":
        return "↘";
      case "STABLE":
        return "→";
      default:
        return "→";
    }
  };

  const getTrendVariant = (trend: string) => {
    switch (trend) {
      case "UP":
        return "default" as const;
      case "DOWN":
        return "destructive" as const;
      case "STABLE":
        return "secondary" as const;
      default:
        return "secondary" as const;
    }
  };

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Trending
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-2">
              Failed to load trending topics
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
          <TrendingUp className="h-5 w-5 text-primary" />
          Trending
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
      <CardContent className="space-y-3">
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-4" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-5 w-8" />
            </div>
          ))
        ) : trendingTopics.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">
              No trending topics found
            </p>
          </div>
        ) : (
          trendingTopics.map((topic, index) => (
            <div
              key={topic.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => {
                // Navigate to hashtag search or posts with this hashtag
                console.log(`Searching for #${topic.hashtag}`);
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground">
                  #{index + 1}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-sm">
                      {topic.hashtag}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {topic.posts.toLocaleString()} posts
                  </p>
                </div>
              </div>
              <Badge variant={getTrendVariant(topic.trend)} className="text-xs">
                {getTrendIcon(topic.trend)}
              </Badge>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
