"use client"

import { useState, useCallback } from "react"
import { type Post, graphqlClient } from "@/lib/graphql"

interface UsePostsReturn {
  posts: Post[]
  newPosts: Post[]
  loading: boolean
  error: string | null
  hasNextPage: boolean
  isFetchingNextPage: boolean
  loadInitialPosts: () => Promise<void>
  loadMorePosts: () => Promise<void>
  updatePost: (updatedPost: Post) => void
  addPost: (newPost: Post) => void
  addNewPost: (newPost: Post) => void
  loadNewPosts: () => void
}

export function usePosts(): UsePostsReturn {
  const [posts, setPosts] = useState<Post[]>([])
  const [newPosts, setNewPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasNextPage, setHasNextPage] = useState(true)

  const loadInitialPosts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const initialPosts = await graphqlClient.fetchPosts(10, 0)
      setPosts(initialPosts)
      setHasNextPage(initialPosts.length === 10)
    } catch (err) {
      setError("Failed to load posts")
      console.error("Failed to load posts:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  const loadMorePosts = useCallback(async () => {
    if (isFetchingNextPage || !hasNextPage) return

    try {
      setIsFetchingNextPage(true)
      setError(null)
      const morePosts = await graphqlClient.fetchPosts(5, posts.length)

      if (morePosts.length === 0) {
        setHasNextPage(false)
      } else {
        setPosts((prev) => [...prev, ...morePosts])
        setHasNextPage(morePosts.length === 5)
      }
    } catch (err) {
      setError("Failed to load more posts")
      console.error("Failed to load more posts:", err)
    } finally {
      setIsFetchingNextPage(false)
    }
  }, [posts.length, isFetchingNextPage, hasNextPage])

  const updatePost = useCallback((updatedPost: Post) => {
    setPosts((prev) => prev.map((post) => (post.id === updatedPost.id ? updatedPost : post)))
    setNewPosts((prev) => prev.map((post) => (post.id === updatedPost.id ? updatedPost : post)))
  }, [])

  const addPost = useCallback((newPost: Post) => {
    setPosts((prev) => [newPost, ...prev])
  }, [])

  const addNewPost = useCallback((newPost: Post) => {
    setNewPosts((prev) => [newPost, ...prev])
  }, [])

  const loadNewPosts = useCallback(() => {
    setPosts((prev) => [...newPosts, ...prev])
    setNewPosts([])
  }, [newPosts])

  return {
    posts,
    newPosts,
    loading,
    error,
    hasNextPage,
    isFetchingNextPage,
    loadInitialPosts,
    loadMorePosts,
    updatePost,
    addPost,
    addNewPost,
    loadNewPosts,
  }
}
