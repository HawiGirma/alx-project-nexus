export interface Post {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  createdAt: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  media?: {
    type: "image" | "video";
    url: string;
    thumbnail?: string;
  };
}

export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio?: string;
  followers: number;
  following: number;
  posts: number;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: string;
  likes: number;
  isLiked: boolean;
}

export { apolloClient, getClient } from "./graphql/apollo-client";
export { ApolloProvider } from "./graphql/apollo-provider";

export { GET_POSTS, GET_POST, GET_COMMENTS } from "./graphql/queries/posts";
export {
  LIKE_POST,
  UNLIKE_POST,
  CREATE_POST,
  SHARE_POST,
  CREATE_COMMENT,
} from "./graphql/mutations/posts";
export {
  POST_ADDED,
  POST_LIKED,
  COMMENT_ADDED,
} from "./graphql/subscriptions/posts";

export const mockPosts: Post[] = [
  {
    id: "1",
    content:
      "Just launched my new project! Excited to share it with the community 🚀",
    author: {
      id: "1",
      name: "Sarah Chen",
      username: "sarahchen",
      avatar: "/woman-developer.png",
    },
    createdAt: "2024-01-15T10:30:00Z",
    likes: 124,
    comments: 23,
    shares: 8,
    isLiked: false,
    media: {
      type: "image",
      url: "/modern-app-interface.png",
    },
  },
  {
    id: "2",
    content:
      "Beautiful sunset from my morning run. Nature never fails to inspire! 🌅",
    author: {
      id: "2",
      name: "Alex Rivera",
      username: "alexrivera",
      avatar: "/man-runner.png",
    },
    createdAt: "2024-01-15T08:15:00Z",
    likes: 89,
    comments: 12,
    shares: 5,
    isLiked: true,
    media: {
      type: "image",
      url: "/serene-sunrise-landscape.png",
    },
  },
  {
    id: "3",
    content:
      "Working on some exciting new features. Can't wait to show you what we've been building!",
    author: {
      id: "3",
      name: "Maya Patel",
      username: "mayapatel",
      avatar: "/woman-designer.png",
    },
    createdAt: "2024-01-14T16:45:00Z",
    likes: 67,
    comments: 18,
    shares: 3,
    isLiked: false,
  },
  {
    id: "4",
    content:
      "Coffee and code - the perfect combination for a productive morning! ☕",
    author: {
      id: "4",
      name: "Tom Wilson",
      username: "tomwilson",
      avatar: "/diverse-user-avatars.png",
    },
    createdAt: "2024-01-14T09:20:00Z",
    likes: 45,
    comments: 8,
    shares: 2,
    isLiked: false,
  },
  {
    id: "5",
    content:
      "Amazing conference today! So many inspiring talks about the future of web development.",
    author: {
      id: "5",
      name: "Lisa Park",
      username: "lisapark",
      avatar: "/woman-developer.png",
    },
    createdAt: "2024-01-13T15:30:00Z",
    likes: 156,
    comments: 34,
    shares: 12,
    isLiked: true,
  },
  {
    id: "6",
    content:
      "Just finished reading an incredible book on design systems. Highly recommend it!",
    author: {
      id: "6",
      name: "Marcus Johnson",
      username: "marcusj",
      avatar: "/man-runner.png",
    },
    createdAt: "2024-01-13T11:45:00Z",
    likes: 78,
    comments: 15,
    shares: 6,
    isLiked: false,
  },
  {
    id: "7",
    content:
      "Weekend project: Built a small weather app with React and TypeScript. Learning never stops!",
    author: {
      id: "7",
      name: "Anna Schmidt",
      username: "annaschmidt",
      avatar: "/woman-designer.png",
    },
    createdAt: "2024-01-12T14:20:00Z",
    likes: 92,
    comments: 21,
    shares: 9,
    isLiked: false,
    media: {
      type: "image",
      url: "/modern-app-interface.png",
    },
  },
  {
    id: "8",
    content:
      "The new CSS features are absolutely game-changing! Container queries are finally here.",
    author: {
      id: "8",
      name: "Carlos Rodriguez",
      username: "carlosr",
      avatar: "/diverse-user-avatars.png",
    },
    createdAt: "2024-01-12T10:15:00Z",
    likes: 134,
    comments: 28,
    shares: 15,
    isLiked: true,
  },
];

export class GraphQLClient {
  private mockPosts: Post[] = mockPosts;

  async fetchPosts(limit = 10, offset = 0): Promise<Post[]> {
    console.warn(
      "Using legacy mock client. Consider migrating to Apollo Client with useQuery hook."
    );

    await new Promise((resolve) => setTimeout(resolve, 800));

    if (Math.random() < 0.1) {
      throw new Error("Network error occurred");
    }

    const posts = this.mockPosts.slice(offset, offset + limit);

    if (posts.length < limit && offset + limit <= 50) {
      const additionalPosts = Array.from(
        { length: limit - posts.length },
        (_, index) => ({
          id: `generated-${offset + posts.length + index}`,
          content: `This is a generated post #${
            offset + posts.length + index + 1
          }. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
          author: {
            id: `user-${((offset + posts.length + index) % 4) + 1}`,
            name: ["John Doe", "Jane Smith", "Bob Johnson", "Alice Brown"][
              (offset + posts.length + index) % 4
            ],
            username: ["johndoe", "janesmith", "bobjohnson", "alicebrown"][
              (offset + posts.length + index) % 4
            ],
            avatar: [
              "/diverse-user-avatars.png",
              "/woman-developer.png",
              "/man-runner.png",
              "/woman-designer.png",
            ][(offset + posts.length + index) % 4],
          },
          createdAt: new Date(
            Date.now() - (offset + posts.length + index) * 3600000
          ).toISOString(),
          likes: Math.floor(Math.random() * 200),
          comments: Math.floor(Math.random() * 50),
          shares: Math.floor(Math.random() * 20),
          isLiked: Math.random() > 0.7,
        })
      );
      posts.push(...additionalPosts);
    }

    return posts;
  }

  async likePost(postId: string): Promise<boolean> {
    console.warn(
      "Using legacy mock client. Consider migrating to Apollo Client with useMutation hook."
    );

    await new Promise((resolve) => setTimeout(resolve, 200));

    const post = this.mockPosts.find((p) => p.id === postId);
    if (post) {
      post.isLiked = !post.isLiked;
      post.likes += post.isLiked ? 1 : -1;
      return post.isLiked;
    }
    return false;
  }

  async addComment(postId: string, content: string): Promise<Comment> {
    console.warn(
      "Using legacy mock client. Consider migrating to Apollo Client with useMutation hook."
    );

    await new Promise((resolve) => setTimeout(resolve, 300));

    const post = this.mockPosts.find((p) => p.id === postId);
    if (post) {
      post.comments += 1;
    }

    return {
      id: Date.now().toString(),
      content,
      author: {
        id: "current-user",
        name: "You",
        username: "you",
        avatar: "/diverse-user-avatars.png",
        bio: "",
        followers: 0,
        following: 0,
        posts: 0,
      },
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
    };
  }

  async sharePost(postId: string): Promise<boolean> {
    console.warn(
      "Using legacy mock client. Consider migrating to Apollo Client with useMutation hook."
    );

    await new Promise((resolve) => setTimeout(resolve, 200));

    const post = this.mockPosts.find((p) => p.id === postId);
    if (post) {
      post.shares += 1;
      return true;
    }
    return false;
  }
}

export const graphqlClient = new GraphQLClient();
