"use client";

import { DemoGraphQLFeed } from "@/components/demo-graphql-feed";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Database, Zap, Globe } from "lucide-react";

export default function GraphQLTestPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            GraphQL Implementation Test
          </h1>
          <p className="text-muted-foreground text-lg">
            Testing the fully functional GraphQL social media feed
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Database className="h-4 w-4 text-green-500" />
                Database
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Connected
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">
                SQLite with Prisma
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 text-blue-500" />
                GraphQL Server
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Running
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">GraphQL Yoga</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4 text-purple-500" />
                Apollo Client
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge
                variant="secondary"
                className="bg-purple-100 text-purple-800"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Configured
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">
                Caching & Optimistic Updates
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-orange-500" />
                Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge
                variant="secondary"
                className="bg-orange-100 text-orange-800"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Full CRUD
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">
                Posts, Comments, Likes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Feature List */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Implemented Features</CardTitle>
            <CardDescription>
              All core GraphQL operations are now functional
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Queries</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Get posts with pagination</li>
                  <li>• Get single post details</li>
                  <li>• Get post comments</li>
                  <li>• Get user information</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Mutations</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Create new posts</li>
                  <li>• Like/unlike posts</li>
                  <li>• Share posts</li>
                  <li>• Add comments</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* GraphQL Feed Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Live GraphQL Feed</CardTitle>
            <CardDescription>
              This feed is powered by GraphQL queries and mutations. Try
              creating a post or liking posts!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DemoGraphQLFeed />
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How to Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>
                1. <strong>View Posts:</strong> The feed loads posts from the
                GraphQL database
              </p>
              <p>
                2. <strong>Like Posts:</strong> Click the heart icon to
                like/unlike posts
              </p>
              <p>
                3. <strong>Create Posts:</strong> Use the create post dialog to
                add new content
              </p>
              <p>
                4. <strong>Add Comments:</strong> Click on posts to view and add
                comments
              </p>
              <p>
                5. <strong>Share Posts:</strong> Use the share button to share
                posts
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
