// GraphQL Test Script
// This script tests all GraphQL operations to ensure they're working correctly

const GRAPHQL_ENDPOINT = "http://localhost:3000/api/graphql";

async function testGraphQL() {
  console.log("🚀 Starting GraphQL Tests...\n");

  // Test 1: Get Posts Query
  console.log("1. Testing GET_POSTS query...");
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query GetPosts($first: Int) {
            posts(first: $first) {
              edges {
                node {
                  id
                  content
                  author {
                    id
                    name
                    username
                    avatar
                  }
                  createdAt
                  likes
                  comments
                  shares
                  isLiked
                  media {
                    type
                    url
                    thumbnail
                  }
                }
                cursor
              }
              pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
              }
            }
          }
        `,
        variables: { first: 5 },
      }),
    });

    const data = await response.json();
    if (data.errors) {
      console.error("❌ GET_POSTS failed:", data.errors);
    } else {
      console.log(
        "✅ GET_POSTS successful:",
        data.data.posts.edges.length,
        "posts loaded"
      );
    }
  } catch (error) {
    console.error("❌ GET_POSTS error:", error.message);
  }

  // Test 2: Create Post Mutation
  console.log("\n2. Testing CREATE_POST mutation...");
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          mutation CreatePost($content: String!) {
            createPost(content: $content) {
              id
              content
              author {
                id
                name
                username
              }
              createdAt
              likes
              comments
              shares
              isLiked
            }
          }
        `,
        variables: {
          content: `Test post created at ${new Date().toISOString()}`,
        },
      }),
    });

    const data = await response.json();
    if (data.errors) {
      console.error("❌ CREATE_POST failed:", data.errors);
    } else {
      console.log("✅ CREATE_POST successful:", data.data.createPost.id);
    }
  } catch (error) {
    console.error("❌ CREATE_POST error:", error.message);
  }

  // Test 3: Like Post Mutation
  console.log("\n3. Testing LIKE_POST mutation...");
  try {
    // First get a post to like
    const postsResponse = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query GetPosts($first: Int) {
            posts(first: $first) {
              edges {
                node {
                  id
                }
              }
            }
          }
        `,
        variables: { first: 1 },
      }),
    });

    const postsData = await postsResponse.json();
    if (postsData.data?.posts?.edges?.length > 0) {
      const postId = postsData.data.posts.edges[0].node.id;

      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            mutation LikePost($postId: ID!) {
              likePost(postId: $postId) {
                id
                likes
                isLiked
              }
            }
          `,
          variables: { postId },
        }),
      });

      const data = await response.json();
      if (data.errors) {
        console.error("❌ LIKE_POST failed:", data.errors);
      } else {
        console.log(
          "✅ LIKE_POST successful:",
          data.data.likePost.isLiked ? "Liked" : "Unliked"
        );
      }
    } else {
      console.log("⚠️  No posts available to like");
    }
  } catch (error) {
    console.error("❌ LIKE_POST error:", error.message);
  }

  // Test 4: Get Comments Query
  console.log("\n4. Testing GET_COMMENTS query...");
  try {
    // First get a post to get comments for
    const postsResponse = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query GetPosts($first: Int) {
            posts(first: $first) {
              edges {
                node {
                  id
                }
              }
            }
          }
        `,
        variables: { first: 1 },
      }),
    });

    const postsData = await postsResponse.json();
    if (postsData.data?.posts?.edges?.length > 0) {
      const postId = postsData.data.posts.edges[0].node.id;

      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            query GetComments($postId: ID!) {
              comments(postId: $postId) {
                id
                content
                author {
                  id
                  name
                  username
                }
                createdAt
                likes
                isLiked
              }
            }
          `,
          variables: { postId },
        }),
      });

      const data = await response.json();
      if (data.errors) {
        console.error("❌ GET_COMMENTS failed:", data.errors);
      } else {
        console.log(
          "✅ GET_COMMENTS successful:",
          data.data.comments.length,
          "comments found"
        );
      }
    } else {
      console.log("⚠️  No posts available to get comments for");
    }
  } catch (error) {
    console.error("❌ GET_COMMENTS error:", error.message);
  }

  // Test 5: Create Comment Mutation
  console.log("\n5. Testing CREATE_COMMENT mutation...");
  try {
    // First get a post to comment on
    const postsResponse = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query GetPosts($first: Int) {
            posts(first: $first) {
              edges {
                node {
                  id
                }
              }
            }
          }
        `,
        variables: { first: 1 },
      }),
    });

    const postsData = await postsResponse.json();
    if (postsData.data?.posts?.edges?.length > 0) {
      const postId = postsData.data.posts.edges[0].node.id;

      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            mutation CreateComment($postId: ID!, $content: String!) {
              createComment(postId: $postId, content: $content) {
                id
                content
                author {
                  id
                  name
                  username
                }
                createdAt
                likes
                isLiked
              }
            }
          `,
          variables: {
            postId,
            content: `Test comment created at ${new Date().toISOString()}`,
          },
        }),
      });

      const data = await response.json();
      if (data.errors) {
        console.error("❌ CREATE_COMMENT failed:", data.errors);
      } else {
        console.log(
          "✅ CREATE_COMMENT successful:",
          data.data.createComment.id
        );
      }
    } else {
      console.log("⚠️  No posts available to comment on");
    }
  } catch (error) {
    console.error("❌ CREATE_COMMENT error:", error.message);
  }

  console.log("\n🎉 GraphQL Tests Completed!");
  console.log("\nTo run these tests manually:");
  console.log("1. Make sure the dev server is running: npm run dev");
  console.log("2. Run this script: node scripts/test-graphql.js");
  console.log("3. Visit http://localhost:3000/graphql-test to see the UI");
}

// Run the tests
testGraphQL().catch(console.error);
