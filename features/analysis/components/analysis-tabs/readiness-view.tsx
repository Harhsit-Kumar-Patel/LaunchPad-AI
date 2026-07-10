import { ShieldAlert, AlertTriangle, ShieldCheck, CheckCircle2 } from "lucide-react";
import { ReadinessCheck } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ReadinessViewProps {
  check: ReadinessCheck;
  isEditing?: boolean;
  onChange?: (val: ReadinessCheck) => void;
}

export function ReadinessView({ check, isEditing = false, onChange }: ReadinessViewProps) {
  const handleUpdate = (fields: Partial<ReadinessCheck>) => {
    if (!onChange) return;
    onChange({ ...check, ...fields });
  };

  if (!check) return null;

  const isBlocked = check.status === "blocked";
  const isClarify = check.status === "needs-clarification";

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans">
      {/* Score Header */}
      <Card className="border border-white/10 bg-[#08091E]/40 backdrop-blur-xl overflow-hidden rounded-none shadow-[0_0_30px_rgba(0,245,160,0.05)] hover:border-[#00F5A0] hover:-translate-y-[2px] hover:shadow-[0_0_25px_rgba(0,245,160,0.2)] transition-all duration-300">
        <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left select-none flex-1">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest font-mono">
              Diagnostics Spec // Execution Readiness
            </span>
            <h3 className="text-lg font-black text-foreground uppercase tracking-tight">
              Scope Readiness Health Report
            </h3>
            <p className="text-xs text-muted-foreground max-w-md leading-relaxed font-medium">
              Analyzes scope clarity, blockers, assignees, and decision completeness from raw transcript files to prevent developer blockages.
            </p>
          </div>

          <div className="flex flex-col items-center shrink-0 select-none">
            {/* Architectural Square Score Box */}
            <div className="h-20 w-28 border border-[#00F5A0]/40 flex flex-col items-center justify-center bg-black/45 shadow-[0_0_15px_rgba(0,245,160,0.15)] rounded-none">
              {isEditing ? (
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    value={check.score}
                    onChange={(e) => handleUpdate({ score: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })}
                    className="w-12 text-2xl font-black text-foreground bg-transparent border-0 focus-visible:ring-0 p-0 text-center font-sans"
                  />
                  <span className="text-xl font-bold">%</span>
                </div>
              ) : (
                <span className="text-3xl font-black text-foreground tracking-tight font-sans leading-none">{check.score}%</span>
              )}
              <span className="text-[8px] text-muted-foreground uppercase font-bold tracking-widest font-mono mt-1">Health Index</span>
            </div>
            
            {isEditing ? (
              <select
                value={check.status}
                onChange={(e) => handleUpdate({ status: e.target.value as any })}
                className="mt-3 text-[9px] font-mono font-bold uppercase tracking-wider bg-white/5 border border-border text-foreground px-2 py-0.5 outline-none"
              >
                <option value="ready" className="bg-background">READY</option>
                <option value="needs-clarification" className="bg-background">NEEDS CLARIFY</option>
                <option value="blocked" className="bg-background">BLOCKED</option>
              </select>
            ) : (
              <Badge variant={isBlocked ? "error" : isClarify ? "warning" : "success"} className="mt-3 rounded-none font-mono text-[9px]">
                {check.status.toUpperCase().replace("-", " ")}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Diagnostics details */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Blockers */}
        <Card className="border border-white/10 bg-[#08091E]/40 backdrop-blur-xl rounded-none hover:border-red-500/40 hover:-translate-y-[2px] hover:shadow-[0_0_20px_rgba(239,68,68,0.15)] transition-all duration-300">
          <CardContent className="p-5 space-y-4">
            <h4 className="text-[10px] font-bold text-foreground uppercase tracking-widest flex items-center gap-1.5 font-mono select-none">
              <ShieldAlert className="h-4 w-4 text-red-500" /> Key Blockers ({check.blockers.length})
            </h4>
            
            {isEditing ? (
              <div className="space-y-1">
                <span className="text-[8px] text-muted-foreground font-mono block">ONE BLOCKER PER LINE</span>
                <Textarea
                  value={check.blockers.join("\n")}
                  onChange={(e) => handleUpdate({ blockers: e.target.value.split("\n").filter(line => line.trim() !== "") })}
                  className="text-xs text-muted-foreground bg-white/5 border border-border rounded-none min-h-[100px] font-mono"
                />
              </div>
            ) : check.blockers.length === 0 ? (
              <div className="flex items-start gap-2.5 text-xs text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-none font-medium">
                <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-500" />
                <span>No major blockers identified. Scope is clear.</span>
              </div>
            ) : (
              <div className="space-y-2">
                {check.blockers.map((blocker, i) => (
                  <div key={i} className="text-xs text-red-400 bg-red-500/5 border border-red-500/10 p-3 rounded-none leading-relaxed font-medium">
                    {blocker}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Missing Info */}
        <Card className="border border-white/10 bg-[#08091E]/40 backdrop-blur-xl rounded-none hover:border-amber-500/40 hover:-translate-y-[2px] hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-all duration-300">
          <CardContent className="p-5 space-y-4">
            <h4 className="text-[10px] font-bold text-foreground uppercase tracking-widest flex items-center gap-1.5 font-mono select-none">
              <AlertTriangle className="h-4 w-4 text-amber-500" /> Missing Info ({check.missingInfo.length})
            </h4>
            
            {isEditing ? (
              <div className="space-y-1">
                <span className="text-[8px] text-muted-foreground font-mono block">ONE ITEM PER LINE</span>
                <Textarea
                  value={check.missingInfo.join("\n")}
                  onChange={(e) => handleUpdate({ missingInfo: e.target.value.split("\n").filter(line => line.trim() !== "") })}
                  className="text-xs text-muted-foreground bg-white/5 border border-border rounded-none min-h-[100px] font-mono"
                />
              </div>
            ) : check.missingInfo.length === 0 ? (
              <div className="flex items-start gap-2.5 text-xs text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-none font-medium">
                <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-500" />
                <span>All parameters documented in dialogue files.</span>
              </div>
            ) : (
              <div className="space-y-2">
                {check.missingInfo.map((info, i) => (
                  <div key={i} className="text-xs text-amber-400 bg-amber-500/5 border border-amber-500/10 p-3 rounded-none leading-relaxed font-medium">
                    {info}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="border border-white/10 bg-[#08091E]/40 backdrop-blur-xl rounded-none hover:border-[#1A4BFF]/40 hover:-translate-y-[2px] hover:shadow-[0_0_20px_rgba(26,75,255,0.15)] transition-all duration-300">
          <CardContent className="p-5 space-y-4">
            <h4 className="text-[10px] font-bold text-foreground uppercase tracking-widest flex items-center gap-1.5 font-mono select-none">
              <CheckCircle2 className="h-4 w-4 text-accent" /> Next Actions ({check.recommendations.length})
            </h4>
            
            {isEditing ? (
              <div className="space-y-1">
                <span className="text-[8px] text-muted-foreground font-mono block">ONE ACTION PER LINE</span>
                <Textarea
                  value={check.recommendations.join("\n")}
                  onChange={(e) => handleUpdate({ recommendations: e.target.value.split("\n").filter(line => line.trim() !== "") })}
                  className="text-xs text-muted-foreground bg-white/5 border border-border rounded-none min-h-[100px] font-mono"
                />
              </div>
            ) : (
              <div className="space-y-2">
                {check.recommendations.map((rec, i) => (
                  <div key={i} className="text-xs text-muted-foreground bg-black/20 border border-white/5 p-3 rounded-none leading-relaxed font-medium">
                    {rec}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
