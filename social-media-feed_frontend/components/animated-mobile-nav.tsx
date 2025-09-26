"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home, Search, User, Plus } from "lucide-react";
import { CreatePostDialog } from "@/components/create-post-dialog";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AnimatedMobileNavigation() {
  const pathname = usePathname();

  const navItems = [
    { icon: Home, label: "Home", href: "/", active: pathname === "/" },
    {
      icon: Search,
      label: "Search",
      href: "/search",
      active: pathname === "/search",
    },
    { icon: Plus, label: "Post", active: false, isSpecial: true },
    {
      icon: User,
      label: "Profile",
      href: "/profile",
      active: pathname === "/profile",
    },
  ];

  return (
    <motion.nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-t lg:hidden"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map((item, index) => {
          const Icon = item.icon;

          if (item.isSpecial) {
            return (
              <CreatePostDialog key={item.label}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 200,
                  }}
                >
                  <Button
                    size="sm"
                    className="flex-col gap-1 h-auto py-2 px-4 rounded-full"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs">{item.label}</span>
                  </Button>
                </motion.div>
              </CreatePostDialog>
            );
          }

          return (
            <motion.div
              key={item.label}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <Link href={item.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex-col gap-1 h-auto py-2 ${
                    item.active ? "text-primary" : ""
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs">{item.label}</span>
                </Button>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.nav>
  );
}
