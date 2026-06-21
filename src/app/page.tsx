import { Suspense } from "react";
import { CollegeListClient } from "@/components/CollegeListClient";
import { SearchBar } from "@/components/SearchBar";
import { Filters } from "@/components/Filters";
import { collegeService } from "@/lib/services/college.service";
import { collegesFilterSchema } from "@/validators";
import { GraduationCap, Search, BookOpen, Award } from "lucide-react";

interface HomePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;

  const filters = collegesFilterSchema.parse({
    search: params.search,
    location: params.location,
    minFees: params.minFees,
    maxFees: params.maxFees,
    rating: params.rating,
    sort: params.sort,
    page: params.page,
    limit: params.limit,
  });

  const [initialData, locations] = await Promise.all([
    collegeService.getColleges(filters),
    collegeService.getLocations(),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <GraduationCap className="h-14 w-14 text-blue-200" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Your Perfect College
          </h1>
          <p className="text-blue-100 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Explore 100+ top colleges across India. Compare fees, ratings, placements
            and make the best decision for your future.
          </p>
          <SearchBar initialSearch={params.search as string | undefined} />
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: <BookOpen className="h-6 w-6" />, stat: "100+", label: "Colleges Listed" },
            { icon: <Search className="h-6 w-6" />, stat: "25+", label: "Cities Covered" },
            { icon: <Award className="h-6 w-6" />, stat: "500+", label: "Courses Available" },
            { icon: <GraduationCap className="h-6 w-6" />, stat: "10K+", label: "Student Reviews" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-1">
              <div className="text-blue-600">{item.icon}</div>
              <div className="text-2xl font-bold text-gray-900">{item.stat}</div>
              <div className="text-sm text-gray-500">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <Filters locations={locations} currentParams={params} />
          </aside>

          {/* College List */}
          <div className="flex-1">
            <Suspense fallback={null}>
              <CollegeListClient
                initialData={initialData}
                currentParams={params}
              />
            </Suspense>
          </div>
        </div>
      </section>
    </div>
  );
}
