import { NextRequest, NextResponse } from "next/server";
import { createAnalysis } from "../../../services/mock-data";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, transcript } = body;

    if (!transcript || transcript.trim() === "") {
      return NextResponse.json(
        { message: "Transcript content is required." },
        { status: 400 }
      );
    }

    const analysis = await createAnalysis(title, transcript);
    return NextResponse.json(analysis, { status: 200 });
  } catch (error: any) {
    console.error("API /api/analyze error:", error);
    return NextResponse.json(
      { message: error.message || "An unexpected error occurred during analysis." },
      { status: 500 }
    );
  }
}
