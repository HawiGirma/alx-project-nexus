"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowUp } from "lucide-react"

interface NewPostsBannerProps {
  count: number
  onLoadNew: () => void
  isVisible: boolean
}

export function NewPostsBanner({ count, onLoadNew, isVisible }: NewPostsBannerProps) {
  if (!isVisible || count === 0) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40"
      >
        <Button
          onClick={onLoadNew}
          className="shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-full"
        >
          <ArrowUp className="h-4 w-4 mr-2" />
          {count} new post{count !== 1 ? "s" : ""}
        </Button>
      </motion.div>
    </AnimatePresence>
  )
}
