"use client";

import * as React from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Calendar, 
  FileAudio,
  Eye,
  ListFilter,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";
import { Analysis } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/helpers";

interface RecentAnalysesProps {
  analyses: Analysis[];
  loading: boolean;
}

export function RecentAnalyses({ analyses, loading }: RecentAnalysesProps) {
  const [simulateEmpty, setSimulateEmpty] = React.useState(false);

  // Status mapping to Badge variants with glowing neons
  const getStatusBadge = (status: Analysis["status"]) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="success" className="gap-1 px-2 py-0.5 text-[9px] font-bold font-mono uppercase tracking-wider rounded-none bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.1)]">
            <CheckCircle2 className="h-3.5 w-3.5" /> Completed
          </Badge>
        );
      case "processing":
        return (
          <Badge variant="info" className="gap-1 px-2 py-0.5 text-[9px] font-bold font-mono uppercase tracking-wider animate-pulse rounded-none bg-accent/10 text-accent dark:text-[#00F0FF] border-accent/25 dark:border-[#00F0FF]/25 shadow-[0_0_8px_rgba(0,240,255,0.1)]">
            <span className="h-1.5 w-1.5 bg-accent dark:bg-[#00F0FF] shrink-0 shadow-[0_0_5px_currentColor]" />
            Processing
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="warning" className="gap-1 px-2 py-0.5 text-[9px] font-bold font-mono uppercase tracking-wider rounded-none bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 shadow-[0_0_8px_rgba(245,158,11,0.1)]">
            <Clock className="h-3.5 w-3.5" /> Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="error" className="gap-1 px-2 py-0.5 text-[9px] font-bold font-mono uppercase tracking-wider rounded-none bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20 shadow-[0_0_8px_rgba(239,68,68,0.1)]">
            <AlertCircle className="h-3.5 w-3.5" /> Failed
          </Badge>
        );
      default:
        return <Badge variant="secondary" className="rounded-none">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <Card className="border border-border bg-card backdrop-blur-xl rounded-none shadow-glow-violet">
        <CardHeader>
          <CardTitle>Recent Run History</CardTitle>
          <CardDescription>Loading workspace runs...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-14 w-full animate-pulse bg-white/5 border border-border" />
          ))}
        </CardContent>
      </Card>
    );
  }

  // Determine active item list
  const activeItems = simulateEmpty ? [] : analyses;

  return (
    <Card className="border border-border bg-card backdrop-blur-xl overflow-hidden rounded-none shadow-glow-violet">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 pb-5 border-b border-border select-none">
        <div>
          <CardTitle className="text-sm font-bold text-foreground uppercase tracking-widest flex items-center gap-2 font-mono">
            Recent Analyses
            {!simulateEmpty && activeItems.length > 0 && (
              <span className="text-[9px] font-bold text-accent bg-accent/5 border border-accent/25 px-2 py-0.5 rounded-none font-mono">
                {activeItems.length} runs
              </span>
            )}
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-1 font-medium">
            Access previous transcripts, generated specs, and ticket diagnostics
          </CardDescription>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSimulateEmpty(!simulateEmpty)}
            className="inline-flex h-8 items-center gap-1.5 px-3 border border-border bg-white/5 text-[9px] font-bold text-muted-foreground uppercase tracking-widest hover:text-foreground hover:border-[#9D4EDD]/50 hover:shadow-[0_0_12px_rgba(157,78,221,0.2)] transition-all cursor-pointer"
          >
            <ListFilter className="h-3 w-3" />
            {simulateEmpty ? "Show Mock Data" : "Simulate Empty"}
          </button>

          {!simulateEmpty && activeItems.length > 0 && (
            <Link
              href="/history"
              className="inline-flex h-8 items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
            >
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {activeItems.length === 0 ? (
          /* Glassmorphic Empty State */
          <div className="px-6 py-16 md:py-24 flex flex-col items-center justify-center text-center bg-transparent relative">
            <div className="relative w-12 h-12 mb-5 flex items-center justify-center border border-dashed border-border text-muted-foreground shadow-glow-violet">
              <span className="font-mono text-xs font-bold text-[#9D4EDD]">Ø</span>
            </div>

            <h3 className="text-xs font-bold text-foreground uppercase tracking-widest font-mono">No analyses in this workspace</h3>
            <p className="text-xs text-muted-foreground mt-2 max-w-sm leading-relaxed px-4 font-medium">
              Compile your meeting audio, video transcripts, or raw notes to automatically generate PRDs, stories, and execution plans.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/new-analysis"
                className="inline-flex h-9 items-center justify-center gap-1.5 border border-accent bg-accent text-white px-4 text-xs font-bold uppercase tracking-widest hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[0_0_15px_rgba(26,75,255,0.4)] transition-all active:translate-x-0 active:translate-y-0 cursor-pointer shadow-none rounded-none"
              >
                Start First Analysis
              </Link>
              
              <button
                onClick={() => setSimulateEmpty(false)}
                className="inline-flex h-9 items-center justify-center border border-border bg-white/5 text-muted-foreground px-4 text-xs font-bold uppercase tracking-widest hover:text-foreground hover:border-[#9D4EDD]/50 hover:shadow-[0_0_12px_rgba(157,78,221,0.2)] transition-all cursor-pointer rounded-none"
              >
                Load Sample
              </button>
            </div>
          </div>
        ) : (
          /* Glassmorphic Table Layout */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-[9px] font-bold text-muted-foreground uppercase tracking-widest bg-white/5 select-none font-mono">
                  <th className="px-6 py-4 font-bold">Meeting Name</th>
                  <th className="px-6 py-4 font-bold">Created</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {activeItems.map((analysis) => {
                  return (
                    <tr 
                      key={analysis.id} 
                      className="group/row hover:bg-white/5 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 max-w-sm">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center border border-border bg-white/5 dark:bg-black/45 text-muted-foreground group-hover/row:text-accent group-hover/row:border-accent/30 transition-colors shrink-0">
                            <FileAudio className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <Link 
                              href={`/results/${analysis.id}`} 
                              className="text-xs font-bold text-foreground group-hover/row:text-accent transition-colors truncate block"
                            >
                              {analysis.title}
                            </Link>
                            <span className="text-[10px] text-muted-foreground mt-0.5 truncate block max-w-xs font-mono uppercase tracking-wider">
                              {analysis.decisions?.length || 0} Decisions &bull; {analysis.jiraStories?.length || 0} Stories
                            </span>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 text-xs text-muted-foreground font-mono">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground/40" />
                          <span>{formatDate(analysis.createdAt)}</span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        {getStatusBadge(analysis.status)}
                      </td>
                      
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end">
                          <Link
                            href={`/results/${analysis.id}`}
                            className="inline-flex h-8 items-center justify-center gap-1.5 px-3 border border-border bg-white/5 text-muted-foreground hover:text-foreground hover:border-accent hover:shadow-[0_0_12px_rgba(26,75,255,0.25)] hover:bg-accent/5 transition-all text-[10px] font-bold uppercase tracking-wider cursor-pointer rounded-none"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>View Report</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
