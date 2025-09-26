"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AnimatedFeedHeader } from "@/components/animated-feed-header";
import { AnimatedMobileNavigation } from "@/components/animated-mobile-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  User,
  MapPin,
  Calendar,
  Link,
  MessageCircle,
  Heart,
  Share2,
  MoreHorizontal,
  Settings,
  Edit,
  Camera,
  Users,
  UserPlus,
  Check,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GraphQLPostCard } from "@/components/graphql-post-card";
import { useAuth } from "@/contexts/auth-context";
import { usePostsGraphQL } from "@/hooks/use-posts-graphql";
import { useProfile, useUpdateProfile } from "@/hooks/use-profile";
import { ProfileEditDialog } from "@/components/profile-edit-dialog";
import { UserPosts } from "@/components/user-posts";

interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  bio: string;
  location: string;
  website: string;
  joinDate: Date;
  avatar: string;
  coverImage?: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing: boolean;
  isOwnProfile: boolean;
}

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("posts");
  const [isFollowing, setIsFollowing] = useState(false);

  // Get current user's profile (using "you" as the username for current user)
  const { profile, loading, error, refetch } = useProfile("you");

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleProfileUpdate = (updatedProfile: any) => {
    // Refetch profile data after update
    refetch();
  };

  const formatJoinDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    } catch {
      return "Unknown date";
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <AnimatedFeedHeader />
        <main className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center py-12"
          >
            <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">
              Sign in to view profiles
            </h2>
            <p className="text-muted-foreground">
              You need to be signed in to view user profiles.
            </p>
          </motion.div>
        </main>
        <AnimatedMobileNavigation />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20 lg:pb-0">
        <AnimatedFeedHeader />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="space-y-6">
            {/* Profile Header Skeleton */}
            <Card className="overflow-hidden">
              <div className="h-48 bg-muted animate-pulse" />
              <CardContent className="p-6 -mt-16 relative">
                <div className="flex items-end gap-4">
                  <div className="w-24 h-24 bg-muted rounded-full animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-6 bg-muted rounded animate-pulse w-1/3" />
                    <div className="h-4 bg-muted rounded animate-pulse w-1/4" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Skeleton */}
            <div className="grid grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="h-6 bg-muted rounded animate-pulse" />
                      <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
        <AnimatedMobileNavigation />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <AnimatedFeedHeader />
        <main className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center py-12"
          >
            <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Profile not found</h2>
            <p className="text-muted-foreground">
              The profile you're looking for doesn't exist.
            </p>
          </motion.div>
        </main>
        <AnimatedMobileNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <AnimatedFeedHeader />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Profile Header */}
          <Card className="overflow-hidden">
            {/* Cover Image */}
            {profile.coverImage && (
              <div className="h-48 bg-gradient-to-r from-primary/20 to-secondary/20 relative">
                <img
                  src={profile.coverImage}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
              </div>
            )}

            <CardContent className="p-6 -mt-16 relative">
              <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
                <Avatar className="h-24 w-24 border-4 border-background">
                  <AvatarImage src={profile.avatar} alt={profile.name} />
                  <AvatarFallback className="text-lg">
                    {profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">{profile.name}</h1>
                    <Badge variant="outline">@{profile.username}</Badge>
                  </div>

                  {profile.bio && (
                    <p className="text-muted-foreground max-w-2xl">
                      {profile.bio}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    {profile.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {profile.location}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined {formatJoinDate(profile.joinDate)}
                    </div>
                    {profile.website && (
                      <div className="flex items-center gap-1">
                        <Link className="h-4 w-4" />
                        <a
                          href={profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary transition-colors"
                        >
                          {profile.website.replace("https://", "")}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <ProfileEditDialog
                    profile={profile}
                    onProfileUpdate={handleProfileUpdate}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{profile.posts}</div>
                <div className="text-sm text-muted-foreground">Posts</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{profile.followers}</div>
                <div className="text-sm text-muted-foreground">Followers</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{profile.following}</div>
                <div className="text-sm text-muted-foreground">Following</div>
              </CardContent>
            </Card>
          </div>

          {/* Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="likes">Likes</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="space-y-4">
              <UserPosts
                userId={profile.id}
                username={profile.username}
                userAvatar={profile.avatar}
                userName={profile.name}
              />
            </TabsContent>

            <TabsContent value="likes" className="space-y-4">
              <Card>
                <CardContent className="p-12 text-center">
                  <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No liked posts</h3>
                  <p className="text-muted-foreground">
                    Posts you like will appear here.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="media" className="space-y-4">
              <Card>
                <CardContent className="p-12 text-center">
                  <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No media yet</h3>
                  <p className="text-muted-foreground">
                    Photos and videos you share will appear here.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>

      <AnimatedMobileNavigation />
    </div>
  );
}
