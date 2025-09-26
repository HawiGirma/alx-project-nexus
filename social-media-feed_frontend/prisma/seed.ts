import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create users
  const user1 = await prisma.user.upsert({
    where: { username: "emmawilson" },
    update: {},
    create: {
      name: "Emma Wilson",
      username: "emmawilson",
      email: "emma@example.com",
      avatar: "/woman-developer.png",
      bio: "Full-stack developer passionate about React and Node.js",
      posts: 45,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { username: "davidkim" },
    update: {},
    create: {
      name: "David Kim",
      username: "davidkim",
      email: "david@example.com",
      avatar: "/man-runner.png",
      bio: "UI/UX Designer & fitness enthusiast",
      posts: 32,
    },
  });

  const user3 = await prisma.user.upsert({
    where: { username: "sofiarodriguez" },
    update: {},
    create: {
      name: "Sofia Rodriguez",
      username: "sofiarodriguez",
      email: "sofia@example.com",
      avatar: "/woman-designer.png",
      bio: "Creative designer and art director",
      posts: 67,
    },
  });

  // Create current user
  const currentUser = await prisma.user.upsert({
    where: { username: "currentuser" },
    update: {},
    create: {
      name: "Current User",
      username: "currentuser",
      email: "current@example.com",
      avatar: "/diverse-user-avatars.png",
      bio: "Social media enthusiast",
      posts: 0,
    },
  });

  // Create posts
  const post1 = await prisma.post.upsert({
    where: { id: "post-1" },
    update: {},
    create: {
      id: "post-1",
      content:
        "Just finished building this amazing social media feed! 🚀 #webdev #react #nextjs",
      authorId: user1.id,
      createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    },
  });

  const post2 = await prisma.post.upsert({
    where: { id: "post-2" },
    update: {},
    create: {
      id: "post-2",
      content:
        "Beautiful sunset today! Nature never fails to amaze me 🌅 #nature #photography",
      authorId: user2.id,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
  });

  const post3 = await prisma.post.upsert({
    where: { id: "post-3" },
    update: {},
    create: {
      id: "post-3",
      content:
        "Working on some new design concepts. What do you think? #design #creativity",
      authorId: user3.id,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    },
  });

  const post4 = await prisma.post.upsert({
    where: { id: "post-4" },
    update: {},
    create: {
      id: "post-4",
      content:
        "Just completed my morning run! Feeling energized and ready to tackle the day 💪 #fitness #motivation",
      authorId: user2.id,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    },
  });

  const post5 = await prisma.post.upsert({
    where: { id: "post-5" },
    update: {},
    create: {
      id: "post-5",
      content:
        "New TypeScript features are game-changing! The type system keeps getting better 🎯 #typescript #programming",
      authorId: user1.id,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    },
  });

  // Create media for post 2
  await prisma.media.upsert({
    where: { id: "media-1" },
    update: {},
    create: {
      id: "media-1",
      type: "IMAGE",
      url: "/serene-sunrise-landscape.png",
      thumbnail: "/serene-sunrise-landscape.png",
      postId: post2.id,
    },
  });

  // Create some likes
  try {
    await prisma.postLike.createMany({
      data: [
        { userId: user2.id, postId: post1.id },
        { userId: user3.id, postId: post1.id },
        { userId: user1.id, postId: post2.id },
        { userId: user3.id, postId: post2.id },
        { userId: user1.id, postId: post3.id },
        { userId: user2.id, postId: post3.id },
      ],
    });
  } catch (error) {
    // Ignore duplicate key errors
    console.log("Some likes already exist, skipping...");
  }

  // Create some comments
  const comment1 = await prisma.comment.create({
    data: {
      content: "This looks amazing! Great work on the implementation 🎉",
      authorId: user2.id,
      postId: post1.id,
      createdAt: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
    },
  });

  const comment2 = await prisma.comment.create({
    data: {
      content:
        "Love the real-time updates feature! How did you implement the WebSocket connection?",
      authorId: user3.id,
      postId: post1.id,
      createdAt: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
    },
  });

  const comment3 = await prisma.comment.create({
    data: {
      content: "Stunning photo! The colors are so vibrant 📸",
      authorId: user1.id,
      postId: post2.id,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1.5), // 1.5 hours ago
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
