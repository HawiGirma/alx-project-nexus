"use client";

import type React from "react";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageIcon, Video, Smile, Loader2, X, Upload } from "lucide-react";
import { usePostsGraphQL } from "@/hooks/use-posts-graphql";
import { useToast } from "@/hooks/use-toast";

interface CreatePostDialogProps {
  children: React.ReactNode;
}

export function CreatePostDialog({ children }: CreatePostDialogProps) {
  const [content, setContent] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<{
    file: File;
    type: "IMAGE" | "VIDEO";
    preview: string;
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { createPost } = usePostsGraphQL();
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      toast({
        title: "Invalid file type",
        description: "Please select an image or video file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    const preview = URL.createObjectURL(file);
    setSelectedMedia({
      file,
      type: isImage ? "IMAGE" : "VIDEO",
      preview,
    });
  };

  const removeMedia = () => {
    if (selectedMedia) {
      URL.revokeObjectURL(selectedMedia.preview);
      setSelectedMedia(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadMedia = async (file: File): Promise<string> => {
    // For demo purposes, we'll create a mock URL
    // In a real app, you'd upload to a service like AWS S3, Cloudinary, etc.
    return new Promise((resolve) => {
      setTimeout(() => {
        // Create a mock URL for the uploaded file
        const mockUrl = `/uploads/${Date.now()}-${file.name}`;
        resolve(mockUrl);
      }, 1000);
    });
  };

  const handleSubmit = async () => {
    if ((!content.trim() && !selectedMedia) || isSubmitting) return;

    setIsSubmitting(true);
    setIsUploading(true);

    try {
      let mediaUrl: string | undefined;
      let mediaType: "IMAGE" | "VIDEO" | undefined;

      if (selectedMedia) {
        mediaUrl = await uploadMedia(selectedMedia.file);
        mediaType = selectedMedia.type;
      }

      await createPost(content.trim(), mediaUrl, mediaType);

      // Clean up
      setContent("");
      removeMedia();
      setIsOpen(false);

      toast({
        title: "Post created!",
        description: "Your post has been shared successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create a new post</DialogTitle>
          <DialogDescription>
            Share what's on your mind with your community.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-3 py-4">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src="/user-profile-illustration.png"
              alt="Your profile"
            />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-4">
            <Textarea
              placeholder="What's happening?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] resize-none border-0 p-0 text-lg placeholder:text-muted-foreground focus-visible:ring-0"
            />

            {/* Media Preview */}
            {selectedMedia && (
              <div className="relative">
                <div className="relative rounded-lg overflow-hidden bg-muted">
                  {selectedMedia.type === "IMAGE" ? (
                    <img
                      src={selectedMedia.preview}
                      alt="Preview"
                      className="w-full max-h-64 object-cover"
                    />
                  ) : (
                    <video
                      src={selectedMedia.preview}
                      controls
                      className="w-full max-h-64"
                    />
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 h-8 w-8 p-0"
                    onClick={removeMedia}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedMedia.file.name} (
                  {(selectedMedia.file.size / 1024 / 1024).toFixed(1)}MB)
                </p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-primary/80"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSubmitting}
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-primary/80"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSubmitting}
                >
                  <Video className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-primary/80"
                >
                  <Smile className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                {content.length}/280
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              (!content.trim() && !selectedMedia) ||
              content.length > 280 ||
              isSubmitting
            }
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {isUploading ? "Uploading..." : "Posting..."}
              </>
            ) : (
              "Post"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
