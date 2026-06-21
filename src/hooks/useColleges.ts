"use client";

import { useQuery } from "@tanstack/react-query";
import { buildQueryString } from "@/lib/utils";
import type { CollegesResponse } from "@/types";

async function fetchColleges(params: Record<string, string | undefined>): Promise<CollegesResponse> {
  const qs = buildQueryString(params);
  const res = await fetch(`/api/colleges?${qs}`);
  if (!res.ok) throw new Error("Failed to fetch colleges");
  return res.json();
}

export function useColleges(
  filters: Record<string, string | undefined>,
  initialData?: CollegesResponse
) {
  const queryKey = ["colleges", filters];

  return useQuery({
    queryKey,
    queryFn: () => fetchColleges(filters),
    initialData,
    staleTime: 30 * 1000,
    placeholderData: (prev) => prev,
  });
}
