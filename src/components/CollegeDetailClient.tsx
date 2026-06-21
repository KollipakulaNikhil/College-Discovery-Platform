"use client";

import Link from "next/link";
import {
  MapPin, Star, IndianRupee, TrendingUp, Award, BookmarkPlus, BookmarkCheck,
  GitCompare, ChevronLeft, Clock, Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useSavedColleges } from "@/hooks/useSavedColleges";
import { useCompare } from "@/hooks/useCompare";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { formatCurrency, formatPackage, cn } from "@/lib/utils";
import type { CollegeDetail } from "@/types";
import { useRouter } from "next/navigation";

interface CollegeDetailClientProps {
  college: CollegeDetail;
  isSaved: boolean;
  isAuthenticated: boolean;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "h-4 w-4",
            star <= Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          )}
        />
      ))}
    </div>
  );
}

export function CollegeDetailClient({ college, isSaved: initialSaved, isAuthenticated }: CollegeDetailClientProps) {
  const { data: session } = useSession();
  const { savedIds, saveCollege, unsaveCollege } = useSavedColleges();
  const { compareIds, addToCompare, removeFromCompare } = useCompare();
  const { toast } = useToast();
  const router = useRouter();

  const isSaved = session ? savedIds.includes(college.id) : initialSaved;
  const isInCompare = compareIds.includes(college.id);

  const handleSaveToggle = async () => {
    if (!session) {
      toast({ title: "Login required", description: "Please login to save colleges", variant: "destructive" });
      router.push("/login");
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

  const handleCompareToggle = () => {
    if (isInCompare) {
      removeFromCompare(college.id);
    } else {
      const added = addToCompare(college.id, college.name);
      if (!added) {
        toast({ title: "Compare limit", description: "Max 3 colleges can be compared", variant: "destructive" });
      } else {
        toast({ title: "Added to compare", description: "Select more colleges to compare" });
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24">
      {/* Breadcrumb */}
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 mb-4 transition-colors">
        <ChevronLeft className="h-4 w-4" />
        Back to Colleges
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center text-blue-700 font-bold text-3xl shadow-sm">
          {college.name.charAt(0)}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{college.name}</h1>
          <div className="flex items-center gap-1 text-gray-500 mb-3">
            <MapPin className="h-4 w-4" />
            <span>{college.location}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              {college.rating.toFixed(1)} Rating
            </Badge>
            <Badge variant="outline">{college._count.courses} Courses</Badge>
            <Badge variant="outline">{college._count.reviews} Reviews</Badge>
          </div>
        </div>
        <div className="flex md:flex-col gap-2 md:items-end">
          <Button onClick={handleSaveToggle} variant={isSaved ? "secondary" : "default"} className="flex-1 md:flex-none">
            {isSaved ? <><BookmarkCheck className="h-4 w-4 mr-2" />Saved</> : <><BookmarkPlus className="h-4 w-4 mr-2" />Save</>}
          </Button>
          <Button
            variant="outline"
            onClick={handleCompareToggle}
            className={cn("flex-1 md:flex-none", isInCompare && "border-blue-500 text-blue-600")}
          >
            <GitCompare className="h-4 w-4 mr-2" />
            {isInCompare ? "Added" : "Compare"}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Annual Fees", value: formatCurrency(college.fees), icon: <IndianRupee className="h-5 w-5 text-blue-500" />, color: "bg-blue-50" },
          { label: "Placement %", value: `${college.placementPercentage}%`, icon: <TrendingUp className="h-5 w-5 text-green-500" />, color: "bg-green-50" },
          { label: "Avg Package", value: formatPackage(college.averagePackage), icon: <Award className="h-5 w-5 text-purple-500" />, color: "bg-purple-50" },
          { label: "Highest Pkg", value: formatPackage(college.highestPackage), icon: <Award className="h-5 w-5 text-orange-500" />, color: "bg-orange-50" },
        ].map((stat) => (
          <Card key={stat.label} className={cn("border-0", stat.color)}>
            <CardContent className="p-4 flex flex-col items-center text-center gap-1">
              {stat.icon}
              <div className="text-lg font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="w-full md:w-auto mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">Courses ({college.courses.length})</TabsTrigger>
          <TabsTrigger value="placements">Placements</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({college.reviews.length})</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">About {college.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">{college.description}</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Courses Tab */}
        <TabsContent value="courses">
          <div className="space-y-3">
            {college.courses.map((course) => (
              <Card key={course.id}>
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{course.name}</h3>
                    <div className="flex items-center gap-1 text-gray-500 text-xs mt-0.5">
                      <Clock className="h-3 w-3" />
                      {course.duration}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-bold text-blue-700">{formatCurrency(course.fees)}</div>
                    <div className="text-xs text-gray-400">per year</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Placements Tab */}
        <TabsContent value="placements">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Placement Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: "Students Placed", value: `${college.placementPercentage}%`, description: "Placement rate" },
                  { label: "Average Package", value: formatPackage(college.averagePackage), description: "Median CTC offered" },
                  { label: "Highest Package", value: formatPackage(college.highestPackage), description: "Best CTC offered" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm font-medium text-gray-700 mt-1">{stat.label}</div>
                    <div className="text-xs text-gray-500">{stat.description}</div>
                  </div>
                ))}
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1.5">
                  <span>Placement Rate</span>
                  <span className="font-semibold">{college.placementPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all"
                    style={{ width: `${college.placementPercentage}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews">
          <div className="space-y-4">
            {college.reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                        {review.reviewerName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-sm text-gray-900">{review.reviewerName}</div>
                        <div className="text-xs text-gray-400">Student Review</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <StarRating rating={review.rating} />
                      <span className="text-sm font-semibold text-gray-700 ml-1">{review.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <Separator className="my-2" />
                  <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
