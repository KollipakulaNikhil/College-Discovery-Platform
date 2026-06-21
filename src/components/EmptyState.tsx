import { SearchX, BookmarkX } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: { label: string; href: string };
}

export function EmptyState({
  title = "No colleges found",
  description = "Try adjusting your filters or search terms to find more results.",
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-gray-100 p-4 mb-4">
        <SearchX className="h-10 w-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-500 text-sm max-w-sm mb-4">{description}</p>
      {action && (
        <Button asChild variant="outline">
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
    </div>
  );
}

export function EmptySavedState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-blue-50 p-4 mb-4">
        <BookmarkX className="h-10 w-10 text-blue-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">No saved colleges yet</h3>
      <p className="text-gray-500 text-sm max-w-sm mb-4">
        Start exploring colleges and save the ones you like for quick access later.
      </p>
      <Button asChild>
        <Link href="/">Explore Colleges</Link>
      </Button>
    </div>
  );
}
