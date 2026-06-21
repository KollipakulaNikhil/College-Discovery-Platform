"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

async function fetchSavedIds(): Promise<string[]> {
  const res = await fetch("/api/saved");
  if (res.status === 401) return [];
  if (!res.ok) throw new Error("Failed to fetch saved colleges");
  const data = await res.json();
  return (data.saved ?? []).map((s: { college: { id: string } }) => s.college.id);
}

export function useSavedColleges() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { data: savedIds = [] } = useQuery({
    queryKey: ["savedIds"],
    queryFn: fetchSavedIds,
    enabled: !!session,
    staleTime: 30 * 1000,
  });

  const saveMutation = useMutation({
    mutationFn: async (collegeId: string) => {
      const res = await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save college");
      }
    },
    onSuccess: (_, collegeId) => {
      queryClient.setQueryData<string[]>(["savedIds"], (prev = []) =>
        prev.includes(collegeId) ? prev : [...prev, collegeId]
      );
    },
  });

  const unsaveMutation = useMutation({
    mutationFn: async (collegeId: string) => {
      const res = await fetch(`/api/saved?collegeId=${collegeId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to remove saved college");
      }
    },
    onSuccess: (_, collegeId) => {
      queryClient.setQueryData<string[]>(["savedIds"], (prev = []) =>
        prev.filter((id) => id !== collegeId)
      );
      queryClient.invalidateQueries({ queryKey: ["saved"] });
    },
  });

  return {
    savedIds,
    saveCollege: saveMutation.mutateAsync,
    unsaveCollege: unsaveMutation.mutateAsync,
    isSaving: saveMutation.isPending,
    isUnsaving: unsaveMutation.isPending,
  };
}
