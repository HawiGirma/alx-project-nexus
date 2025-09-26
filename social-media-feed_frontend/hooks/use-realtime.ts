"use client"

import { useEffect, useRef, useCallback } from "react"
import type { Post } from "@/lib/graphql"

export interface RealtimeEvent {
  type: "new_post" | "post_liked" | "post_commented" | "user_followed"
  data: any
  timestamp: string
}

interface UseRealtimeOptions {
  onNewPost?: (post: Post) => void
  onPostUpdate?: (postId: string, updates: Partial<Post>) => void
  onNotification?: (notification: RealtimeEvent) => void
}

export function useRealtime({ onNewPost, onPostUpdate, onNotification }: UseRealtimeOptions) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isConnected = useRef(false)

  const simulateRealtimeEvent = useCallback(() => {
    const eventTypes = ["post_liked", "post_commented", "new_post"] as const
    const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)]

    const event: RealtimeEvent = {
      type: randomType,
      data: {},
      timestamp: new Date().toISOString(),
    }

    switch (randomType) {
      case "new_post":
        const newPost: Post = {
          id: `realtime-${Date.now()}`,
          content: `Real-time post update! ${new Date().toLocaleTimeString()}`,
          author: {
            id: "realtime-user",
            name: "Live User",
            username: "liveuser",
            avatar: "/diverse-user-avatars.png",
          },
          createdAt: new Date().toISOString(),
          likes: Math.floor(Math.random() * 10),
          comments: Math.floor(Math.random() * 5),
          shares: Math.floor(Math.random() * 3),
          isLiked: false,
        }
        event.data = newPost
        onNewPost?.(newPost)
        break

      case "post_liked":
        event.data = {
          postId: "1", // Mock post ID
          likes: Math.floor(Math.random() * 200) + 100,
        }
        onPostUpdate?.(event.data.postId, { likes: event.data.likes })
        break

      case "post_commented":
        event.data = {
          postId: "2", // Mock post ID
          comments: Math.floor(Math.random() * 50) + 20,
        }
        onPostUpdate?.(event.data.postId, { comments: event.data.comments })
        break
    }

    onNotification?.(event)
  }, [onNewPost, onPostUpdate, onNotification])

  const connect = useCallback(() => {
    if (isConnected.current) return

    isConnected.current = true

    // Simulate real-time events every 10-30 seconds
    const scheduleNextEvent = () => {
      const delay = Math.random() * 20000 + 10000 // 10-30 seconds
      intervalRef.current = setTimeout(() => {
        if (isConnected.current) {
          simulateRealtimeEvent()
          scheduleNextEvent()
        }
      }, delay)
    }

    scheduleNextEvent()
  }, [simulateRealtimeEvent])

  const disconnect = useCallback(() => {
    isConnected.current = false
    if (intervalRef.current) {
      clearTimeout(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => {
    connect()
    return disconnect
  }, [connect, disconnect])

  return {
    isConnected: isConnected.current,
    connect,
    disconnect,
  }
}
