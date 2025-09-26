"use client"

import { Button } from "@/components/ui/button"
import { Home, Search, Bell, User, Plus } from "lucide-react"
import { CreatePostDialog } from "@/components/create-post-dialog"

export function MobileNavigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t lg:hidden">
      <div className="flex items-center justify-around py-2 px-4">
        <Button variant="ghost" size="sm" className="flex-col gap-1 h-auto py-2">
          <Home className="h-5 w-5" />
          <span className="text-xs">Home</span>
        </Button>

        <Button variant="ghost" size="sm" className="flex-col gap-1 h-auto py-2">
          <Search className="h-5 w-5" />
          <span className="text-xs">Search</span>
        </Button>

        <CreatePostDialog>
          <Button size="sm" className="flex-col gap-1 h-auto py-2 px-4">
            <Plus className="h-5 w-5" />
            <span className="text-xs">Post</span>
          </Button>
        </CreatePostDialog>

        <Button variant="ghost" size="sm" className="flex-col gap-1 h-auto py-2">
          <Bell className="h-5 w-5" />
          <span className="text-xs">Alerts</span>
        </Button>

        <Button variant="ghost" size="sm" className="flex-col gap-1 h-auto py-2">
          <User className="h-5 w-5" />
          <span className="text-xs">Profile</span>
        </Button>
      </div>
    </nav>
  )
}
