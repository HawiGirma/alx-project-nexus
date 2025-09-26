export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  GenericScalar: { input: any; output: any; }
};

export type Comment = {
  __typename?: 'Comment';
  author: User;
  content: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  likesCount: Scalars['Int']['output'];
  post: Post;
  updatedAt: Scalars['String']['output'];
};

export type CreateCommentPayload = {
  __typename?: 'CreateCommentPayload';
  comment: Comment;
};

export type CreatePostPayload = {
  __typename?: 'CreatePostPayload';
  post: Post;
};

export type DeletePostPayload = {
  __typename?: 'DeletePostPayload';
  ok: Scalars['Boolean']['output'];
};

export type LikePostPayload = {
  __typename?: 'LikePostPayload';
  likesCount: Scalars['Int']['output'];
  ok: Scalars['Boolean']['output'];
};

export type Media = {
  __typename?: 'Media';
  thumbnail?: Maybe<Scalars['String']['output']>;
  type: MediaType;
  url: Scalars['String']['output'];
};

export enum MediaType {
  Image = 'IMAGE',
  Video = 'VIDEO'
}

export type Mutation = {
  __typename?: 'Mutation';
  createComment: CreateCommentPayload;
  createPost: CreatePostPayload;
  deletePost: DeletePostPayload;
  likePost: LikePostPayload;
  refreshToken: Refresh;
  sharePost: SharePostPayload;
  tokenAuth: ObtainJsonWebToken;
  unlikePost: UnlikePostPayload;
  updatePost: UpdatePostPayload;
  verifyToken: Verify;
};


export type MutationCreateCommentArgs = {
  content: Scalars['String']['input'];
  postId: Scalars['ID']['input'];
};


export type MutationCreatePostArgs = {
  content: Scalars['String']['input'];
};


export type MutationDeletePostArgs = {
  postId: Scalars['ID']['input'];
};


export type MutationLikePostArgs = {
  postId: Scalars['ID']['input'];
};


export type MutationRefreshTokenArgs = {
  token: Scalars['String']['input'];
};


export type MutationSharePostArgs = {
  postId: Scalars['ID']['input'];
};


export type MutationTokenAuthArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationUnlikePostArgs = {
  postId: Scalars['ID']['input'];
};


export type MutationUpdatePostArgs = {
  content: Scalars['String']['input'];
  postId: Scalars['ID']['input'];
};


export type MutationVerifyTokenArgs = {
  token: Scalars['String']['input'];
};

export type ObtainJsonWebToken = {
  __typename?: 'ObtainJSONWebToken';
  refreshToken: Scalars['String']['output'];
  token: Scalars['String']['output'];
};

export type Post = {
  __typename?: 'Post';
  author: User;
  commentsCount: Scalars['Int']['output'];
  content: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  likesCount: Scalars['Int']['output'];
  media?: Maybe<Media>;
  sharesCount: Scalars['Int']['output'];
  updatedAt: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  post?: Maybe<Post>;
  posts: Array<Post>;
};


export type QueryPostArgs = {
  postId: Scalars['ID']['input'];
};


export type QueryPostsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
};

export type Refresh = {
  __typename?: 'Refresh';
  refreshToken: Scalars['String']['output'];
  token: Scalars['String']['output'];
};

export type SharePostPayload = {
  __typename?: 'SharePostPayload';
  ok: Scalars['Boolean']['output'];
  sharesCount: Scalars['Int']['output'];
};

export type UnlikePostPayload = {
  __typename?: 'UnlikePostPayload';
  likesCount: Scalars['Int']['output'];
  ok: Scalars['Boolean']['output'];
};

export type UpdatePostPayload = {
  __typename?: 'UpdatePostPayload';
  post: Post;
};

export type User = {
  __typename?: 'User';
  avatar?: Maybe<Scalars['String']['output']>;
  bio?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  followersCount: Scalars['Int']['output'];
  followingCount: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  postsCount: Scalars['Int']['output'];
  updatedAt: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type Verify = {
  __typename?: 'Verify';
  payload: Scalars['GenericScalar']['output'];
};
