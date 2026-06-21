"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { GitCompare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ComparisonTable } from "@/components/ComparisonTable";
import { CollegeListSkeleton } from "@/components/LoadingSkeleton";
import { ErrorState } from "@/components/ErrorState";
import { useCompareColleges } from "@/hooks/useCompare";
import { useCompare } from "@/hooks/useCompare";
import Link from "next/link";

interface ComparePageClientProps {
  initialIds: string[];
}

export function ComparePageClient({ initialIds }: ComparePageClientProps) {
  const router = useRouter();
  const { compareIds, setCompareIds, removeFromCompare } = useCompare();

  useEffect(() => {
    if (initialIds.length >= 2) {
      setCompareIds(initialIds);
    }
  }, []);

  const ids = initialIds.length >= 2 ? initialIds : compareIds;
  const { data, isLoading, isError, refetch } = useCompareColleges(ids);

  const handleRemove = (id: string) => {
    removeFromCompare(id);
    const newIds = ids.filter((i) => i !== id);
    if (newIds.length >= 2) {
      router.push(`/compare?ids=${newIds.join(",")}`);
    } else {
      router.push("/compare");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-24">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <GitCompare className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Compare Colleges</h1>
        </div>
        <p className="text-gray-500">
          Select 2–3 colleges from the listing page to compare them side by side.
        </p>
      </div>

      {ids.length < 2 ? (
        <Card className="border-dashed border-2">
          <CardContent className="py-16 flex flex-col items-center text-center gap-4">
            <div className="p-4 bg-gray-100 rounded-full">
              <GitCompare className="h-10 w-10 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">No colleges selected</h3>
              <p className="text-gray-500 text-sm max-w-sm">
                Browse colleges and click &quot;Compare&quot; on any college card to add it here. You can compare 2–3 colleges at a time.
              </p>
            </div>
            <Button asChild>
              <Link href="/">
                <Plus className="h-4 w-4 mr-2" />
                Browse Colleges
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <CollegeListSkeleton count={3} />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : data && data.colleges.length >= 2 ? (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Comparing <span className="font-semibold">{data.colleges.length}</span> colleges
            </p>
            <Button variant="outline" size="sm" asChild>
              <Link href="/">
                <Plus className="h-4 w-4 mr-1.5" />
                Add More
              </Link>
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <ComparisonTable colleges={data.colleges} onRemove={handleRemove} />
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
