// Mock database implementation for development
// Replace with actual Prisma setup when database is configured

// Sample mock data
const mockPosts = [
  {
    id: "1",
    content: "Just finished building this amazing social media feed! 🚀 #webdev #react #nextjs",
    authorId: "user-1",
    createdAt: new Date(),
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
    content: "Beautiful sunset today! Nature never fails to amaze me 🌅 #nature #photography",
    authorId: "user-2",
    createdAt: new Date(Date.now() - 3600000),
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
    content: "Working on some new design concepts. What do you think? #design #creativity",
    authorId: "user-3",
    createdAt: new Date(Date.now() - 7200000),
    author: {
      id: "user-3",
      name: "Sofia Rodriguez",
      username: "sofiarodriguez",
      avatar: "/woman-designer.png",
    },
    media: null,
    _count: { likes: 35, comments: 12, shares: 7 },
  },
];

export const prisma = {
  // Mock database methods
  post: {
    findMany: async (args?: any) => {
      console.log("Mock posts query:", args);
      return mockPosts;
    },
    findUnique: async (args?: any) => {
      console.log("Mock post query:", args);
      return mockPosts.find(p => p.id === args.where.id) || null;
    },
    create: async (args?: any) => {
      console.log("Mock post create:", args);
      return { id: Date.now().toString(), ...args.data };
    },
    update: async (args?: any) => {
      console.log("Mock post update:", args);
      return { id: args.where.id, ...args.data };
    },
    delete: async (args?: any) => {
      console.log("Mock post delete:", args);
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
      return users.find(u => u.id === args.where.id || u.username === args.where.username) || null;
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
    findMany: async () => [],
    findUnique: async () => null,
    create: async () => ({}),
    update: async () => ({}),
    delete: async () => ({}),
  },
  postLike: {
    findMany: async () => [],
    findUnique: async () => null,
    create: async () => ({}),
    update: async () => ({}),
    delete: async () => ({}),
    deleteMany: async () => ({}),
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
