import { gql } from "@apollo/client";

export const GET_POSTS = gql`
  query GetPosts($first: Int, $after: String) {
    posts(first: $first, after: $after) {
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
          isBookmarked
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
`;

export const GET_POST = gql`
  query GetPost($id: ID!) {
    post(id: $id) {
      id
      content
      author {
        id
        name
        username
        avatar
        bio
        followers
        following
        posts
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
  }
`;

export const GET_COMMENTS = gql`
  query GetComments($postId: ID!, $first: Int, $after: String) {
    comments(postId: $postId, first: $first, after: $after) {
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
      isLiked
    }
  }
`;

export const GET_USER_BY_USERNAME = gql`
  query GetUserByUsername($username: String!) {
    userByUsername(username: $username) {
      id
      name
      username
      avatar
      bio
      followers
      following
      posts
      createdAt
    }
  }
`;

export const SEARCH_USERS = gql`
  query SearchUsers($query: String!, $first: Int) {
    searchUsers(query: $query, first: $first) {
      id
      name
      username
      avatar
      bio
      followers
      following
      posts
    }
  }
`;

export const SEARCH_POSTS = gql`
  query SearchPosts($query: String!, $first: Int) {
    searchPosts(query: $query, first: $first) {
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
  }
`;

export const GET_USER_POSTS = gql`
  query GetUserPosts($userId: ID!, $first: Int, $after: String) {
    userPosts(userId: $userId, first: $first, after: $after) {
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
          isBookmarked
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
`;

export const GET_TRENDING_TOPICS = gql`
  query GetTrendingTopics($first: Int) {
    trendingTopics(first: $first) {
      id
      hashtag
      posts
      trend
    }
  }
`;

export const GET_SUGGESTED_USERS = gql`
  query GetSuggestedUsers($first: Int) {
    suggestedUsers(first: $first) {
      id
      name
      username
      avatar
      bio
      followers
      following
      posts
    }
  }
`;
