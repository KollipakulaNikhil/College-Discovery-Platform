import { unstable_cache } from "next/cache";
import { collegeRepository } from "@/lib/repository/college.repository";
import type { CollegeFilters, CollegesResponse, CollegeDetail } from "@/types";

// Locations almost never change – cache for 1 hour
const getCachedLocations = unstable_cache(
  () => collegeRepository.getLocations(),
  ["locations"],
  { revalidate: 3600, tags: ["locations"] }
);

// College listing – cache 60s; key includes all filter params automatically
const getCachedColleges = unstable_cache(
  (filters: CollegeFilters) => collegeRepository.findMany(filters),
  ["colleges-list"],
  { revalidate: 60, tags: ["colleges"] }
);

// College detail – cache 5 min
const getCachedCollegeById = unstable_cache(
  (id: string) => collegeRepository.findById(id),
  ["college-detail"],
  { revalidate: 300, tags: ["colleges"] }
);

// Compare – cache 2 min
const getCachedCompare = unstable_cache(
  (ids: string[]) => collegeRepository.findByIds(ids),
  ["college-compare"],
  { revalidate: 120, tags: ["colleges"] }
);

export class CollegeService {
  async getColleges(filters: CollegeFilters): Promise<CollegesResponse> {
    return getCachedColleges(filters);
  }

  async getCollegeById(id: string): Promise<CollegeDetail | null> {
    const college = await getCachedCollegeById(id);
    if (!college) return null;
    return college as CollegeDetail;
  }

  async getCollegesForComparison(ids: string[]) {
    if (ids.length < 2 || ids.length > 3) {
      throw new Error("Please select 2 or 3 colleges to compare");
    }
    const colleges = await getCachedCompare(ids);
    if (colleges.length !== ids.length) {
      throw new Error("One or more colleges not found");
    }
    return colleges;
  }

  async getLocations(): Promise<string[]> {
    return getCachedLocations();
  }
}

export const collegeService = new CollegeService();
