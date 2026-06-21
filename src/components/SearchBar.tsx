"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  initialSearch?: string;
}

export function SearchBar({ initialSearch = "" }: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(initialSearch);

  useEffect(() => {
    setValue(searchParams.get("search") ?? "");
  }, [searchParams]);

  const pushSearch = useCallback(
    (query: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (query) {
        params.set("search", query);
      } else {
        params.delete("search");
      }
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    pushSearch(value.trim());
  };

  const handleClear = () => {
    setValue("");
    pushSearch("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        <Input
          type="text"
          placeholder="Search by college name or city..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="pl-12 pr-28 h-12 text-base bg-white text-gray-900 border-0 shadow-lg rounded-xl focus-visible:ring-2 focus-visible:ring-blue-400"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-24 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <Button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 rounded-lg"
          size="sm"
        >
          Search
        </Button>
      </div>
    </form>
  );
}
