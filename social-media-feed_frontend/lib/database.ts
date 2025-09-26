// Mock database implementation for development
// Replace with actual Prisma setup when database is configured

// Sample mock data with proper dates and more posts
const mockPosts = [
  {
    id: "1",
    content:
      "Just finished building this amazing social media feed! 🚀 #webdev #react #nextjs",
    authorId: "user-1",
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    author: {
      id: "user-1",
      name: "Emma Wilson",
      username: "emmawilson",
      avatar: "/woman-developer.png",
    },
    media: null,
    _count: { likes: 42, comments: 8, shares: 12 },
  },
  {
    id: "2",
    content:
      "Beautiful sunset today! Nature never fails to amaze me 🌅 #nature #photography",
    authorId: "user-2",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    author: {
      id: "user-2",
      name: "David Kim",
      username: "davidkim",
      avatar: "/man-runner.png",
    },
    media: {
      type: "IMAGE",
      url: "/serene-sunrise-landscape.png",
      thumbnail: "/serene-sunrise-landscape.png",
    },
    _count: { likes: 28, comments: 5, shares: 3 },
  },
  {
    id: "3",
    content:
      "Working on some new design concepts. What do you think? #design #creativity",
    authorId: "user-3",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    author: {
      id: "user-3",
      name: "Sofia Rodriguez",
      username: "sofiarodriguez",
      avatar: "/woman-designer.png",
    },
    media: null,
    _count: { likes: 35, comments: 12, shares: 7 },
  },
  {
    id: "4",
    content:
      "Just completed my morning run! Feeling energized and ready to tackle the day 💪 #fitness #motivation",
    authorId: "user-2",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    author: {
      id: "user-2",
      name: "David Kim",
      username: "davidkim",
      avatar: "/man-runner.png",
    },
    media: null,
    _count: { likes: 19, comments: 3, shares: 2 },
  },
  {
    id: "5",
    content:
      "New TypeScript features are game-changing! The type system keeps getting better 🎯 #typescript #programming",
    authorId: "user-1",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    author: {
      id: "user-1",
      name: "Emma Wilson",
      username: "emmawilson",
      avatar: "/woman-developer.png",
    },
    media: null,
    _count: { likes: 67, comments: 15, shares: 9 },
  },
];

// Mock comments data
const mockComments = [
  {
    id: "comment-1",
    content: "This looks amazing! Great work on the implementation 🎉",
    postId: "1",
    authorId: "user-2",
    createdAt: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
    author: {
      id: "user-2",
      name: "David Kim",
      username: "davidkim",
      avatar: "/man-runner.png",
    },
    _count: { likes: 5 },
  },
  {
    id: "comment-2",
    content: "Love the real-time updates feature! How did you implement the WebSocket connection?",
    postId: "1",
    authorId: "user-3",
    createdAt: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
    author: {
      id: "user-3",
      name: "Sofia Rodriguez",
      username: "sofiarodriguez",
      avatar: "/woman-designer.png",
    },
    _count: { likes: 3 },
  },
  {
    id: "comment-3",
    content: "Stunning photo! The colors are so vibrant 📸",
    postId: "2",
    authorId: "user-1",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1.5), // 1.5 hours ago
    author: {
      id: "user-1",
      name: "Emma Wilson",
      username: "emmawilson",
      avatar: "/woman-developer.png",
    },
    _count: { likes: 2 },
  },
];

// Mock likes data
const mockLikes = [
  { id: "like-1", postId: "1", userId: "user-2" },
  { id: "like-2", postId: "1", userId: "user-3" },
  { id: "like-3", postId: "2", userId: "user-1" },
  { id: "like-4", postId: "2", userId: "user-3" },
  { id: "like-5", postId: "3", userId: "user-1" },
  { id: "like-6", postId: "3", userId: "user-2" },
];

