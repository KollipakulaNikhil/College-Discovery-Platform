"use client";

import { BookmarkCheck } from "lucide-react";
import { CollegeCard } from "@/components/CollegeCard";
import { EmptySavedState } from "@/components/EmptyState";
import type { SavedCollege } from "@/types";

interface SavedPageClientProps {
  savedColleges: SavedCollege[];
}

export function SavedPageClient({ savedColleges }: SavedPageClientProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <BookmarkCheck className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Saved Colleges</h1>
          <p className="text-sm text-gray-500">
            {savedColleges.length} college{savedColleges.length !== 1 ? "s" : ""} saved
          </p>
        </div>
      </div>

      {savedColleges.length === 0 ? (
        <EmptySavedState />
      ) : (
        <div className="space-y-4">
          {savedColleges.map((saved) => (
            <CollegeCard key={saved.id} college={saved.college} />
          ))}
        </div>
      )}
    </div>
  );
}
