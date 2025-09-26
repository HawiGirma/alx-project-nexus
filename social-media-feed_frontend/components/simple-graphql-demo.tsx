"use client"

import { useQuery, gql } from "@apollo/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

const GET_POSTS = gql`
  query GetPosts {
    posts {
      id
      content
      author {
        name
        username
      }
      likes
      createdAt
    }
  }
`

export function SimpleGraphQLDemo() {
  const { loading, error, data, refetch } = useQuery(GET_POSTS)

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading GraphQL data...</span>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-red-600">GraphQL Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">{error.message}</p>
          <Button onClick={() => refetch()} variant="outline">
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-green-600">GraphQL Working!</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">Successfully connected to GraphQL endpoint</p>
        <div className="space-y-2">
          {data?.posts?.slice(0, 3).map((post: any) => (
            <div key={post.id} className="p-2 bg-muted rounded">
              <p className="text-sm font-medium">{post.author.name}</p>
              <p className="text-xs text-muted-foreground">{post.content.slice(0, 50)}...</p>
            </div>
          )) || <p className="text-sm text-muted-foreground">No posts available</p>}
        </div>
        <Button onClick={() => refetch()} className="w-full mt-4" size="sm">
          Refresh Data
        </Button>
      </CardContent>
    </Card>
  )
}
