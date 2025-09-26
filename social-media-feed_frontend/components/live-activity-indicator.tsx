"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Wifi } from "lucide-react"

interface LiveActivityIndicatorProps {
  isConnected: boolean
  activityCount?: number
}

export function LiveActivityIndicator({ isConnected, activityCount = 0 }: LiveActivityIndicatorProps) {
  return (
    <motion.div
      className="fixed bottom-24 right-4 lg:bottom-4 z-40"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Badge variant={isConnected ? "default" : "secondary"} className="flex items-center gap-2 px-3 py-1.5 shadow-lg">
        <motion.div
          animate={isConnected ? { scale: [1, 1.2, 1] } : { scale: 1 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <Wifi className="h-3 w-3" />
        </motion.div>
        <span className="text-xs">{isConnected ? "Live" : "Offline"}</span>
        {activityCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs"
          >
            {activityCount > 9 ? "9+" : activityCount}
          </motion.div>
        )}
      </Badge>
    </motion.div>
  )
}
