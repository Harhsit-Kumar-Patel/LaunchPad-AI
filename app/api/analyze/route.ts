import { NextRequest, NextResponse } from "next/server";
import { crypto } from "next/dist/compiled/@edge-runtime/primitives"; // Vercel Edge/Node compatibility or global crypto
import { AnalyzeRequestSchema } from "../../../types/analysis";
import { AnalysisService } from "../../../services/analysis.service";
import { Analysis } from "../../../types";

// Helper for generating UUIDs across edge and Node runtimes safely
function generateUUID(): string {
  if (typeof window === "undefined" && typeof global !== "undefined") {
    // Node.js environment
    try {
      const nodeCrypto = require("crypto");
      return nodeCrypto.randomUUID();
    } catch {
      // Fallback below
    }
  }
  return "analysis-" + Math.random().toString(36).substring(2, 15) + "-" + Date.now();
}

export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch (jsonErr) {
      return NextResponse.json(
        { message: "Malformed request body. Please submit valid JSON." },
        { status: 400 }
      );
    }

    // Validate request schema using Zod
    const validation = AnalyzeRequestSchema.safeParse(body);
    if (!validation.success) {
      const errorMsg = validation.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; ");
      return NextResponse.json(
        { message: `Invalid input parameters: ${errorMsg}` },
        { status: 400 }
      );
    }

    const { title, transcript } = validation.data;
    const finalTitle = title || `Meeting Analysis - ${new Date().toLocaleDateString()}`;

    // Invoke the analysis core service
    const serviceResult = await AnalysisService.analyze(transcript, finalTitle);

    // Map service outputs to frontend spec representation including workspace metadata
    const completedAnalysis: Analysis = {
      id: generateUUID(),
      title: finalTitle,
      createdAt: new Date().toISOString(),
      transcript,
      status: "completed",
      summary: serviceResult.summary,
      decisions: serviceResult.decisions,
      actionItems: serviceResult.actionItems,
      prd: serviceResult.prd,
      jiraStories: serviceResult.jiraStories,
      readinessCheck: serviceResult.readinessCheck,
    };

    return NextResponse.json(completedAnalysis, { status: 200 });
  } catch (error: any) {
    console.error("API Error in /api/analyze route:", error);

    const errorMessage = error.message || "An unexpected system error occurred during analysis.";
    
    // Check if it represents a request timeout (gateway timeout)
    if (errorMessage.includes("timed out") || errorMessage.includes("timeout")) {
      return NextResponse.json(
        { message: errorMessage },
        { status: 504 }
      );
    }

    // Default error status code
    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
}
