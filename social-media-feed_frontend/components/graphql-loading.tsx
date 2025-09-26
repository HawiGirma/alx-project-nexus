"use client";

import { Loader2, Database, Zap, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface GraphQLLoadingProps {
  message?: string;
  showDetails?: boolean;
  size?: "sm" | "md" | "lg";
}

export function GraphQLLoading({
  message = "Loading...",
  showDetails = false,
  size = "md",
}: GraphQLLoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  if (showDetails) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Loader2
                className={`${sizeClasses[size]} animate-spin text-primary`}
              />
              <div className="absolute -top-1 -right-1">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              </div>
            </div>

            <div className="text-center">
              <p className={`font-medium ${textSizeClasses[size]}`}>
                {message}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Connecting to GraphQL server...
              </p>
            </div>

            <div className="flex space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Database className="h-3 w-3" />
                <span>Database</span>
              </div>
              <div className="flex items-center space-x-1">
                <Globe className="h-3 w-3" />
                <span>GraphQL</span>
              </div>
              <div className="flex items-center space-x-1">
                <Zap className="h-3 w-3" />
                <span>Apollo</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex items-center justify-center space-x-2">
      <Loader2 className={`${sizeClasses[size]} animate-spin`} />
      <span className={textSizeClasses[size]}>{message}</span>
    </div>
  );
}

// Skeleton components for different GraphQL data types
export function PostSkeleton() {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Author skeleton */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-muted rounded-full animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
              <div className="h-3 w-16 bg-muted rounded animate-pulse" />
            </div>
          </div>

          {/* Content skeleton */}
          <div className="space-y-2">
            <div className="h-4 w-full bg-muted rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
          </div>

          {/* Actions skeleton */}
          <div className="flex items-center space-x-6">
            <div className="h-4 w-12 bg-muted rounded animate-pulse" />
            <div className="h-4 w-16 bg-muted rounded animate-pulse" />
            <div className="h-4 w-14 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function CommentSkeleton() {
  return (
    <div className="space-y-3 p-4 border rounded-lg">
      <div className="flex items-center space-x-3">
        <div className="h-8 w-8 bg-muted rounded-full animate-pulse" />
        <div className="space-y-1">
          <div className="h-3 w-20 bg-muted rounded animate-pulse" />
          <div className="h-3 w-12 bg-muted rounded animate-pulse" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 w-full bg-muted rounded animate-pulse" />
        <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
      </div>
    </div>
  );
}

export function FeedSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <PostSkeleton key={i} />
      ))}
    </div>
  );
}
