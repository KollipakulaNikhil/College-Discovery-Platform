"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FiltersProps {
  locations: string[];
  currentParams: Record<string, string | string[] | undefined>;
}

export function Filters({ locations, currentParams }: FiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const clearFilters = () => {
    const search = searchParams.get("search");
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    router.push(`${pathname}?${params.toString()}`);
  };

  const hasActiveFilters = Boolean(
    currentParams.location || currentParams.minFees || currentParams.maxFees ||
    currentParams.rating || currentParams.sort
  );

  return (
    <Card className="sticky top-20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2">
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Sort */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Sort By</Label>
          <Select
            value={(currentParams.sort as string) ?? "rating_desc"}
            onValueChange={(v) => updateParam("sort", v)}
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating_desc">Rating: High to Low</SelectItem>
              <SelectItem value="rating_asc">Rating: Low to High</SelectItem>
              <SelectItem value="fees_asc">Fees: Low to High</SelectItem>
              <SelectItem value="fees_desc">Fees: High to Low</SelectItem>
              <SelectItem value="name_asc">Name: A to Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Location */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Location</Label>
          <Select
            value={(currentParams.location as string) ?? "all"}
            onValueChange={(v) => updateParam("location", v)}
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Minimum Rating */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Min Rating</Label>
          <Select
            value={(currentParams.rating as string) ?? "all"}
            onValueChange={(v) => updateParam("rating", v)}
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Any Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Rating</SelectItem>
              <SelectItem value="4.5">4.5+ ⭐</SelectItem>
              <SelectItem value="4">4.0+ ⭐</SelectItem>
              <SelectItem value="3.5">3.5+ ⭐</SelectItem>
              <SelectItem value="3">3.0+ ⭐</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Fees Range */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Fees Range (₹/year)</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              className="h-9 text-sm"
              defaultValue={(currentParams.minFees as string) ?? ""}
              onBlur={(e) => updateParam("minFees", e.target.value || null)}
            />
            <Input
              type="number"
              placeholder="Max"
              className="h-9 text-sm"
              defaultValue={(currentParams.maxFees as string) ?? ""}
              onBlur={(e) => updateParam("maxFees", e.target.value || null)}
            />
          </div>
          <div className="grid grid-cols-2 gap-1 mt-1">
            {[
              { label: "< 1L", min: "", max: "100000" },
              { label: "1L-3L", min: "100000", max: "300000" },
              { label: "3L-5L", min: "300000", max: "500000" },
              { label: "5L+", min: "500000", max: "" },
            ].map((range) => (
              <button
                key={range.label}
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  if (range.min) params.set("minFees", range.min); else params.delete("minFees");
                  if (range.max) params.set("maxFees", range.max); else params.delete("maxFees");
                  params.set("page", "1");
                  router.push(`${pathname}?${params.toString()}`);
                }}
                className="text-xs px-2 py-1 border rounded hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
