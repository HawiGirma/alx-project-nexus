"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Copy, Mail } from "lucide-react"
import type { Post } from "@/lib/graphql"
import { useToast } from "@/hooks/use-toast"

interface ShareDialogProps {
  post: Post
  isOpen: boolean
  onClose: () => void
  onShare: () => void
}

export function ShareDialog({ post, isOpen, onClose, onShare }: ShareDialogProps) {
  const [shareMessage, setShareMessage] = useState("")
  const [isSharing, setIsSharing] = useState(false)
  const { toast } = useToast()

  const handleShare = async () => {
    setIsSharing(true)
    try {
      await onShare()
      toast({
        title: "Post shared!",
        description: "Your post has been shared successfully.",
      })
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSharing(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`Check out this post: ${post.content}`)
      toast({
        title: "Copied!",
        description: "Post link copied to clipboard.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Share this post</DialogTitle>
          <DialogDescription>Share this post with your followers or copy the link.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Original Post Preview */}
          <div className="border rounded-lg p-4 bg-muted/20">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm">{post.author.name}</p>
                <p className="text-xs text-muted-foreground">@{post.author.username}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-3">{post.content}</p>
          </div>

          {/* Share Options */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={copyToClipboard} className="flex items-center gap-2 bg-transparent">
              <Copy className="h-4 w-4" />
              Copy Link
            </Button>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Mail className="h-4 w-4" />
              Email
            </Button>
          </div>

          {/* Share with Message */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/user-profile-illustration.png" alt="Your profile" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <Textarea
                placeholder="Add a comment (optional)"
                value={shareMessage}
                onChange={(e) => setShareMessage(e.target.value)}
                className="flex-1 min-h-[80px] resize-none"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleShare} disabled={isSharing}>
                {isSharing ? "Sharing..." : "Share Post"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
