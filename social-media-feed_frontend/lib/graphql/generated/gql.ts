/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  mutation LikePost($postId: ID!) {\n    likePost(postId: $postId) {\n      likesCount\n      ok\n    }\n  }\n": typeof types.LikePostDocument,
    "\n  mutation UnlikePost($postId: ID!) {\n    unlikePost(postId: $postId) {\n      likesCount\n      ok\n    }\n  }\n": typeof types.UnlikePostDocument,
    "\n  mutation CreatePost($content: String!) {\n    createPost(content: $content) {\n      post {\n        id\n        content\n        author {\n          id\n          name\n          username\n          email\n          avatar\n          bio\n          followersCount\n          followingCount\n          postsCount\n          createdAt\n          updatedAt\n        }\n        createdAt\n        updatedAt\n        likesCount\n        commentsCount\n        sharesCount\n        media {\n          type\n          url\n          thumbnail\n        }\n      }\n    }\n  }\n": typeof types.CreatePostDocument,
    "\n  mutation SharePost($postId: ID!) {\n    sharePost(postId: $postId) {\n      sharesCount\n      ok\n    }\n  }\n": typeof types.SharePostDocument,
    "\n  mutation CreateComment($postId: ID!, $content: String!) {\n    createComment(postId: $postId, content: $content) {\n      comment {\n        id\n        content\n        author {\n          id\n          name\n          username\n          email\n          avatar\n          bio\n          followersCount\n          followingCount\n          postsCount\n          createdAt\n          updatedAt\n        }\n        post {\n          id\n          content\n        }\n        createdAt\n        updatedAt\n        likesCount\n      }\n    }\n  }\n": typeof types.CreateCommentDocument,
    "\n  mutation DeletePost($postId: ID!) {\n    deletePost(postId: $postId) {\n      ok\n    }\n  }\n": typeof types.DeletePostDocument,
    "\n  mutation TokenAuth($username: String!, $password: String!) {\n    tokenAuth(username: $username, password: $password) {\n      token\n      refreshToken\n    }\n  }\n": typeof types.TokenAuthDocument,
    "\n  mutation VerifyToken($token: String!) {\n    verifyToken(token: $token) {\n      payload\n    }\n  }\n": typeof types.VerifyTokenDocument,
    "\n  mutation RefreshToken($token: String!) {\n    refreshToken(token: $token) {\n      token\n      refreshToken\n    }\n  }\n": typeof types.RefreshTokenDocument,
    "\n  query GetPosts($first: Int) {\n    posts(first: $first) {\n      id\n      content\n      author {\n        id\n        name\n        username\n        email\n        avatar\n        bio\n        followersCount\n        followingCount\n        postsCount\n        createdAt\n        updatedAt\n      }\n      createdAt\n      updatedAt\n      likesCount\n      commentsCount\n      sharesCount\n      media {\n        type\n        url\n        thumbnail\n      }\n    }\n  }\n": typeof types.GetPostsDocument,
    "\n  query GetPost($postId: ID!) {\n    post(postId: $postId) {\n      id\n      content\n      author {\n        id\n        name\n        username\n        email\n        avatar\n        bio\n        followersCount\n        followingCount\n        postsCount\n        createdAt\n        updatedAt\n      }\n      createdAt\n      updatedAt\n      likesCount\n      commentsCount\n      sharesCount\n      media {\n        type\n        url\n        thumbnail\n      }\n    }\n  }\n": typeof types.GetPostDocument,
};
const documents: Documents = {
    "\n  mutation LikePost($postId: ID!) {\n    likePost(postId: $postId) {\n      likesCount\n      ok\n    }\n  }\n": types.LikePostDocument,
    "\n  mutation UnlikePost($postId: ID!) {\n    unlikePost(postId: $postId) {\n      likesCount\n      ok\n    }\n  }\n": types.UnlikePostDocument,
    "\n  mutation CreatePost($content: String!) {\n    createPost(content: $content) {\n      post {\n        id\n        content\n        author {\n          id\n          name\n          username\n          email\n          avatar\n          bio\n          followersCount\n          followingCount\n          postsCount\n          createdAt\n          updatedAt\n        }\n        createdAt\n        updatedAt\n        likesCount\n        commentsCount\n        sharesCount\n        media {\n          type\n          url\n          thumbnail\n        }\n      }\n    }\n  }\n": types.CreatePostDocument,
    "\n  mutation SharePost($postId: ID!) {\n    sharePost(postId: $postId) {\n      sharesCount\n      ok\n    }\n  }\n": types.SharePostDocument,
    "\n  mutation CreateComment($postId: ID!, $content: String!) {\n    createComment(postId: $postId, content: $content) {\n      comment {\n        id\n        content\n        author {\n          id\n          name\n          username\n          email\n          avatar\n          bio\n          followersCount\n          followingCount\n          postsCount\n          createdAt\n          updatedAt\n        }\n        post {\n          id\n          content\n        }\n        createdAt\n        updatedAt\n        likesCount\n      }\n    }\n  }\n": types.CreateCommentDocument,
    "\n  mutation DeletePost($postId: ID!) {\n    deletePost(postId: $postId) {\n      ok\n    }\n  }\n": types.DeletePostDocument,
    "\n  mutation TokenAuth($username: String!, $password: String!) {\n    tokenAuth(username: $username, password: $password) {\n      token\n      refreshToken\n    }\n  }\n": types.TokenAuthDocument,
    "\n  mutation VerifyToken($token: String!) {\n    verifyToken(token: $token) {\n      payload\n    }\n  }\n": types.VerifyTokenDocument,
    "\n  mutation RefreshToken($token: String!) {\n    refreshToken(token: $token) {\n      token\n      refreshToken\n    }\n  }\n": types.RefreshTokenDocument,
    "\n  query GetPosts($first: Int) {\n    posts(first: $first) {\n      id\n      content\n      author {\n        id\n        name\n        username\n        email\n        avatar\n        bio\n        followersCount\n        followingCount\n        postsCount\n        createdAt\n        updatedAt\n      }\n      createdAt\n      updatedAt\n      likesCount\n      commentsCount\n      sharesCount\n      media {\n        type\n        url\n        thumbnail\n      }\n    }\n  }\n": types.GetPostsDocument,
    "\n  query GetPost($postId: ID!) {\n    post(postId: $postId) {\n      id\n      content\n      author {\n        id\n        name\n        username\n        email\n        avatar\n        bio\n        followersCount\n        followingCount\n        postsCount\n        createdAt\n        updatedAt\n      }\n      createdAt\n      updatedAt\n      likesCount\n      commentsCount\n      sharesCount\n      media {\n        type\n        url\n        thumbnail\n      }\n    }\n  }\n": types.GetPostDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation LikePost($postId: ID!) {\n    likePost(postId: $postId) {\n      likesCount\n      ok\n    }\n  }\n"): (typeof documents)["\n  mutation LikePost($postId: ID!) {\n    likePost(postId: $postId) {\n      likesCount\n      ok\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UnlikePost($postId: ID!) {\n    unlikePost(postId: $postId) {\n      likesCount\n      ok\n    }\n  }\n"): (typeof documents)["\n  mutation UnlikePost($postId: ID!) {\n    unlikePost(postId: $postId) {\n      likesCount\n      ok\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreatePost($content: String!) {\n    createPost(content: $content) {\n      post {\n        id\n        content\n        author {\n          id\n          name\n          username\n          email\n          avatar\n          bio\n          followersCount\n          followingCount\n          postsCount\n          createdAt\n          updatedAt\n        }\n        createdAt\n        updatedAt\n        likesCount\n        commentsCount\n        sharesCount\n        media {\n          type\n          url\n          thumbnail\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreatePost($content: String!) {\n    createPost(content: $content) {\n      post {\n        id\n        content\n        author {\n          id\n          name\n          username\n          email\n          avatar\n          bio\n          followersCount\n          followingCount\n          postsCount\n          createdAt\n          updatedAt\n        }\n        createdAt\n        updatedAt\n        likesCount\n        commentsCount\n        sharesCount\n        media {\n          type\n          url\n          thumbnail\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation SharePost($postId: ID!) {\n    sharePost(postId: $postId) {\n      sharesCount\n      ok\n    }\n  }\n"): (typeof documents)["\n  mutation SharePost($postId: ID!) {\n    sharePost(postId: $postId) {\n      sharesCount\n      ok\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateComment($postId: ID!, $content: String!) {\n    createComment(postId: $postId, content: $content) {\n      comment {\n        id\n        content\n        author {\n          id\n          name\n          username\n          email\n          avatar\n          bio\n          followersCount\n          followingCount\n          postsCount\n          createdAt\n          updatedAt\n        }\n        post {\n          id\n          content\n        }\n        createdAt\n        updatedAt\n        likesCount\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateComment($postId: ID!, $content: String!) {\n    createComment(postId: $postId, content: $content) {\n      comment {\n        id\n        content\n        author {\n          id\n          name\n          username\n          email\n          avatar\n          bio\n          followersCount\n          followingCount\n          postsCount\n          createdAt\n          updatedAt\n        }\n        post {\n          id\n          content\n        }\n        createdAt\n        updatedAt\n        likesCount\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeletePost($postId: ID!) {\n    deletePost(postId: $postId) {\n      ok\n    }\n  }\n"): (typeof documents)["\n  mutation DeletePost($postId: ID!) {\n    deletePost(postId: $postId) {\n      ok\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation TokenAuth($username: String!, $password: String!) {\n    tokenAuth(username: $username, password: $password) {\n      token\n      refreshToken\n    }\n  }\n"): (typeof documents)["\n  mutation TokenAuth($username: String!, $password: String!) {\n    tokenAuth(username: $username, password: $password) {\n      token\n      refreshToken\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation VerifyToken($token: String!) {\n    verifyToken(token: $token) {\n      payload\n    }\n  }\n"): (typeof documents)["\n  mutation VerifyToken($token: String!) {\n    verifyToken(token: $token) {\n      payload\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation RefreshToken($token: String!) {\n    refreshToken(token: $token) {\n      token\n      refreshToken\n    }\n  }\n"): (typeof documents)["\n  mutation RefreshToken($token: String!) {\n    refreshToken(token: $token) {\n      token\n      refreshToken\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetPosts($first: Int) {\n    posts(first: $first) {\n      id\n      content\n      author {\n        id\n        name\n        username\n        email\n        avatar\n        bio\n        followersCount\n        followingCount\n        postsCount\n        createdAt\n        updatedAt\n      }\n      createdAt\n      updatedAt\n      likesCount\n      commentsCount\n      sharesCount\n      media {\n        type\n        url\n        thumbnail\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetPosts($first: Int) {\n    posts(first: $first) {\n      id\n      content\n      author {\n        id\n        name\n        username\n        email\n        avatar\n        bio\n        followersCount\n        followingCount\n        postsCount\n        createdAt\n        updatedAt\n      }\n      createdAt\n      updatedAt\n      likesCount\n      commentsCount\n      sharesCount\n      media {\n        type\n        url\n        thumbnail\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetPost($postId: ID!) {\n    post(postId: $postId) {\n      id\n      content\n      author {\n        id\n        name\n        username\n        email\n        avatar\n        bio\n        followersCount\n        followingCount\n        postsCount\n        createdAt\n        updatedAt\n      }\n      createdAt\n      updatedAt\n      likesCount\n      commentsCount\n      sharesCount\n      media {\n        type\n        url\n        thumbnail\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetPost($postId: ID!) {\n    post(postId: $postId) {\n      id\n      content\n      author {\n        id\n        name\n        username\n        email\n        avatar\n        bio\n        followersCount\n        followingCount\n        postsCount\n        createdAt\n        updatedAt\n      }\n      createdAt\n      updatedAt\n      likesCount\n      commentsCount\n      sharesCount\n      media {\n        type\n        url\n        thumbnail\n      }\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;