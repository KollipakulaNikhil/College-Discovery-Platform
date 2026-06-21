"use client";

import { useSearchParams } from "next/navigation";
import { useColleges } from "@/hooks/useColleges";
import { CollegeCard } from "@/components/CollegeCard";
import { Pagination } from "@/components/Pagination";
import { CollegeListSkeleton } from "@/components/LoadingSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import type { CollegesResponse } from "@/types";
import { ArrowUpDown } from "lucide-react";

interface CollegeListClientProps {
  initialData: CollegesResponse;
  currentParams: Record<string, string | string[] | undefined>;
}

export function CollegeListClient({ initialData, currentParams }: CollegeListClientProps) {
  const searchParams = useSearchParams();

  const filters = {
    search: searchParams.get("search") ?? undefined,
    location: searchParams.get("location") ?? undefined,
    minFees: searchParams.get("minFees") ?? undefined,
    maxFees: searchParams.get("maxFees") ?? undefined,
    rating: searchParams.get("rating") ?? undefined,
    sort: searchParams.get("sort") ?? "rating_desc",
    page: searchParams.get("page") ?? "1",
    limit: "10",
  };

  const { data, isLoading, isError, refetch } = useColleges(filters, initialData);

  if (isLoading) return <CollegeListSkeleton />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;
  if (!data) return null;

  const { colleges, total, page, limit, totalPages } = data;

  return (
    <div>
      {/* Result Count */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{total}</span> college{total !== 1 ? "s" : ""} found
          </span>
        </div>
        {(filters.search || filters.location) && (
          <div className="text-sm text-blue-600">
            {filters.search && <span>"{filters.search}"</span>}
            {filters.location && <span> in {filters.location}</span>}
          </div>
        )}
      </div>

      {/* College Cards */}
      {colleges.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="space-y-4">
            {colleges.map((college) => (
              <CollegeCard key={college.id} college={college} />
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            total={total}
            limit={limit}
          />
        </>
      )}
    </div>
  );
}
