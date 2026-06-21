import { CollegeListSkeleton } from "@/components/LoadingSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <div>
      {/* Hero skeleton */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 py-16 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <Skeleton className="h-12 w-96 mx-auto bg-blue-500/40" />
          <Skeleton className="h-6 w-2/3 mx-auto bg-blue-500/30" />
          <Skeleton className="h-12 w-full max-w-2xl mx-auto rounded-xl bg-blue-500/30" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-64">
            <Skeleton className="h-72 rounded-lg" />
          </aside>
          <div className="flex-1">
            <CollegeListSkeleton count={6} />
          </div>
        </div>
      </div>
    </div>
  );
}
