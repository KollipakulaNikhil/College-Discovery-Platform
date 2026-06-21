import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { savedService } from "@/lib/services/saved.service";
import { savedCollegeSchema } from "@/validators";
import { ZodError } from "zod";

async function getUserId(request: NextRequest): Promise<string | null> {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  return token?.id ?? null;
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const saved = await savedService.getSavedColleges(userId);
    return NextResponse.json({ saved });
  } catch (error) {
    console.error("Get saved error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { collegeId } = savedCollegeSchema.parse(body);

    const saved = await savedService.saveCollege(userId, collegeId);
    return NextResponse.json({ message: "College saved", saved }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Save college error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const collegeId = searchParams.get("collegeId");

    if (!collegeId) {
      return NextResponse.json({ error: "College ID is required" }, { status: 400 });
    }

    await savedService.unsaveCollege(userId, collegeId);
    return NextResponse.json({ message: "College removed from saved" });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Delete saved error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
