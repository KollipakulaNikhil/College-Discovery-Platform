import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { collegeService } from "@/lib/services/college.service";
import { savedService } from "@/lib/services/saved.service";
import { CollegeDetailClient } from "@/components/CollegeDetailClient";

interface CollegeDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: CollegeDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const college = await collegeService.getCollegeById(id);
  if (!college) return { title: "College Not Found" };
  return {
    title: college.name,
    description: `View details, courses, placement stats and reviews for ${college.name} located in ${college.location}.`,
  };
}

export default async function CollegeDetailPage({ params }: CollegeDetailPageProps) {
  const { id } = await params;
  const [college, session] = await Promise.all([
    collegeService.getCollegeById(id),
    getServerSession(authOptions),
  ]);

  if (!college) notFound();

  let isSaved = false;
  if (session?.user?.id) {
    isSaved = await savedService.isCollegeSaved(session.user.id, id);
  }

  return <CollegeDetailClient college={college} isSaved={isSaved} isAuthenticated={!!session} />;
}
