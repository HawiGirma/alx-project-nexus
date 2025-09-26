"use client"

import { TrendingSection } from "@/components/trending-section"
import { CommunitySection } from "@/components/community-section"

export function FeedSidebar() {
  return (
    <aside className="hidden lg:block w-80 space-y-6">
      <TrendingSection />
      <CommunitySection />
    </aside>
  )
}
