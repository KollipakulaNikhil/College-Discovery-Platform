import type { Metadata } from "next";
import { ComparePageClient } from "@/components/ComparePageClient";

export const metadata: Metadata = {
  title: "Compare Colleges",
  description: "Compare colleges side by side on fees, ratings, placements and more.",
};

interface ComparePageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const params = await searchParams;
  const ids = params.ids ? params.ids.split(",").filter(Boolean) : [];

  return <ComparePageClient initialIds={ids} />;
}
