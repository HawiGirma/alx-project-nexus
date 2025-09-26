"use client"

import { motion } from "framer-motion"
import { TrendingSection } from "@/components/trending-section"
import { CommunitySection } from "@/components/community-section"

export function AnimatedFeedSidebar() {
  return (
    <motion.aside
      className="hidden lg:block w-80 space-y-6"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <TrendingSection />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <CommunitySection />
      </motion.div>
    </motion.aside>
  )
}
