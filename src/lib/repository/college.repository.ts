import { prisma } from "@/lib/prisma";
import type { CollegeFilters, CollegesResponse } from "@/types";

export class CollegeRepository {
  async findMany(filters: CollegeFilters): Promise<CollegesResponse> {
    const {
      search,
      location,
      minFees,
      maxFees,
      rating,
      sort = "rating_desc",
      page = 1,
      limit = 10,
    } = filters;

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
      ];
    }

    if (location) {
      where.location = { contains: location, mode: "insensitive" };
    }

    if (minFees !== undefined || maxFees !== undefined) {
      where.fees = {};
      if (minFees !== undefined) (where.fees as Record<string, number>).gte = minFees;
      if (maxFees !== undefined) (where.fees as Record<string, number>).lte = maxFees;
    }

    if (rating !== undefined) {
      where.rating = { gte: rating };
    }

    const orderBy = this.buildOrderBy(sort);
    const skip = (page - 1) * limit;

    const [colleges, total] = await Promise.all([
      prisma.college.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.college.count({ where }),
    ]);

    return {
      colleges,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string) {
    return prisma.college.findUnique({
      where: { id },
      include: {
        courses: true,
        reviews: true,
        _count: {
          select: { savedByUsers: true },
        },
      },
    });
  }

  async findByIds(ids: string[]) {
    return prisma.college.findMany({
      where: { id: { in: ids } },
      include: {
        courses: true,
        reviews: true,
      },
    });
  }

  async getLocations(): Promise<string[]> {
    const results = await prisma.college.findMany({
      select: { location: true },
      distinct: ["location"],
      orderBy: { location: "asc" },
    });
    return results.map((r: { location: string }) => r.location);
  }

  private buildOrderBy(sort: string): Record<string, "asc" | "desc"> {
    switch (sort) {
      case "rating_asc":
        return { rating: "asc" };
      case "rating_desc":
        return { rating: "desc" };
      case "fees_asc":
        return { fees: "asc" };
      case "fees_desc":
        return { fees: "desc" };
      case "name_asc":
        return { name: "asc" };
      default:
        return { rating: "desc" };
    }
  }
}

export const collegeRepository = new CollegeRepository();
