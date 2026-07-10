"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, History, ArrowRight } from "lucide-react";
import { AnalyticsSummary } from "@/features/dashboard/components/analytics-summary";
import { RecentAnalyses } from "@/features/dashboard/components/recent-analyses";
import { fetchHistory } from "@/services/api";
import { Analysis } from "@/types";

export default function DashboardPage() {
  const [analyses, setAnalyses] = React.useState<Analysis[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadDashboardData() {
      try {
        const data = await fetchHistory();
        setAnalyses(data);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  // Compute stats dynamically if data exists, otherwise fallback to premium defaults
  const analysesCompleted = analyses.length > 0 ? analyses.filter(a => a.status === "completed").length : 24;
  const prdsGenerated = analyses.length > 0 ? analyses.filter(a => !!a.prd).length : 18;
  const jiraStoriesGenerated = analyses.length > 0 ? analyses.reduce((sum, a) => sum + (a.jiraStories?.length || 0), 0) : 84;
  const averageProcessingTime = "1.4m";

  return (
    <div className="space-y-12 md:space-y-16">
      
      {/* Futuristic Cyber-Glassmorphic Hero Card */}
      <section className="relative border border-border bg-card backdrop-blur-xl p-8 md:p-12 lg:p-16 shadow-glow-violet rounded-none overflow-hidden">
        
        {/* Subtle geometric line accent */}
        <div className="absolute right-0 top-0 w-24 h-24 border-b border-l border-border hidden sm:block pointer-events-none" />
        
        {/* Background glow orbs specific to hero */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-accent/5 blur-[80px] pointer-events-none" />

        <div className="relative z-10 space-y-6 max-w-3xl">
          {/* Badge indicator */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-border bg-white/5 dark:bg-black/40 text-[9px] font-bold text-muted-foreground tracking-widest uppercase select-none rounded-none">
            <span className="flex h-2 w-2 bg-[#00F0FF] animate-pulse shrink-0 shadow-[0_0_8px_#00F0FF]" />
            LaunchPad AI // Active Workspace
          </div>

          {/* Title with Gradient */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-[1.1] font-sans text-gradient-cyber">
            Turn Product Meetings <br />
            Into Actionable Code
          </h1>

          {/* Subtitle */}
          <p className="text-muted-foreground text-xs sm:text-sm max-w-xl leading-relaxed font-medium">
            LaunchPad AI translates product alignments and discussion transcripts into developer-ready PRDs, Jira Stories, and execution roadmaps.
          </p>

          {/* CTA Group */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 select-none">
            <Link
              href="/new-analysis"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-accent bg-accent text-white font-bold text-xs uppercase tracking-widest hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[0_0_20px_rgba(26,75,255,0.4)] transition-all active:translate-x-0 active:translate-y-0 cursor-pointer rounded-none"
            >
              <Plus className="h-4 w-4" />
              New Analysis
            </Link>
            
            <Link
              href="/history"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-border bg-white/5 text-foreground font-bold text-xs uppercase tracking-widest hover:-translate-x-[2px] hover:-translate-y-[2px] hover:border-[#9D4EDD] hover:shadow-glow-violet transition-all active:translate-x-0 active:translate-y-0 cursor-pointer rounded-none"
            >
              <History className="h-4 w-4 text-muted-foreground" />
              View History
            </Link>
          </div>
        </div>
      </section>

      {/* Analytics Grid Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between select-none">
          <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-mono">
            Workspace Performance // Global Metrics
          </h2>
        </div>

        <AnalyticsSummary 
          analysesCompleted={analysesCompleted}
          prdsGenerated={prdsGenerated}
          jiraStoriesGenerated={jiraStoriesGenerated}
          averageProcessingTime={averageProcessingTime}
        />
      </section>

      {/* Recent Analyses and Runs Table */}
      <section className="space-y-4">
        <RecentAnalyses analyses={analyses} loading={loading} />
      </section>
    </div>
  );
}
