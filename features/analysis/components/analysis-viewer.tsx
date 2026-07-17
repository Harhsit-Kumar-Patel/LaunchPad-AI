"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Calendar, 
  Layers, 
  CheckSquare, 
  Landmark, 
  FileText, 
  Activity, 
  ArrowLeft,
  Copy,
  Check,
  Download,
  RotateCcw,
  Edit3,
  Save,
  Printer
} from "lucide-react";
import { Analysis } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/utils/helpers";

// Import individual subcomponents
import { SummaryView } from "./analysis-tabs/summary-view";
import { DecisionsView } from "./analysis-tabs/decisions-view";
import { ActionItemsView } from "./analysis-tabs/action-items-view";
import { PRDView } from "./analysis-tabs/prd-view";
import { JiraView } from "./analysis-tabs/jira-view";
import { ReadinessView } from "./analysis-tabs/readiness-view";

interface AnalysisViewerProps {
  analysis: Analysis;
}

export function AnalysisViewer({ analysis }: AnalysisViewerProps) {
  const router = useRouter();
  const [currentAnalysis, setCurrentAnalysis] = React.useState<Analysis>(analysis);
  const [isEditing, setIsEditing] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("summary");
  const [copied, setCopied] = React.useState(false);

  // Sync state if analysis prop changes
  React.useEffect(() => {
    setCurrentAnalysis(analysis);
  }, [analysis]);

  // Handle local save trigger
  const handleSave = () => {
    setIsEditing(false);
    
    // Save to localStorage under custom list
    const customAnalysesStr = localStorage.getItem("copilot_custom_analyses");
    let list: Analysis[] = [];
    if (customAnalysesStr) {
      list = JSON.parse(customAnalysesStr) as Analysis[];
    }
    
    const idx = list.findIndex((item) => item.id === currentAnalysis.id);
    if (idx !== -1) {
      list[idx] = currentAnalysis;
    } else {
      list.push(currentAnalysis);
    }
    
    localStorage.setItem("copilot_custom_analyses", JSON.stringify(list));
  };

  // Handle clipboard copy based on active tab content
  const handleCopy = () => {
    let copyText = "";
    
    switch (activeTab) {
      case "summary":
        copyText = `SUMMARY:\n${currentAnalysis.summary}`;
        break;
      case "decisions":
        copyText = `KEY DECISIONS:\n` + currentAnalysis.decisions.map(d => `- ${d.title} (Status: ${d.status}, Owner: ${d.owner})\n  ${d.description}`).join("\n\n");
        break;
      case "action-items":
        copyText = `ACTION ITEMS:\n` + currentAnalysis.actionItems.map(a => `- [${a.status === "completed" ? "x" : " "}] ${a.title} (Assignee: ${a.assignee}, Due: ${a.dueDate}, Priority: ${a.priority})`).join("\n");
        break;
      case "prd":
        copyText = `PRD: ${currentAnalysis.prd.title}\n\nOverview:\n${currentAnalysis.prd.overview}\n\nProblem Statement:\n${currentAnalysis.prd.problemStatement}\n\nUser Stories:\n` + currentAnalysis.prd.userStories.map(s => `- ${s}`).join("\n") + `\n\nRequirements:\n` + currentAnalysis.prd.functionalRequirements.map((r, i) => `F-${i+1}: ${r}`).join("\n");
        break;
      case "jira":
        copyText = `JIRA STORIES:\n` + currentAnalysis.jiraStories.map(s => `[${s.key}] ${s.title} (${s.points} SP, Priority: ${s.priority})\nDescription: ${s.description}\nAcceptance Criteria:\n` + s.acceptanceCriteria.map(ac => `- ${ac}`).join("\n")).join("\n\n");
        break;
      case "readiness":
        copyText = `EXECUTION READINESS HEALTH SCORE: ${currentAnalysis.readinessCheck.score}%\nStatus: ${currentAnalysis.readinessCheck.status}\n\nBlockers:\n` + currentAnalysis.readinessCheck.blockers.map(b => `- ${b}`).join("\n") + `\n\nMissing Items:\n` + currentAnalysis.readinessCheck.missingInfo.map(m => `- ${m}`).join("\n");
        break;
      default:
        copyText = JSON.stringify(currentAnalysis, null, 2);
    }

    navigator.clipboard.writeText(copyText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Handle complete export of entire spec to Markdown download file
  const handleExport = () => {
    const md = `# Workspace Report: ${currentAnalysis.title}
Created on: ${formatDate(currentAnalysis.createdAt)}
Readiness Score: ${currentAnalysis.readinessCheck.score}% (${currentAnalysis.readinessCheck.status.toUpperCase()})

---

## 1. Executive Summary
${currentAnalysis.summary}

---

## 2. Key Decisions
${currentAnalysis.decisions.map(d => `### [${d.status.toUpperCase()}] ${d.title}
- **Owner**: ${d.owner}
- **Details**: ${d.description}`).join("\n\n")}

---

## 3. Action Items Checklist
${currentAnalysis.actionItems.map(a => `- [${a.status === "completed" ? "x" : " "}] **${a.title}** | Assignee: ${a.assignee} | Due: ${a.dueDate} | Priority: ${a.priority}`).join("\n")}

---

## 4. Product Requirements Document (PRD)
### ${currentAnalysis.prd.title}

#### Overview
${currentAnalysis.prd.overview}

#### Problem Statement
${currentAnalysis.prd.problemStatement}

#### User Stories
${currentAnalysis.prd.userStories.map(s => `- ${s}`).join("\n")}

#### Functional Requirements
${currentAnalysis.prd.functionalRequirements.map((r, i) => `- **F-${i+1}**: ${r}`).join("\n")}

#### Out of Scope
${currentAnalysis.prd.outOfScope.map(o => `- ${o}`).join("\n")}

---

## 5. Jira Backlog Stories
${currentAnalysis.jiraStories.map(s => `### [${s.key}] ${s.title} (${s.points} SP, Priority: ${s.priority})
**Description**:
${s.description}

**Acceptance Criteria**:
${s.acceptanceCriteria.map(ac => `- ${ac}`).join("\n")}`).join("\n\n")}

---

## 6. Execution Readiness Diagnostic Details
- **Score**: ${currentAnalysis.readinessCheck.score}%
- **Status**: ${currentAnalysis.readinessCheck.status.toUpperCase()}

### Blockers
${currentAnalysis.readinessCheck.blockers.length === 0 ? "No blockers detected." : currentAnalysis.readinessCheck.blockers.map(b => `- ${b}`).join("\n")}

### Missing Items
${currentAnalysis.readinessCheck.missingInfo.length === 0 ? "No missing details identified." : currentAnalysis.readinessCheck.missingInfo.map(m => `- ${m}`).join("\n")}

### Recommendations
${currentAnalysis.readinessCheck.recommendations.map(r => `- ${r}`).join("\n")}
`;

    const blob = new Blob([md], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${currentAnalysis.title.toLowerCase().replace(/\s+/g, "-")}-report.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Re-run animation loading route
  const handleRegenerate = () => {
    router.push(`/new-analysis/loading?id=${currentAnalysis.id}`);
  };

  const isReady = currentAnalysis.readinessCheck.score >= 80;
  const isBlocked = currentAnalysis.readinessCheck.score < 50;

  return (
    <div className="space-y-6 font-sans">
      {/* Back link */}
      <div className="select-none flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3 w-3" /> Back to Workspace
        </Link>
      </div>

      {/* Main card containing header details */}
      <Card className="border border-border bg-card shadow-glow-violet rounded-none overflow-hidden">
        <CardHeader className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-border p-6 select-none">
          <div className="space-y-2.5 flex-1 min-w-0">
            <span className="text-[9px] font-bold text-accent uppercase tracking-widest font-mono block">
              Execution Spec // Analysis Completed
            </span>
            {isEditing ? (
              <Input
                value={currentAnalysis.title}
                onChange={(e) => setCurrentAnalysis({ ...currentAnalysis, title: e.target.value })}
                className="text-xl sm:text-2xl font-black tracking-tight text-foreground uppercase bg-white/5 border border-border h-10 rounded-none max-w-lg focus:border-accent"
              />
            ) : (
              <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-foreground uppercase truncate">
                {currentAnalysis.title}
              </CardTitle>
            )}
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
              <Calendar className="h-3.5 w-3.5" />
              <span>Analyzed on {formatDate(currentAnalysis.createdAt)}</span>
            </div>
          </div>

          {/* Actions Toolbar & Diagnostic Score */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="flex items-center border border-border bg-white/5 p-1 rounded-none mr-1">
              {/* Copy */}
              <button
                onClick={handleCopy}
                className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent hover:border-border transition-all cursor-pointer rounded-none"
                title="Copy active tab details"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              </button>

              {/* Export */}
              <button
                onClick={handleExport}
                className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent hover:border-border transition-all cursor-pointer rounded-none"
                title="Export report as Markdown"
              >
                <Download className="h-4 w-4" />
              </button>

              {/* Print/PDF */}
              <button
                onClick={() => window.print()}
                className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent hover:border-border transition-all cursor-pointer rounded-none"
                title="Download report as PDF (Print)"
              >
                <Printer className="h-4 w-4" />
              </button>

              {/* Regenerate */}
              <button
                onClick={handleRegenerate}
                className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent hover:border-border transition-all cursor-pointer rounded-none"
                title="Simulate analysis regeneration"
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              {/* Edit/Save */}
              {isEditing ? (
                <button
                  onClick={handleSave}
                  className="h-8 w-8 flex items-center justify-center text-accent hover:text-foreground hover:bg-accent/5 border border-transparent hover:border-border transition-all cursor-pointer rounded-none font-bold"
                  title="Save updates"
                >
                  <Save className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent hover:border-border transition-all cursor-pointer rounded-none"
                  title="Edit spec details"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
              )}
            </div>

            <Badge
              variant={
                isReady ? "success" : isBlocked ? "error" : "warning"
              }
              className="text-[10px] font-bold px-3 py-1.5 font-mono uppercase tracking-wider rounded-none shrink-0"
            >
              Readiness: {currentAnalysis.readinessCheck.score}%
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="summary" className="w-full">
            <div className="border-b border-border bg-white/[0.015] px-6 py-3 select-none">
              <TabsList className="flex flex-wrap gap-1.5 bg-transparent p-0 border-0 h-auto w-auto">
                <TabsTrigger value="summary" className="gap-2 text-[10px] font-bold uppercase tracking-wider font-mono px-3 py-2 rounded-none border border-transparent data-[state=active]:bg-white/5 data-[state=active]:border-border data-[state=active]:text-foreground">
                  <FileText className="h-4 w-4 shrink-0" /> Summary
                </TabsTrigger>
                <TabsTrigger value="decisions" className="gap-2 text-[10px] font-bold uppercase tracking-wider font-mono px-3 py-2 rounded-none border border-transparent data-[state=active]:bg-white/5 data-[state=active]:border-border data-[state=active]:text-foreground">
                  <Landmark className="h-4 w-4 shrink-0" /> Key Decisions
                </TabsTrigger>
                <TabsTrigger value="action-items" className="gap-2 text-[10px] font-bold uppercase tracking-wider font-mono px-3 py-2 rounded-none border border-transparent data-[state=active]:bg-white/5 data-[state=active]:border-border data-[state=active]:text-foreground">
                  <CheckSquare className="h-4 w-4 shrink-0" /> Action Items
                </TabsTrigger>
                <TabsTrigger value="prd" className="gap-2 text-[10px] font-bold uppercase tracking-wider font-mono px-3 py-2 rounded-none border border-transparent data-[state=active]:bg-white/5 data-[state=active]:border-border data-[state=active]:text-foreground">
                  <Layers className="h-4 w-4 shrink-0" /> PRD
                </TabsTrigger>
                <TabsTrigger value="jira" className="gap-2 text-[10px] font-bold uppercase tracking-wider font-mono px-3 py-2 rounded-none border border-transparent data-[state=active]:bg-white/5 data-[state=active]:border-border data-[state=active]:text-foreground">
                  <Layers className="h-4 w-4 shrink-0" /> Jira Stories
                </TabsTrigger>
                <TabsTrigger value="readiness" className="gap-2 text-[10px] font-bold uppercase tracking-wider font-mono px-3 py-2 rounded-none border border-transparent data-[state=active]:bg-white/5 data-[state=active]:border-border data-[state=active]:text-foreground">
                  <Activity className="h-4 w-4 shrink-0" /> Execution Readiness
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="summary" className="m-0">
                <SummaryView 
                  summary={currentAnalysis.summary} 
                  transcript={currentAnalysis.transcript}
                  isEditing={isEditing}
                  onChange={(val) => setCurrentAnalysis({ ...currentAnalysis, summary: val })}
                />
              </TabsContent>

              <TabsContent value="decisions" className="m-0">
                <DecisionsView 
                  decisions={currentAnalysis.decisions}
                  isEditing={isEditing}
                  onChange={(val) => setCurrentAnalysis({ ...currentAnalysis, decisions: val })}
                />
              </TabsContent>

              <TabsContent value="action-items" className="m-0">
                <ActionItemsView 
                  actionItems={currentAnalysis.actionItems}
                  isEditing={isEditing}
                  onChange={(val) => setCurrentAnalysis({ ...currentAnalysis, actionItems: val })}
                />
              </TabsContent>

              <TabsContent value="prd" className="m-0">
                <PRDView 
                  prd={currentAnalysis.prd}
                  isEditing={isEditing}
                  onChange={(val) => setCurrentAnalysis({ ...currentAnalysis, prd: val })}
                />
              </TabsContent>

              <TabsContent value="jira" className="m-0">
                <JiraView 
                  stories={currentAnalysis.jiraStories}
                  isEditing={isEditing}
                  onChange={(val) => setCurrentAnalysis({ ...currentAnalysis, jiraStories: val })}
                />
              </TabsContent>

              <TabsContent value="readiness" className="m-0">
                <ReadinessView 
                  check={currentAnalysis.readinessCheck}
                  isEditing={isEditing}
                  onChange={(val) => setCurrentAnalysis({ ...currentAnalysis, readinessCheck: val })}
                />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
