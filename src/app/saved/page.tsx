import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { savedService } from "@/lib/services/saved.service";
import { SavedPageClient } from "@/components/SavedPageClient";

export const metadata: Metadata = {
  title: "Saved Colleges",
  description: "Your saved colleges on College Compass.",
};

export default async function SavedPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const saved = await savedService.getSavedColleges(session.user.id);

  return <SavedPageClient savedColleges={saved} />;
}
