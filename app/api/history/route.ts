import { NextResponse } from "next/server";
import { getHistory } from "../../../services/mock-data";

export async function GET() {
  try {
    const history = await getHistory();
    return NextResponse.json(history, { status: 200 });
  } catch (error: any) {
    console.error("API /api/history error:", error);
    return NextResponse.json(
      { message: error.message || "An unexpected error occurred while fetching history." },
      { status: 500 }
    );
  }
}
