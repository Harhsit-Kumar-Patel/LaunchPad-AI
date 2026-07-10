"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Analysis } from "@/types";
import { getAnalysisById } from "@/services/mock-data";
import { AnalysisViewer } from "@/features/analysis/components/analysis-viewer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function AnalysisResultPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [analysis, setAnalysis] = React.useState<Analysis | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!id) return;

    let active = true;
    setLoading(true);
    setError(null);

    async function loadAnalysis() {
      try {
        const data = await getAnalysisById(id);
        if (!active) return;

        if (data) {
          setAnalysis(data);
        } else {
          // If not found in primary mocks, check localStorage custom list
          const customAnalyses = localStorage.getItem("copilot_custom_analyses");
          if (customAnalyses) {
            const list = JSON.parse(customAnalyses) as Analysis[];
            const found = list.find((item) => item.id === id);
            if (found) {
              setAnalysis(found);
              setLoading(false);
              return;
            }
          }
          setError("Requested specification could not be located in workspace history.");
        }
      } catch (err: any) {
        if (!active) return;
        setError(err.message || "Failed to load analysis results.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadAnalysis();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-4 w-32 bg-secondary" />
        </div>
        <div className="border border-border rounded-lg bg-card p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-border/40 pb-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 bg-secondary" />
              <Skeleton className="h-8 w-64 bg-secondary" />
              <Skeleton className="h-4 w-40 bg-secondary" />
            </div>
            <Skeleton className="h-8 w-24 rounded-full bg-secondary" />
          </div>
          <div className="flex gap-2 border-b border-border/40 pb-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <Skeleton key={n} className="h-8 w-24 bg-secondary" />
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-2 pt-4">
            <Skeleton className="h-64 w-full bg-secondary" />
            <Skeleton className="h-64 w-full bg-secondary" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 max-w-md mx-auto">
        <AlertCircle className="h-12 w-12 text-red-400" />
        <h2 className="text-lg font-bold text-white">Analysis Not Found</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {error || "The spec you are trying to view does not exist or was deleted."}
        </p>
        <div className="flex items-center gap-3 pt-2">
          <Button
            variant="outline"
            className="flex items-center gap-1.5"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="h-4 w-4" /> Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return <AnalysisViewer analysis={analysis} />;
}
