"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Search, Plus } from "lucide-react"
import { CreatePostDialog } from "@/components/create-post-dialog"

export function FeedHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            SocialFeed
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm">
            <Search className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
          </Button>

          <CreatePostDialog>
            <Button size="sm" className="hidden sm:flex">
              <Plus className="h-4 w-4 mr-2" />
              Create Post
            </Button>
          </CreatePostDialog>

          <Avatar className="h-8 w-8">
            <AvatarImage src="/user-profile-illustration.png" alt="Profile" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
