"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import type { CollegeDetail } from "@/types";

const COMPARE_KEY = "cc_compare_ids";
const COMPARE_NAMES_KEY = "cc_compare_names";
const MAX_COMPARE = 3;

let globalIds: string[] = [];
let globalNames: string[] = [];
const listeners = new Set<() => void>();

function loadFromStorage() {
  if (typeof window === "undefined") return;
  try {
    globalIds = JSON.parse(localStorage.getItem(COMPARE_KEY) ?? "[]");
    globalNames = JSON.parse(localStorage.getItem(COMPARE_NAMES_KEY) ?? "[]");
  } catch {
    globalIds = [];
    globalNames = [];
  }
}

function saveToStorage() {
  localStorage.setItem(COMPARE_KEY, JSON.stringify(globalIds));
  localStorage.setItem(COMPARE_NAMES_KEY, JSON.stringify(globalNames));
  listeners.forEach((fn) => fn());
}

export function useCompare() {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    loadFromStorage();
    const update = () => forceUpdate((n) => n + 1);
    listeners.add(update);
    return () => { listeners.delete(update); };
  }, []);

  const addToCompare = useCallback((id: string, name: string): boolean => {
    if (globalIds.includes(id)) return true;
    if (globalIds.length >= MAX_COMPARE) return false;
    globalIds = [...globalIds, id];
    globalNames = [...globalNames, name];
    saveToStorage();
    return true;
  }, []);

  const removeFromCompare = useCallback((id: string) => {
    const idx = globalIds.indexOf(id);
    if (idx === -1) return;
    globalIds = globalIds.filter((_, i) => i !== idx);
    globalNames = globalNames.filter((_, i) => i !== idx);
    saveToStorage();
  }, []);

  const clearCompare = useCallback(() => {
    globalIds = [];
    globalNames = [];
    saveToStorage();
  }, []);

  const setCompareIds = useCallback((ids: string[]) => {
    globalIds = ids;
    globalNames = ids.map(() => "");
    saveToStorage();
  }, []);

  return {
    compareIds: globalIds,
    compareNames: globalNames,
    addToCompare,
    removeFromCompare,
    clearCompare,
    setCompareIds,
  };
}

async function fetchCompareColleges(ids: string[]): Promise<{ colleges: CollegeDetail[] }> {
  if (ids.length < 2) return { colleges: [] };
  const res = await fetch(`/api/compare?ids=${ids.join(",")}`);
  if (!res.ok) throw new Error("Failed to fetch comparison data");
  return res.json();
}

export function useCompareColleges(ids: string[]) {
  return useQuery({
    queryKey: ["compare", ids],
    queryFn: () => fetchCompareColleges(ids),
    enabled: ids.length >= 2,
    staleTime: 60 * 1000,
  });
}
