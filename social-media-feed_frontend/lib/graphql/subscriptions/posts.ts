import { gql } from "@apollo/client"

export const POST_ADDED = gql`
  subscription PostAdded {
    postAdded {
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
`

export const POST_LIKED = gql`
  subscription PostLiked($postId: ID!) {
    postLiked(postId: $postId) {
      id
      likes
      isLiked
    }
  }
`

export const COMMENT_ADDED = gql`
  subscription CommentAdded($postId: ID!) {
    commentAdded(postId: $postId) {
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
`
