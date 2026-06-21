import { Skeleton } from "@/components/ui/skeleton";

export default function CompareLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Skeleton className="h-8 w-56 mb-2" />
      <Skeleton className="h-5 w-80 mb-8" />
      <Skeleton className="h-96 rounded-lg" />
    </div>
  );
}