export const prisma = {
  // Mock database methods
  post: {
    findMany: async (args?: any) => {
      console.log("Mock posts query:", args);
      let posts = [...mockPosts];
      
      // Apply pagination
      if (args?.take) {
        posts = posts.slice(0, args.take);
      }
      
      // Apply cursor-based pagination
      if (args?.cursor?.id) {
        const cursorIndex = posts.findIndex(p => p.id === args.cursor.id);
        if (cursorIndex > -1) {
          posts = posts.slice(cursorIndex + 1);
        }
      }
      
      // Apply skip
      if (args?.skip) {
        posts = posts.slice(args.skip);
      }
      
      return posts;
    },
    findUnique: async (args?: any) => {
      console.log("Mock post query:", args);
      return mockPosts.find((p) => p.id === args.where.id) || null;
    },
    create: async (args?: any) => {
      console.log("Mock post create:", args);
      const newPost = {
        id: `post-${Date.now()}`,
        content: args.data.content,
        authorId: args.data.authorId,
        createdAt: new Date(),
        author: {
          id: args.data.authorId,
          name: "Current User",
          username: "currentuser",
          avatar: "/diverse-user-avatars.png",
        },
        media: args.data.media || null,
        _count: { likes: 0, comments: 0, shares: 0 },
      };
      mockPosts.unshift(newPost); // Add to beginning for newest first
      return newPost;
    },
    update: async (args?: any) => {
      console.log("Mock post update:", args);
      const index = mockPosts.findIndex(p => p.id === args.where.id);
      if (index > -1) {
        mockPosts[index] = { ...mockPosts[index], ...args.data };
        return mockPosts[index];
      }
      return { id: args.where.id, ...args.data };
    },
    delete: async (args?: any) => {
      console.log("Mock post delete:", args);
      const index = mockPosts.findIndex(p => p.id === args.where.id);
      if (index > -1) {
        mockPosts.splice(index, 1);
      }
      return { id: args.where.id };
    },
  },
  user: {
    findMany: async () => [
      {
        id: "user-1",
        name: "Emma Wilson",
        username: "emmawilson",
        avatar: "/woman-developer.png",
        bio: "Full-stack developer passionate about React and Node.js",
        _count: { authoredPosts: 45 },
      },
      {
        id: "user-2",
        name: "David Kim",
        username: "davidkim",
        avatar: "/man-runner.png",
        bio: "UI/UX Designer & fitness enthusiast",
        _count: { authoredPosts: 32 },
      },
    ],
    findUnique: async (args?: any) => {
      const users = [
        {
          id: "user-1",
          name: "Emma Wilson",
          username: "emmawilson",
          avatar: "/woman-developer.png",
          bio: "Full-stack developer passionate about React and Node.js",
          _count: { authoredPosts: 45 },
        },
        {
          id: "user-2",
          name: "David Kim",
          username: "davidkim",
          avatar: "/man-runner.png",
          bio: "UI/UX Designer & fitness enthusiast",
          _count: { authoredPosts: 32 },
        },
      ];
      return (
        users.find(
          (u) => u.id === args.where.id || u.username === args.where.username
        ) || null
      );
    },
    create: async (args?: any) => {
      console.log("Mock user create:", args);
      return { id: Date.now().toString(), ...args.data };
    },
    update: async (args?: any) => {
      console.log("Mock user update:", args);
      return { id: args.where.id, ...args.data };
    },
    delete: async (args?: any) => {
      console.log("Mock user delete:", args);
      return { id: args.where.id };
    },
  },
  comment: {
    findMany: async (args?: any) => {
      console.log("Mock comments query:", args);
      if (args?.where?.postId) {
        return mockComments.filter(c => c.postId === args.where.postId);
      }
      return mockComments;
    },
    findUnique: async (args?: any) => {
      console.log("Mock comment query:", args);
      return mockComments.find(c => c.id === args.where.id) || null;
    },
    create: async (args?: any) => {
      console.log("Mock comment create:", args);
      const newComment = {
        id: `comment-${Date.now()}`,
        content: args.data.content,
        postId: args.data.postId,
        authorId: args.data.authorId,
        createdAt: new Date(),
        author: {
          id: args.data.authorId,
          name: "Current User",
          username: "currentuser",
          avatar: "/diverse-user-avatars.png",
        },
        _count: { likes: 0 },
      };
      mockComments.push(newComment);
      return newComment;
    },
    update: async (args?: any) => {
      console.log("Mock comment update:", args);
      return { id: args.where.id, ...args.data };
    },
    delete: async (args?: any) => {
      console.log("Mock comment delete:", args);
      const index = mockComments.findIndex(c => c.id === args.where.id);
      if (index > -1) {
        mockComments.splice(index, 1);
      }
      return { id: args.where.id };
    },
  },
  postLike: {
    findMany: async (args?: any) => {
      console.log("Mock post likes query:", args);
      if (args?.where?.postId) {
        return mockLikes.filter(l => l.postId === args.where.postId);
      }
      return mockLikes;
    },
    findUnique: async (args?: any) => {
      console.log("Mock post like query:", args);
      if (args?.where?.userId_postId) {
        return mockLikes.find(l => 
          l.userId === args.where.userId_postId.userId && 
          l.postId === args.where.userId_postId.postId
        ) || null;
      }
      return null;
    },
    create: async (args?: any) => {
      console.log("Mock post like create:", args);
      const newLike = {
        id: `like-${Date.now()}`,
        postId: args.data.postId,
        userId: args.data.userId,
      };
      mockLikes.push(newLike);
      return newLike;
    },
    update: async (args?: any) => {
      console.log("Mock post like update:", args);
      return { id: args.where.id, ...args.data };
    },
    delete: async (args?: any) => {
      console.log("Mock post like delete:", args);
      if (args?.where?.userId_postId) {
        const index = mockLikes.findIndex(l => 
          l.userId === args.where.userId_postId.userId && 
          l.postId === args.where.userId_postId.postId
        );
        if (index > -1) {
          mockLikes.splice(index, 1);
        }
      }
      return { id: args.where.id };
    },
    deleteMany: async (args?: any) => {
      console.log("Mock post like deleteMany:", args);
      if (args?.where?.userId && args?.where?.postId) {
        const index = mockLikes.findIndex(l => 
          l.userId === args.where.userId && l.postId === args.where.postId
        );
        if (index > -1) {
          mockLikes.splice(index, 1);
        }
      }
      return { count: 1 };
    },
  },
  commentLike: {
    findMany: async () => [],
    findUnique: async () => null,
    create: async () => ({}),
    update: async () => ({}),
    delete: async () => ({}),
    deleteMany: async () => ({}),
  },
  bookmark: {
    findMany: async () => [],
    findUnique: async () => null,
    create: async () => ({}),
    update: async () => ({}),
    delete: async () => ({}),
    deleteMany: async () => ({}),
  },
  follow: {
    findMany: async () => [],
    findUnique: async () => null,
    create: async () => ({}),
    update: async () => ({}),
    delete: async () => ({}),
    deleteMany: async () => ({}),
  },
  postShare: {
    findMany: async () => [],
    findUnique: async () => null,
    create: async () => ({}),
    update: async () => ({}),
    delete: async () => ({}),
    deleteMany: async () => ({}),
  },
  $disconnect: async () => {},
};
