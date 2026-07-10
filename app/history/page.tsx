"use client";

import * as React from "react";
import Link from "next/link";
import { 
  History, 
  Search, 
  SlidersHorizontal, 
  Calendar, 
  BadgeCheck, 
  ShieldAlert, 
  Layers, 
  Workflow, 
  Cpu,
  Trash2,
  ExternalLink
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function HistoryPage() {
  const [filter, setFilter] = React.useState("all");
  const [searchFocused, setSearchFocused] = React.useState(false);

  // High-fidelity mock history data
  const historyItems = [
    {
      id: "billing-system-arch",
      title: "Billing System Architecture Review",
      date: "2 hours ago",
      decisions: 8,
      actions: 12,
      readiness: 94,
      status: "High Alignment",
      category: "architecture",
      description: "Discussion about shifting from monthly flat rate to usage-based Stripe billing."
    },
    {
      id: "auth-migration-mfa",
      title: "Auth Migration & MFA Setup",
      date: "5 hours ago",
      decisions: 6,
      actions: 10,
      readiness: 88,
      status: "Aligned",
      category: "security",
      description: "Aligning on moving from custom JWT cookies to Auth0 with mandatory MFA."
    },
    {
      id: "push-notifications-sync",
      title: "Mobile App Push Notifications Sync",
      date: "Yesterday",
      decisions: 14,
      actions: 22,
      readiness: 64,
      status: "Needs Review",
      category: "feature",
      description: "Weekly sync regarding APNS & FCM integrations for iOS & Android push channels."
    },
    {
      id: "realtime-collaboration-spec",
      title: "Realtime Collaboration Protocol Spec",
      date: "3 days ago",
      decisions: 18,
      actions: 30,
      readiness: 48,
      status: "Low Alignment",
      category: "architecture",
      description: "Debate on Yjs vs Automerge for CRDT replication in document multiplayer rooms."
    }
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-border pb-6 select-none">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground flex items-center gap-2 uppercase">
            <History className="h-5 w-5 text-accent" /> Analysis History
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl font-medium">
            Access previous transcripts, alignment matrices, generated specifications, and synchronize logs.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center select-none">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none font-mono">
          {["all", "architecture", "security", "feature"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 border-2 text-[10px] font-bold uppercase tracking-widest transition-all shrink-0 cursor-pointer rounded-none ${
                filter === cat
                  ? "bg-accent text-white border-accent shadow-hard-sm"
                  : "bg-background text-muted-foreground border-border-strong hover:text-foreground hover:border-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Local Search Input */}
        <div className="flex items-center gap-2.5">
          <div className={`relative flex items-center w-full md:w-64 border-2 transition-all duration-200 bg-card rounded-none ${
            searchFocused ? "border-accent shadow-hard-sm" : "border-border hover:border-border-strong"
          }`}>
            <Search className="absolute left-3 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <input 
              type="text" 
              placeholder="Search history..." 
              className="w-full h-9 pl-9 pr-4 text-xs bg-transparent border-0 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-0 font-mono"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>

          <button className="h-9 w-9 border-2 border-border hover:border-foreground bg-background hover:bg-muted/40 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all cursor-pointer rounded-none">
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* History Items Grid */}
      <div className="space-y-4">
        {historyItems
          .filter(item => filter === "all" || item.category === filter)
          .map((item) => {
            const isHigh = item.readiness >= 80;
            const isMedium = item.readiness >= 50 && item.readiness < 80;
            const isLow = item.readiness < 50;

            return (
              <div 
                key={item.id} 
                className="group relative border-2 border-border bg-card p-5 md:p-6 hover:bg-muted/10 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-hard-md transition-all duration-250 flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-none shadow-hard-sm"
              >
                <div className="space-y-3.5 max-w-2xl">
                  {/* Category & Date */}
                  <div className="flex items-center gap-2 select-none font-mono">
                    <span className="text-[9px] font-bold text-accent bg-accent/5 px-2 py-0.5 border-2 border-accent/20 uppercase tracking-widest rounded-none">
                      {item.category}
                    </span>
                    <span className="text-border-strong text-[10px]">&bull;</span>
                    <span className="text-muted-foreground text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" /> {item.date}
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-foreground group-hover:text-accent transition-colors uppercase font-sans">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed font-medium">
                      {item.description}
                    </p>
                  </div>

                  {/* Document Metrics */}
                  <div className="flex flex-wrap items-center gap-3 text-[9px] text-muted-foreground font-mono uppercase tracking-wider select-none">
                    <span className="flex items-center gap-1.5 bg-background px-2.5 py-1 border-2 border-border">
                      <Cpu className="h-3 w-3" /> {item.decisions} Decisions
                    </span>
                    <span className="flex items-center gap-1.5 bg-background px-2.5 py-1 border-2 border-border">
                      <Layers className="h-3 w-3" /> PRD
                    </span>
                    <span className="flex items-center gap-1.5 bg-background px-2.5 py-1 border-2 border-border">
                      <Workflow className="h-3 w-3" /> {item.actions} Stories
                    </span>
                  </div>
                </div>

                {/* Right Side Info & Actions */}
                <div className="flex items-center md:items-end justify-between md:flex-col gap-4 shrink-0 select-none">
                  {/* Readiness Status indicator */}
                  <div className="text-left md:text-right">
                    <span className="text-[9px] text-muted-foreground block mb-1 font-mono uppercase tracking-widest">Readiness Index</span>
                    <div className="flex items-center gap-1.5 justify-end">
                      {isHigh ? (
                        <BadgeCheck className="h-4 w-4 text-emerald-500" />
                      ) : isLow ? (
                        <ShieldAlert className="h-4 w-4 text-red-500" />
                      ) : (
                        <div className="h-3 w-3 bg-amber-500 shrink-0" />
                      )}
                      <span className={`text-xs font-bold font-mono ${
                        isHigh ? "text-emerald-500" : isLow ? "text-red-500" : "text-amber-500"
                      }`}>
                        {item.readiness}% ({item.status})
                      </span>
                    </div>
                  </div>

                  {/* View Details Link */}
                  <div className="flex items-center gap-2">
                    <button className="h-8.5 w-8.5 border-2 border-border bg-background hover:bg-muted text-muted-foreground hover:text-red-500 flex items-center justify-center transition-colors rounded-none cursor-pointer">
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <Link
                      href={`/results/${item.id}`}
                      className="inline-flex h-8.5 items-center justify-center gap-1.5 border-2 border-accent bg-accent text-white px-4 text-[10px] font-bold uppercase tracking-widest hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-sm transition-all active:translate-x-0 active:translate-y-0 cursor-pointer rounded-none shadow-none"
                    >
                      View Report <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
