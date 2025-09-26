"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AnimatedFeedHeader } from "@/components/animated-feed-header";
import { AnimatedMobileNavigation } from "@/components/animated-mobile-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Users,
  Hash,
  MessageCircle,
  Heart,
  Share2,
  TrendingUp,
  Clock,
  Filter,
  X,
  UserPlus,
  Check,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

interface SearchResult {
  id: string;
  type: "user" | "post" | "hashtag";
  title: string;
  subtitle?: string;
  description?: string;
  avatar?: string;
  timestamp?: Date;
  likes?: number;
  comments?: number;
  posts?: number;
  followers?: number;
  isFollowing?: boolean;
}

interface TrendingHashtag {
  tag: string;
  posts: number;
  trend: "up" | "down" | "stable";
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [activeTab, setActiveTab] = useState("all");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [trendingHashtags, setTrendingHashtags] = useState<TrendingHashtag[]>(
    []
  );
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock data
  useEffect(() => {
    const mockTrendingHashtags: TrendingHashtag[] = [
      { tag: "webdevelopment", posts: 15420, trend: "up" },
      { tag: "react", posts: 12890, trend: "up" },
      { tag: "nextjs", posts: 9876, trend: "stable" },
      { tag: "typescript", posts: 8765, trend: "up" },
      { tag: "ai", posts: 7654, trend: "down" },
    ];

    const mockRecentSearches = [
      "react hooks",
      "typescript",
      "sarah chen",
      "web development",
    ];

    setTrendingHashtags(mockTrendingHashtags);
    setRecentSearches(mockRecentSearches);
  }, []);

  // Auto-search when component mounts with query parameter
  useEffect(() => {
    if (searchQuery) {
      handleSearch(searchQuery);
    }
  }, [searchQuery]);

