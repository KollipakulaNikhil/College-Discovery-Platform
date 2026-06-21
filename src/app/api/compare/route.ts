import { NextRequest, NextResponse } from "next/server";
import { collegeService } from "@/lib/services/college.service";
import { ZodError } from "zod";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get("ids");

    if (!idsParam) {
      return NextResponse.json(
        { error: "Please provide college IDs to compare" },
        { status: 400 }
      );
    }

    const ids = idsParam.split(",").filter(Boolean);

    if (ids.length < 2 || ids.length > 3) {
      return NextResponse.json(
        { error: "Please select 2 or 3 colleges to compare" },
        { status: 400 }
      );
    }

    const colleges = await collegeService.getCollegesForComparison(ids);
    return NextResponse.json({ colleges }, {
      headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=240" },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid parameters", details: error.errors },
        { status: 400 }
      );
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Compare error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
