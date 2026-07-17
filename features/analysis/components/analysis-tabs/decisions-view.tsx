import { Landmark, User, ShieldAlert } from "lucide-react";
import { Decision } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface DecisionsViewProps {
  decisions: Decision[];
  isEditing?: boolean;
  onChange?: (val: Decision[]) => void;
}

export function DecisionsView({ decisions, isEditing = false, onChange }: DecisionsViewProps) {
  const handleUpdate = (idx: number, fields: Partial<Decision>) => {
    if (!onChange) return;
    const updated = [...decisions];
    updated[idx] = { ...updated[idx], ...fields };
    onChange(updated);
  };

  if (!decisions || decisions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 border border-dashed border-border bg-black/20 select-none rounded-none shadow-glow-violet">
        <ShieldAlert className="h-8 w-8 text-muted-foreground mb-4" />
        <h4 className="text-xs font-bold text-foreground uppercase tracking-widest font-mono">No decisions identified</h4>
        <p className="text-xs text-muted-foreground mt-2 max-w-[280px] leading-relaxed">
          Our parser did not extract specific alignment decisions from this transcript.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 font-sans">
      <div className="flex items-center justify-between select-none">
        <h3 className="text-[10px] font-bold text-[#9D4EDD] uppercase tracking-widest flex items-center gap-2 font-mono">
          <Landmark className="h-4 w-4 text-[#9D4EDD]" /> Extracted Alignment Decisions
        </h3>
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider font-mono">
          {decisions.length} Decisions Found
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {decisions.map((decision, idx) => (
          <Card key={decision.id} className="border border-border bg-[#08091E]/40 backdrop-blur-xl hover:border-[#9D4EDD] hover:-translate-y-[2px] hover:shadow-glow-violet transition-all duration-300 rounded-none">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between gap-4 select-none">
                {isEditing ? (
                  <select
                    value={decision.status}
                    onChange={(e) => handleUpdate(idx, { status: e.target.value as any })}
                    className="text-[9px] font-mono font-bold uppercase tracking-wider bg-white/5 border border-border text-foreground px-2 py-1 outline-none"
                  >
                    <option value="agreed" className="bg-background">AGREED</option>
                    <option value="needs-review" className="bg-background">NEEDS REVIEW</option>
                    <option value="rejected" className="bg-background">REJECTED</option>
                  </select>
                ) : (
                  <Badge
                    variant={
                      decision.status === "agreed"
                        ? "success"
                        : decision.status === "needs-review"
                        ? "error"
                        : "warning"
                    }
                    className="rounded-none font-mono text-[9px]"
                  >
                    {decision.status.toUpperCase()}
                  </Badge>
                )}

                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono uppercase tracking-wider bg-black/35 px-2 py-0.5 border border-white/5">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  {isEditing ? (
                    <Input
                      value={decision.owner}
                      onChange={(e) => handleUpdate(idx, { owner: e.target.value })}
                      className="text-[10px] bg-transparent border-0 h-5 p-0 focus-visible:ring-0 text-foreground w-20 font-mono"
                    />
                  ) : (
                    <span>Owner: {decision.owner}</span>
                  )}
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-2">
                  <Input
                    value={decision.title}
                    onChange={(e) => handleUpdate(idx, { title: e.target.value })}
                    className="text-sm font-bold text-foreground bg-white/5 border border-border rounded-none h-8"
                  />
                  <Textarea
                    value={decision.description}
                    onChange={(e) => handleUpdate(idx, { description: e.target.value })}
                    className="text-xs text-muted-foreground bg-white/5 border border-border rounded-none min-h-[60px]"
                  />
                </div>
              ) : (
                <>
                  <h4 className="text-sm font-bold text-foreground leading-snug">
                    {decision.title}
                  </h4>
                  <div className="space-y-1">
                    <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest font-mono block select-none">Rationale / Context</span>
                    <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                      {decision.description}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
