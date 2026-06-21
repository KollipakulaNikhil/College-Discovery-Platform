"use client";

import Link from "next/link";
import { MapPin, Star, IndianRupee, TrendingUp, BookmarkPlus, BookmarkCheck, GitCompare } from "lucide-react";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSavedColleges } from "@/hooks/useSavedColleges";
import { useCompare } from "@/hooks/useCompare";
import { useToast } from "@/components/ui/use-toast";
import { formatCurrency, formatPackage, cn } from "@/lib/utils";
import type { College } from "@/types";

interface CollegeCardProps {
  college: College;
}

export function CollegeCard({ college }: CollegeCardProps) {
  const { data: session } = useSession();
  const { savedIds, saveCollege, unsaveCollege } = useSavedColleges();
  const { compareIds, addToCompare, removeFromCompare } = useCompare();
  const { toast } = useToast();

  const isSaved = savedIds.includes(college.id);
  const isInCompare = compareIds.includes(college.id);

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!session) {
      toast({ title: "Login required", description: "Please login to save colleges", variant: "destructive" });
      return;
    }
    if (isSaved) {
      await unsaveCollege(college.id);
      toast({ title: "Removed from saved" });
    } else {
      await saveCollege(college.id);
      toast({ title: "College saved!", description: `${college.name} added to your saved list` });
    }
  };

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isInCompare) {
      removeFromCompare(college.id);
    } else {
      const added = addToCompare(college.id, college.name);
      if (!added) {
        toast({ title: "Compare limit reached", description: "You can compare up to 3 colleges at a time", variant: "destructive" });
      }
    }
  };

  const getRatingBadgeClass = (rating: number) => {
    if (rating >= 4.5) return "bg-green-100 text-green-700 border-green-200";
    if (rating >= 4.0) return "bg-blue-100 text-blue-700 border-blue-200";
    if (rating >= 3.5) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-red-100 text-red-700 border-red-200";
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 group">
      <CardContent className="p-5">
        <div className="flex gap-4">
          {/* College Logo Placeholder */}
          <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center text-blue-700 font-bold text-lg">
            {college.name.charAt(0)}
          </div>

          <div className="flex-1 min-w-0">
            {/* Name + Rating */}
            <div className="flex items-start justify-between gap-2">
              <Link
                href={`/college/${college.id}`}
                className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1 group-hover:text-blue-600"
              >
                {college.name}
              </Link>
              <div className={cn("flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border flex-shrink-0", getRatingBadgeClass(college.rating))}>
                <Star className="h-3 w-3 fill-current" />
                {college.rating.toFixed(1)}
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
              <span>{college.location}</span>
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
              <div className="flex items-center gap-1 text-sm">
                <IndianRupee className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-gray-600 font-medium">{formatCurrency(college.fees)}</span>
                <span className="text-gray-400 text-xs">/yr</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                <span className="text-gray-600">{college.placementPercentage}% placed</span>
              </div>
              <div className="text-sm text-gray-500">
                Avg: <span className="font-medium text-gray-700">{formatPackage(college.averagePackage)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 mt-3">
              <Button asChild size="sm" className="h-8 text-xs px-3">
                <Link href={`/college/${college.id}`}>View Details</Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={cn("h-8 text-xs px-3", isInCompare && "border-blue-500 text-blue-600 bg-blue-50")}
                onClick={handleCompareToggle}
              >
                <GitCompare className="h-3.5 w-3.5 mr-1" />
                {isInCompare ? "Added" : "Compare"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn("h-8 w-8 p-0 ml-auto", isSaved && "text-blue-600")}
                onClick={handleSaveToggle}
                aria-label={isSaved ? "Remove from saved" : "Save college"}
              >
                {isSaved ? (
                  <BookmarkCheck className="h-4 w-4 fill-current" />
                ) : (
                  <BookmarkPlus className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
