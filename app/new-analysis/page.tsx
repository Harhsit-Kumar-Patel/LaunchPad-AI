"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { useAnalysis } from "@/hooks/use-analysis";
import { TranscriptInput } from "@/features/analysis/components/transcript-input";

export default function NewAnalysisPage() {
  const router = useRouter();
  const { analyze, loading } = useAnalysis();

  const handleAnalyze = async (title: string, transcript: string) => {
    const result = await analyze(title, transcript);
    // Redirect to results loading page
    router.push(`/new-analysis/loading?id=${result.id}`);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="border-b-2 border-border pb-5 select-none">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground flex items-center gap-2 uppercase">
          <Sparkles className="h-5 w-5 text-accent" /> New Analysis
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl font-medium">
          Paste or upload your meeting transcript to generate execution-ready artifacts.
        </p>
      </div>

      {/* Main input workspace form */}
      <TranscriptInput onAnalyze={handleAnalyze} loading={loading} />
    </div>
  );
}
