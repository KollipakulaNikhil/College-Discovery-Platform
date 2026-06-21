import { CollegeListSkeleton } from "@/components/LoadingSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function SavedLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Skeleton className="h-8 w-48 mb-6" />
      <CollegeListSkeleton count={4} />
    </div>
  );
}
