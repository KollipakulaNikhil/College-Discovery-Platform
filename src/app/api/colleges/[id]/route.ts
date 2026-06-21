import { NextRequest, NextResponse } from "next/server";
import { collegeService } from "@/lib/services/college.service";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const college = await collegeService.getCollegeById(id);

    if (!college) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    return NextResponse.json(college, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch (error) {
    console.error("Get college error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
