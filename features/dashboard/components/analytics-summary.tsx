"use client";

import * as React from "react";
import { FileText, Layers, Workflow, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface AnalyticsSummaryProps {
  analysesCompleted?: number;
  prdsGenerated?: number;
  jiraStoriesGenerated?: number;
  averageProcessingTime?: string;
}

export function AnalyticsSummary({
  analysesCompleted = 24,
  prdsGenerated = 18,
  jiraStoriesGenerated = 84,
  averageProcessingTime = "1.4m"
}: AnalyticsSummaryProps) {
  
  const cards = [
    {
      title: "Analyses Completed",
      value: analysesCompleted,
      description: "Meeting runs processed",
      icon: FileText,
      trend: "+15% this week",
      accentClass: "text-[#9D4EDD]",
      glowColor: "group-hover:shadow-[0_0_25px_rgba(157,78,221,0.2)] border-[#9D4EDD]/15 group-hover:border-[#9D4EDD]/50",
      topAccent: "bg-[#9D4EDD]"
    },
    {
      title: "PRDs Generated",
      value: prdsGenerated,
      description: "Specifications published",
      icon: Layers,
      trend: "100% completion",
      accentClass: "text-[#1A4BFF]",
      glowColor: "group-hover:shadow-[0_0_25px_rgba(26,75,255,0.2)] border-[#1A4BFF]/15 group-hover:border-[#1A4BFF]/50",
      topAccent: "bg-[#1A4BFF]"
    },
    {
      title: "Jira Stories Generated",
      value: jiraStoriesGenerated,
      description: "Ready backlog tickets",
      icon: Workflow,
      trend: "Synced with backlog",
      accentClass: "text-[#00F0FF]",
      glowColor: "group-hover:shadow-[0_0_25px_rgba(0,240,255,0.2)] border-[#00F0FF]/15 group-hover:border-[#00F0FF]/50",
      topAccent: "bg-[#00F0FF]"
    },
    {
      title: "Average Processing Time",
      value: averageProcessingTime,
      description: "Speed per audio analysis",
      icon: Clock,
      trend: "-12s opt. active",
      accentClass: "text-[#FFB703]",
      glowColor: "group-hover:shadow-[0_0_25px_rgba(255,183,3,0.2)] border-[#FFB703]/15 group-hover:border-[#FFB703]/50",
      topAccent: "bg-[#FFB703]"
    }
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card 
            key={index} 
            className={`relative overflow-hidden bg-[#08091E]/40 backdrop-blur-xl border transition-all duration-300 cursor-default rounded-none group hover:-translate-y-[2px] ${card.glowColor}`}
          >
            {/* Top Accent Neon Line */}
            <div className={`absolute top-0 left-0 right-0 h-[2px] w-full ${card.topAccent}`} />

            <CardContent className="p-6 flex flex-col justify-between h-full min-h-[148px]">
              <div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-none font-mono">
                    {card.title}
                  </span>
                  <div className={`p-2 border border-white/5 bg-black/40 transition-colors duration-200 rounded-none ${card.accentClass}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-3xl font-black text-foreground tracking-tight font-sans">
                    {card.value}
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-1.5 font-medium">
                    {card.description}
                  </p>
                </div>
              </div>

              <div className={`mt-5 pt-3 border-t border-white/5 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider font-mono ${card.accentClass}`}>
                <TrendingUp className="h-3 w-3" />
                <span>{card.trend}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
