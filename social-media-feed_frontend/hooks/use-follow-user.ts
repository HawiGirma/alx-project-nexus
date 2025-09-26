import { useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";

const FOLLOW_USER = gql`
  mutation FollowUser($userId: ID!) {
    followUser(userId: $userId) {
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

const UNFOLLOW_USER = gql`
  mutation UnfollowUser($userId: ID!) {
    unfollowUser(userId: $userId) {
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

export function useFollowUser() {
  const [followUser, { loading: followLoading }] = useMutation(FOLLOW_USER);
  const [unfollowUser, { loading: unfollowLoading }] =
    useMutation(UNFOLLOW_USER);

  const handleFollow = async (userId: string) => {
    try {
      await followUser({
        variables: { userId },
        optimisticResponse: {
          followUser: {
            __typename: "User",
            id: userId,
            name: "",
            username: "",
            avatar: "",
            bio: "",
            followers: 0,
            following: 0,
            posts: 0,
          },
        },
      });
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnfollow = async (userId: string) => {
    try {
      await unfollowUser({
        variables: { userId },
        optimisticResponse: {
          unfollowUser: {
            __typename: "User",
            id: userId,
            name: "",
            username: "",
            avatar: "",
            bio: "",
            followers: 0,
            following: 0,
            posts: 0,
          },
        },
      });
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  return {
    followUser: handleFollow,
    unfollowUser: handleUnfollow,
    loading: followLoading || unfollowLoading,
  };
}
