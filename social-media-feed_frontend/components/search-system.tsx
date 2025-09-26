"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SearchResult {
  id: string;
  type: "user" | "post" | "hashtag";
  title: string;
  subtitle?: string;
}

export function SearchSystem() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Mock search results
  const mockResults: SearchResult[] = [
    {
      id: "1",
      type: "user",
      title: "Sarah Chen",
      subtitle: "@sarahchen",
    },
    {
      id: "2",
      type: "user",
      title: "Alex Rivera",
      subtitle: "@alexrivera",
    },
    {
      id: "3",
      type: "hashtag",
      title: "#webdevelopment",
      subtitle: "1,234 posts",
    },
    {
      id: "4",
      type: "post",
      title: "Just launched my new project!",
      subtitle: "by Sarah Chen",
    },
  ];

  const filteredResults = mockResults.filter(
    (result) =>
      result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.subtitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (result: SearchResult) => {
    console.log("Selected:", result);
    setIsOpen(false);
    setSearchQuery("");
    // Navigate to search page with the query
    router.push(`/search?q=${encodeURIComponent(result.title)}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-muted-foreground"
        >
          <Search className="mr-2 h-4 w-4" />
          Search...
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <Command>
          <form onSubmit={handleSearchSubmit}>
            <CommandInput
              placeholder="Search users, posts, hashtags..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
          </form>
          <CommandList>
            {searchQuery.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                <div className="mb-2">Start typing to search...</div>
                <Link
                  href="/search"
                  className="text-primary hover:underline text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  Go to Search Page
                </Link>
              </div>
            ) : filteredResults.length === 0 ? (
              <CommandEmpty>
                <div className="p-4 text-center">
                  <div className="mb-2">No results found.</div>
                  <Link
                    href={`/search?q=${encodeURIComponent(searchQuery)}`}
                    className="text-primary hover:underline text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    Search for "{searchQuery}"
                  </Link>
                </div>
              </CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredResults.map((result) => (
                  <CommandItem
                    key={result.id}
                    onSelect={() => handleSelect(result)}
                    className="flex items-center gap-3"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{result.title}</div>
                      {result.subtitle && (
                        <div className="text-sm text-muted-foreground">
                          {result.subtitle}
                        </div>
                      )}
                    </div>
                  </CommandItem>
                ))}
                <CommandItem
                  onSelect={() => {
                    setIsOpen(false);
                    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                  }}
                  className="flex items-center gap-3 text-primary"
                >
                  <Search className="h-4 w-4" />
                  <div className="flex-1">
                    <div className="font-medium">
                      Search for "{searchQuery}"
                    </div>
                    <div className="text-sm text-muted-foreground">
                      View all results
                    </div>
                  </div>
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
