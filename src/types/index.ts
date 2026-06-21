export interface College {
  id: string;
  name: string;
  location: string;
  description: string;
  fees: number;
  rating: number;
  placementPercentage: number;
  averagePackage: number;
  highestPackage: number;
  createdAt: Date;
  _count?: {
    courses: number;
    reviews: number;
  };
}

export interface Course {
  id: string;
  collegeId: string;
  name: string;
  duration: string;
  fees: number;
}

export interface Review {
  id: string;
  collegeId: string;
  rating: number;
  reviewerName: string;
  comment: string;
}

export interface CollegeDetail extends College {
  courses: Course[];
  reviews: Review[];
  _count: {
    courses: number;
    reviews: number;
    savedByUsers: number;
  };
}

export interface CollegeFilters {
  search?: string;
  location?: string;
  minFees?: number;
  maxFees?: number;
  rating?: number;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface CollegesResponse {
  colleges: College[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SavedCollege {
  id: string;
  userId: string;
  collegeId: string;
  createdAt: Date;
  college: College;
}

export interface ApiError {
  error: string;
  details?: unknown;
}

export type SortOption = "rating_desc" | "rating_asc" | "fees_asc" | "fees_desc" | "name_asc";