  // Mock search results
  const mockSearchResults: SearchResult[] = [
    {
      id: "1",
      type: "user",
      title: "Sarah Chen",
      subtitle: "@sarahchen",
      description: "Full-stack developer passionate about React and Node.js",
      avatar: "/placeholder-user.jpg",
      followers: 1247,
      isFollowing: false,
    },
    {
      id: "2",
      type: "user",
      title: "Alex Rivera",
      subtitle: "@alexrivera",
      description: "UI/UX Designer creating beautiful digital experiences",
      avatar: "/placeholder-user.jpg",
      followers: 892,
      isFollowing: true,
    },
    {
      id: "3",
      type: "hashtag",
      title: "#webdevelopment",
      subtitle: "15,420 posts",
      description:
        "Everything related to web development, from HTML to advanced frameworks",
    },
    {
      id: "4",
      type: "post",
      title: "Just launched my new project! 🚀",
      subtitle: "by Sarah Chen",
      description:
        "After months of hard work, I'm excited to share my latest web application built with React and TypeScript...",
      avatar: "/placeholder-user.jpg",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      likes: 42,
      comments: 8,
    },
    {
      id: "5",
      type: "post",
      title: "Learning TypeScript has been a game changer",
      subtitle: "by Alex Rivera",
      description:
        "The type safety and better developer experience have made my code so much more maintainable...",
      avatar: "/placeholder-user.jpg",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      likes: 28,
      comments: 5,
    },
  ];

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const filtered = mockSearchResults.filter(
        (result) =>
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.subtitle?.toLowerCase().includes(query.toLowerCase()) ||
          result.description?.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
      setLoading(false);
    }, 500);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  const handleFollow = (userId: string) => {
    setSearchResults((prev) =>
      prev.map((result) =>
        result.id === userId
          ? {
              ...result,
              isFollowing: !result.isFollowing,
              followers: result.followers
                ? result.isFollowing
                  ? result.followers - 1
                  : result.followers + 1
                : undefined,
            }
          : result
      )
    );
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const filteredResults = searchResults.filter((result) => {
    if (activeTab === "all") return true;
    return result.type === activeTab;
  });

  const getResultIcon = (type: string) => {
    switch (type) {
      case "user":
        return Users;
      case "post":
        return MessageCircle;
      case "hashtag":
        return Hash;
      default:
        return Search;
    }
  };

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
          {/* Search Header */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">Search</h1>

            {/* Search Form */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users, posts, hashtags..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearch(e.target.value);
                }}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={clearSearch}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </form>
          </div>

          {/* Search Results or Default Content */}
          {searchQuery ? (
            <div className="space-y-4">
              {/* Results Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="user">Users</TabsTrigger>
                  <TabsTrigger value="post">Posts</TabsTrigger>
                  <TabsTrigger value="hashtag">Hashtags</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="space-y-4">
                  {loading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-muted rounded-full" />
                              <div className="flex-1 space-y-2">
                                <div className="h-4 bg-muted rounded w-1/3" />
                                <div className="h-3 bg-muted rounded w-1/2" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : filteredResults.length === 0 ? (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                          No results found
                        </h3>
                        <p className="text-muted-foreground">
                          Try searching for something else or check your
                          spelling.
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {filteredResults.map((result, index) => {
                        const IconComponent = getResultIcon(result.type);

                        return (
                          <motion.div
                            key={result.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                          >
                            <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                              <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                  <div className="p-2 rounded-full bg-muted">
                                    <IconComponent className="h-4 w-4" />
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                          <h3 className="font-semibold truncate">
                                            {result.title}
                                          </h3>
                                          {result.type === "user" &&
                                            result.followers && (
                                              <Badge
                                                variant="outline"
                                                className="text-xs"
                                              >
                                                {result.followers} followers
                                              </Badge>
                                            )}
                                        </div>

                                        {result.subtitle && (
                                          <p className="text-sm text-muted-foreground mb-1">
                                            {result.subtitle}
                                          </p>
                                        )}

                                        {result.description && (
                                          <p className="text-sm text-muted-foreground line-clamp-2">
                                            {result.description}
                                          </p>
                                        )}

                                        {result.type === "post" &&
                                          result.timestamp && (
                                            <p className="text-xs text-muted-foreground mt-2">
                                              {formatTime(result.timestamp)}
                                            </p>
                                          )}

                                        {result.type === "post" && (
                                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                              <Heart className="h-3 w-3" />
                                              {result.likes}
                                            </span>
                                            <span className="flex items-center gap-1">
                                              <MessageCircle className="h-3 w-3" />
                                              {result.comments}
                                            </span>
                                          </div>
                                        )}
                                      </div>

                                      {result.type === "user" &&
                                        !result.isFollowing && (
                                          <Button
                                            size="sm"
                                            onClick={() =>
                                              handleFollow(result.id)
                                            }
                                            className="flex items-center gap-1"
                                          >
                                            <UserPlus className="h-3 w-3" />
                                            Follow
                                          </Button>
                                        )}

                                      {result.type === "user" &&
                                        result.isFollowing && (
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                              handleFollow(result.id)
                                            }
                                            className="flex items-center gap-1"
                                          >
                                            <Check className="h-3 w-3" />
                                            Following
                                          </Button>
                                        )}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Trending Hashtags */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Trending Hashtags
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {trendingHashtags.map((hashtag, index) => (
                      <motion.div
                        key={hashtag.tag}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => {
                          setSearchQuery(`#${hashtag.tag}`);
                          handleSearch(`#${hashtag.tag}`);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Hash className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">#{hashtag.tag}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {hashtag.posts.toLocaleString()} posts
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp
                            className={`h-4 w-4 ${
                              hashtag.trend === "up"
                                ? "text-green-500"
                                : hashtag.trend === "down"
                                ? "text-red-500"
                                : "text-muted-foreground"
                            }`}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>

                {/* Recent Searches */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Recent Searches
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {recentSearches.map((search, index) => (
                      <motion.div
                        key={search}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center justify-between p-2 rounded hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => {
                          setSearchQuery(search);
                          handleSearch(search);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{search}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            setRecentSearches((prev) =>
                              prev.filter((s) => s !== search)
                            );
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Search Tips */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Search Tips</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <Users className="h-4 w-4 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Find Users</p>
                        <p className="text-muted-foreground">
                          Search by name or username
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Hash className="h-4 w-4 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Explore Hashtags</p>
                        <p className="text-muted-foreground">
                          Use # to find trending topics
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MessageCircle className="h-4 w-4 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Discover Posts</p>
                        <p className="text-muted-foreground">
                          Search for specific content
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </motion.div>
      </main>

      <AnimatedMobileNavigation />
    </div>
  );
}
