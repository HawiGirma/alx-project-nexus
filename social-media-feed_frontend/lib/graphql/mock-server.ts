// Mock GraphQL server for development - replace with real backend
import { mockPosts, type Post, type Comment, type User } from "@/lib/graphql"

class MockGraphQLServer {
  private posts: Post[] = [...mockPosts]
  private comments: Comment[] = []
  private users: User[] = [
    {
      id: "current-user",
      name: "You",
      username: "you",
      avatar: "/diverse-user-avatars.png",
      bio: "Social media enthusiast",
      followers: 42,
      following: 128,
      posts: 15,
    },
  ]

  // Simulate network delay
  private async delay(ms = 300) {
    await new Promise((resolve) => setTimeout(resolve, ms))
  }

  async getPosts(
    first = 10,
    after?: string,
  ): Promise<{
    edges: Array<{ node: Post; cursor: string }>
    pageInfo: {
      hasNextPage: boolean
      hasPreviousPage: boolean
      startCursor?: string
      endCursor?: string
    }
  }> {
    await this.delay()

    const startIndex = after ? this.posts.findIndex((p) => p.id === after) + 1 : 0
    const endIndex = Math.min(startIndex + first, this.posts.length)
    const selectedPosts = this.posts.slice(startIndex, endIndex)

    return {
      edges: selectedPosts.map((post) => ({
        node: post,
        cursor: post.id,
      })),
      pageInfo: {
        hasNextPage: endIndex < this.posts.length,
        hasPreviousPage: startIndex > 0,
        startCursor: selectedPosts[0]?.id,
        endCursor: selectedPosts[selectedPosts.length - 1]?.id,
      },
    }
  }

  async likePost(postId: string): Promise<Post> {
    await this.delay(200)

    const post = this.posts.find((p) => p.id === postId)
    if (!post) throw new Error("Post not found")

    post.isLiked = true
    post.likes += 1

    return post
  }

  async unlikePost(postId: string): Promise<Post> {
    await this.delay(200)

    const post = this.posts.find((p) => p.id === postId)
    if (!post) throw new Error("Post not found")

    post.isLiked = false
    post.likes = Math.max(0, post.likes - 1)

    return post
  }

  async sharePost(postId: string): Promise<Post> {
    await this.delay(200)

    const post = this.posts.find((p) => p.id === postId)
    if (!post) throw new Error("Post not found")

    post.shares += 1

    return post
  }

  async createPost(content: string, mediaUrl?: string, mediaType?: "IMAGE" | "VIDEO"): Promise<Post> {
    await this.delay(500)

    const newPost: Post = {
      id: `post-${Date.now()}`,
      content,
      author: this.users[0], // Current user
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      media: mediaUrl
        ? {
            type: (mediaType?.toLowerCase() as "image" | "video") || "image",
            url: mediaUrl,
          }
        : undefined,
    }

    this.posts.unshift(newPost)
    return newPost
  }

  async getComments(postId: string, first = 20): Promise<Comment[]> {
    await this.delay()

    return this.comments
      .filter((c) => c.author.id === postId) // Mock relationship
      .slice(0, first)
  }

  async createComment(postId: string, content: string): Promise<Comment> {
    await this.delay(300)

    const post = this.posts.find((p) => p.id === postId)
    if (!post) throw new Error("Post not found")

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      content,
      author: this.users[0], // Current user
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
    }

    this.comments.unshift(newComment)
    post.comments += 1

    return newComment
  }
}

export const mockGraphQLServer = new MockGraphQLServer()
