// Mock data for when database is not available (e.g., on Vercel)
export const mockUsers = [
  {
    id: "user-1",
    name: "Emma Wilson",
    username: "emmawilson",
    email: "emma@example.com",
    avatar: "/woman-developer.png",
    bio: "Full-stack developer passionate about React and Node.js",
    location: "San Francisco, CA",
    website: "https://emmawilson.dev",
    posts: 45,
    followers: 1250,
    following: 340,
    createdAt: new Date("2023-01-15").toISOString(),
  },
  {
    id: "user-2",
    name: "David Kim",
    username: "davidkim",
    email: "david@example.com",
    avatar: "/man-runner.png",
    bio: "UI/UX Designer & fitness enthusiast",
    location: "New York, NY",
    website: "https://davidkim.design",
    posts: 32,
    followers: 890,
    following: 210,
    createdAt: new Date("2023-02-20").toISOString(),
  },
  {
    id: "user-3",
    name: "Sofia Rodriguez",
    username: "sofiarodriguez",
    email: "sofia@example.com",
    avatar: "/woman-designer.png",
    bio: "Creative designer and art director",
    location: "Barcelona, Spain",
    website: "https://sofiarodriguez.art",
    posts: 67,
    followers: 2100,
    following: 180,
    createdAt: new Date("2023-01-10").toISOString(),
  },
  {
    id: "current-user",
    name: "Current User",
    username: "currentuser",
    email: "current@example.com",
    avatar: "/diverse-user-avatars.png",
    bio: "Social media enthusiast",
    location: "Online",
    website: "",
    posts: 0,
    followers: 0,
    following: 0,
    createdAt: new Date().toISOString(),
  },
];

export const mockPosts = [
  {
    id: "post-1",
    content:
      "Just finished building this amazing social media feed! 🚀 #webdev #react #nextjs",
    authorId: "user-1",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    likes: 12,
    comments: 3,
    shares: 2,
    isLiked: false,
    isBookmarked: false,
    media: null,
  },
  {
    id: "post-2",
    content:
      "Beautiful sunset today! Nature never fails to amaze me 🌅 #nature #photography",
    authorId: "user-2",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    likes: 8,
    comments: 1,
    shares: 0,
    isLiked: true,
    isBookmarked: false,
    media: {
      type: "IMAGE",
      url: "/serene-sunrise-landscape.png",
      thumbnail: "/serene-sunrise-landscape.png",
    },
  },
  {
    id: "post-3",
    content:
      "Working on some new design concepts. What do you think? #design #creativity",
    authorId: "user-3",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
    likes: 15,
    comments: 5,
    shares: 1,
    isLiked: false,
    isBookmarked: true,
    media: null,
  },
  {
    id: "post-4",
    content:
      "Just completed my morning run! Feeling energized and ready to tackle the day 💪 #fitness #motivation",
    authorId: "user-2",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
    likes: 6,
    comments: 2,
    shares: 0,
    isLiked: false,
    isBookmarked: false,
    media: null,
  },
  {
    id: "post-5",
    content:
      "New TypeScript features are game-changing! The type system keeps getting better 🎯 #typescript #programming",
    authorId: "user-1",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
    likes: 20,
    comments: 7,
    shares: 3,
    isLiked: true,
    isBookmarked: false,
    media: null,
  },
];

export const mockComments = [
  {
    id: "comment-1",
    content: "This looks amazing! Great work on the implementation 🎉",
    authorId: "user-2",
    postId: "post-1",
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 minutes ago
    likes: 2,
    isLiked: false,
  },
  {
    id: "comment-2",
    content:
      "Love the real-time updates feature! How did you implement the WebSocket connection?",
    authorId: "user-3",
    postId: "post-1",
    createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(), // 20 minutes ago
    likes: 1,
    isLiked: true,
  },
  {
    id: "comment-3",
    content: "Stunning photo! The colors are so vibrant 📸",
    authorId: "user-1",
    postId: "post-2",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1.5).toISOString(), // 1.5 hours ago
    likes: 0,
    isLiked: false,
  },
];

export const mockTrendingTopics = [
  {
    id: "webdevelopment",
    hashtag: "WebDevelopment",
    posts: 1234,
    trend: "UP" as const,
  },
  {
    id: "reactjs",
    hashtag: "ReactJS",
    posts: 987,
    trend: "UP" as const,
  },
  {
    id: "typescript",
    hashtag: "TypeScript",
    posts: 756,
    trend: "STABLE" as const,
  },
  {
    id: "nextjs",
    hashtag: "NextJS",
    posts: 543,
    trend: "UP" as const,
  },
  {
    id: "tailwindcss",
    hashtag: "TailwindCSS",
    posts: 432,
    trend: "STABLE" as const,
  },
];

// Helper functions to get mock data
export function getMockUser(id: string) {
  return mockUsers.find((user) => user.id === id) || mockUsers[3]; // fallback to current user
}

export function getMockUserByUsername(username: string) {
  return mockUsers.find((user) => user.username === username) || mockUsers[3];
}

export function getMockPosts(first: number = 10, after?: string) {
  let posts = [...mockPosts];

  if (after) {
    const afterIndex = posts.findIndex((post) => post.id === after);
    if (afterIndex !== -1) {
      posts = posts.slice(afterIndex + 1);
    }
  }

  return posts.slice(0, first);
}

export function getMockPost(id: string) {
  return mockPosts.find((post) => post.id === id) || null;
}

export function getMockComments(postId: string, first: number = 20) {
  return mockComments
    .filter((comment) => comment.postId === postId)
    .slice(0, first);
}

export function getMockUserPosts(
  userId: string,
  first: number = 10,
  after?: string
) {
  let posts = mockPosts.filter((post) => post.authorId === userId);

  if (after) {
    const afterIndex = posts.findIndex((post) => post.id === after);
    if (afterIndex !== -1) {
      posts = posts.slice(afterIndex + 1);
    }
  }

  return posts.slice(0, first);
}

export function searchMockUsers(query: string, first: number = 10) {
  const lowercaseQuery = query.toLowerCase();
  return mockUsers
    .filter(
      (user) =>
        user.name.toLowerCase().includes(lowercaseQuery) ||
        user.username.toLowerCase().includes(lowercaseQuery)
    )
    .slice(0, first);
}

export function searchMockPosts(query: string, first: number = 10) {
  const lowercaseQuery = query.toLowerCase();
  return mockPosts
    .filter((post) => post.content.toLowerCase().includes(lowercaseQuery))
    .slice(0, first);
}


