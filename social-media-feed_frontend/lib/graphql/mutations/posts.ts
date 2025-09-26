import { gql } from "@apollo/client";

export const LIKE_POST = gql`
  mutation LikePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes
      isLiked
    }
  }
`;

export const UNLIKE_POST = gql`
  mutation UnlikePost($postId: ID!) {
    unlikePost(postId: $postId) {
      id
      likes
      isLiked
    }
  }
`;

export const CREATE_POST = gql`
  mutation CreatePost(
    $content: String!
    $mediaUrl: String
    $mediaType: MediaType
  ) {
    createPost(content: $content, mediaUrl: $mediaUrl, mediaType: $mediaType) {
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

export const SHARE_POST = gql`
  mutation SharePost($postId: ID!) {
    sharePost(postId: $postId) {
      id
      shares
    }
  }
`;

export const CREATE_COMMENT = gql`
  mutation CreateComment($postId: ID!, $content: String!) {
    createComment(postId: $postId, content: $content) {
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

export const DELETE_POST = gql`
  mutation DeletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

export const DELETE_COMMENT = gql`
  mutation DeleteComment($commentId: ID!) {
    deleteComment(commentId: $commentId)
  }
`;

export const LIKE_COMMENT = gql`
  mutation LikeComment($commentId: ID!) {
    likeComment(commentId: $commentId) {
      id
      likes
      isLiked
    }
  }
`;

export const UNLIKE_COMMENT = gql`
  mutation UnlikeComment($commentId: ID!) {
    unlikeComment(commentId: $commentId) {
      id
      likes
      isLiked
    }
  }
`;

export const FOLLOW_USER = gql`
  mutation FollowUser($userId: ID!) {
    followUser(userId: $userId) {
      id
      name
      username
      avatar
      followers
      following
      posts
    }
  }
`;

export const UNFOLLOW_USER = gql`
  mutation UnfollowUser($userId: ID!) {
    unfollowUser(userId: $userId) {
      id
      name
      username
      avatar
      followers
      following
      posts
    }
  }
`;

export const BOOKMARK_POST = gql`
  mutation BookmarkPost($postId: ID!) {
    bookmarkPost(postId: $postId) {
      id
      isBookmarked
    }
  }
`;

export const UNBOOKMARK_POST = gql`
  mutation UnbookmarkPost($postId: ID!) {
    unbookmarkPost(postId: $postId) {
      id
      isBookmarked
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile(
    $name: String
    $bio: String
    $avatar: String
    $location: String
    $website: String
  ) {
    updateProfile(
      name: $name
      bio: $bio
      avatar: $avatar
      location: $location
      website: $website
    ) {
      id
      name
      username
      avatar
      bio
      location
      website
      followers
      following
      posts
      createdAt
    }
  }
`;
