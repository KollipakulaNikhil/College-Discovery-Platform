import { NextRequest, NextResponse } from "next/server";
import { collegeService } from "@/lib/services/college.service";
import { collegesFilterSchema } from "@/validators";
import { ZodError } from "zod";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const filters = collegesFilterSchema.parse({
      search: searchParams.get("search") ?? undefined,
      location: searchParams.get("location") ?? undefined,
      minFees: searchParams.get("minFees") ?? undefined,
      maxFees: searchParams.get("maxFees") ?? undefined,
      rating: searchParams.get("rating") ?? undefined,
      sort: searchParams.get("sort") ?? undefined,
      page: searchParams.get("page") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
    });

    const result = await collegeService.getColleges(filters);
    return NextResponse.json(result, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid filter parameters", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Get colleges error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
