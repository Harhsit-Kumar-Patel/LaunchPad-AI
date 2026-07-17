import { FileSpreadsheet, Compass, CheckCircle2, ShieldAlert, Activity, Target } from "lucide-react";
import { PRD } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface PRDViewProps {
  prd: PRD;
  isEditing?: boolean;
  onChange?: (val: PRD) => void;
}

export function PRDView({ prd, isEditing = false, onChange }: PRDViewProps) {
  const handleUpdate = (fields: Partial<PRD>) => {
    if (!onChange) return;
    onChange({ ...prd, ...fields });
  };

  if (!prd) {
    return (
      <div className="flex flex-col items-center justify-center py-16 border border-dashed border-white/10 bg-black/20 select-none rounded-none font-sans">
        <FileSpreadsheet className="h-8 w-8 text-muted-foreground mb-4" />
        <h4 className="text-xs font-bold text-foreground uppercase tracking-widest font-mono">No PRD Generated</h4>
        <p className="text-xs text-muted-foreground mt-2 max-w-[280px] leading-relaxed text-center">
          Unable to generate requirements for this segment.
        </p>
      </div>
    );
  }

  // Gracefully read successMetrics with empty state fallback
  const successMetrics = prd.successMetrics || [];

  return (
    <div className="space-y-8 max-w-4xl mx-auto font-sans">
      <div className="flex items-center justify-between border-b border-white/5 pb-4 select-none">
        <div className="space-y-1.5 flex-1 min-w-0">
          <span className="text-[9px] font-bold text-accent uppercase tracking-widest font-mono block">
            Document Spec // Product Requirements
          </span>
          {isEditing ? (
            <Input
              value={prd.title}
              onChange={(e) => handleUpdate({ title: e.target.value })}
              className="text-xl font-black text-foreground bg-white/5 border border-border h-8 rounded-none max-w-md uppercase focus-visible:ring-0"
            />
          ) : (
            <h2 className="text-xl font-black text-foreground tracking-tight uppercase truncate">
              {prd.title}
            </h2>
          )}
        </div>
      </div>

      {/* Problem Statement & Success Metrics */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Problem Statement Card */}
        <Card className="border border-white/10 bg-[#08091E]/40 backdrop-blur-xl hover:border-[#FFB703] hover:-translate-y-[2px] hover:shadow-[0_0_20px_rgba(255,183,3,0.15)] transition-all duration-300 rounded-none shadow-none">
          <CardContent className="p-6 space-y-3">
            <h3 className="text-[10px] font-bold text-[#FFB703] uppercase tracking-widest flex items-center gap-2 font-mono select-none">
              <ShieldAlert className="h-4 w-4 text-[#FFB703]" /> Problem Statement
            </h3>
            {isEditing ? (
              <Textarea
                value={prd.problemStatement}
                onChange={(e) => handleUpdate({ problemStatement: e.target.value })}
                className="text-xs text-muted-foreground bg-white/5 border border-white/10 rounded-none min-h-[120px] focus-visible:ring-0"
              />
            ) : (
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
                {prd.problemStatement || "No problem statement specified."}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Success Metrics Card */}
        <Card className="border border-white/10 bg-[#08091E]/40 backdrop-blur-xl hover:border-[#00F5A0] hover:-translate-y-[2px] hover:shadow-[0_0_20px_rgba(0,245,160,0.15)] transition-all duration-300 rounded-none shadow-none">
          <CardContent className="p-6 space-y-3">
            <h3 className="text-[10px] font-bold text-[#00F5A0] uppercase tracking-widest flex items-center gap-2 font-mono select-none">
              <Activity className="h-4 w-4 text-[#00F5A0]" /> Success Metrics
            </h3>
            {isEditing ? (
              <div className="space-y-1">
                <span className="text-[8px] text-muted-foreground font-mono block">ONE METRIC PER LINE</span>
                <Textarea
                  value={successMetrics.join("\n")}
                  onChange={(e) => handleUpdate({ successMetrics: e.target.value.split("\n").filter(line => line.trim() !== "") })}
                  className="text-xs text-muted-foreground bg-white/5 border border-white/10 rounded-none min-h-[120px] font-mono focus-visible:ring-0"
                />
              </div>
            ) : successMetrics.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">No success metrics defined.</p>
            ) : (
              <div className="space-y-2">
                {successMetrics.map((metric, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground font-medium">
                    <span className="text-[#00F5A0] font-bold mt-0.5 select-none">-</span>
                    <span>{metric}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Goals (User Stories mapping) */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-bold text-foreground uppercase tracking-widest font-mono flex items-center gap-1.5 select-none">
          <Target className="h-4 w-4 text-accent" /> Goals & User Stories
        </h3>
        <div className="border border-white/10 p-6 bg-[#08091E]/30 backdrop-blur-md space-y-3 rounded-none shadow-[0_0_15px_rgba(0,0,0,0.15)]">
          {isEditing ? (
            <div className="space-y-1">
              <span className="text-[8px] text-muted-foreground font-mono block">ONE GOAL STORY PER LINE</span>
              <Textarea
                value={prd.userStories.join("\n")}
                onChange={(e) => handleUpdate({ userStories: e.target.value.split("\n").filter(line => line.trim() !== "") })}
                className="text-xs text-muted-foreground bg-white/5 border border-white/10 rounded-none min-h-[120px] font-mono focus-visible:ring-0"
              />
            </div>
          ) : prd.userStories.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">No goals defined.</p>
          ) : (
            prd.userStories.map((story, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
                <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <span>{story}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Functional Requirements */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-bold text-foreground uppercase tracking-widest font-mono flex items-center gap-1.5 select-none">
          <Compass className="h-4 w-4 text-accent" /> Functional Requirements
        </h3>
        <div className="border border-white/10 p-6 bg-[#08091E]/30 backdrop-blur-md space-y-4 rounded-none shadow-[0_0_15px_rgba(0,0,0,0.15)]">
          {isEditing ? (
            <div className="space-y-1">
              <span className="text-[8px] text-muted-foreground font-mono block">ONE REQUIREMENT PER LINE</span>
              <Textarea
                value={prd.functionalRequirements.join("\n")}
                onChange={(e) => handleUpdate({ functionalRequirements: e.target.value.split("\n").filter(line => line.trim() !== "") })}
                className="text-xs text-muted-foreground bg-white/5 border border-white/10 rounded-none min-h-[120px] font-mono focus-visible:ring-0"
              />
            </div>
          ) : prd.functionalRequirements.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">No functional requirements specified.</p>
          ) : (
            prd.functionalRequirements.map((req, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
                <span className="text-[8px] font-bold text-muted-foreground shrink-0 mt-0.5 bg-black/45 border border-white/10 h-5 w-7 flex items-center justify-center rounded-none font-mono">
                  F-{idx + 1}
                </span>
                <span className="mt-0.5">{req}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Non Functional Requirements */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-mono select-none">Non-Functional Requirements</h3>
        <div className="border border-white/10 p-6 bg-black/25 space-y-3 rounded-none">
          {isEditing ? (
            <div className="space-y-1">
              <span className="text-[8px] text-muted-foreground font-mono block">ONE ITEM PER LINE</span>
              <Textarea
                value={prd.outOfScope.join("\n")}
                onChange={(e) => handleUpdate({ outOfScope: e.target.value.split("\n").filter(line => line.trim() !== "") })}
                className="text-xs text-muted-foreground bg-white/5 border border-white/10 rounded-none min-h-[100px] font-mono focus-visible:ring-0"
              />
            </div>
          ) : prd.outOfScope.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">No non-functional requirements specified.</p>
          ) : (
            prd.outOfScope.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-muted-foreground/75 leading-relaxed font-medium">
                <span className="text-muted-foreground shrink-0 select-none font-bold font-mono">-</span>
                <span>{item}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
