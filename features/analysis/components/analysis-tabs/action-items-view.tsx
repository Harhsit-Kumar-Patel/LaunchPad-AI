import { CheckSquare, Calendar, User } from "lucide-react";
import { ActionItem } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/utils/helpers";

interface ActionItemsViewProps {
  actionItems: ActionItem[];
  isEditing?: boolean;
  onChange?: (val: ActionItem[]) => void;
}

export function ActionItemsView({ actionItems, isEditing = false, onChange }: ActionItemsViewProps) {
  const handleUpdate = (idx: number, fields: Partial<ActionItem>) => {
    if (!onChange) return;
    const updated = [...actionItems];
    updated[idx] = { ...updated[idx], ...fields };
    onChange(updated);
  };

  const handleToggleCheck = (idx: number) => {
    if (!onChange) return;
    const item = actionItems[idx];
    const newStatus = item.status === "completed" ? "pending" : "completed";
    handleUpdate(idx, { status: newStatus });
  };

  if (!actionItems || actionItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 border border-dashed border-white/10 bg-black/20 select-none rounded-none shadow-[0_0_15px_rgba(255,183,3,0.05)]">
        <CheckSquare className="h-8 w-8 text-muted-foreground mb-4" />
        <h4 className="text-xs font-bold text-foreground uppercase tracking-widest font-mono">No action items found</h4>
        <p className="text-xs text-muted-foreground mt-2 max-w-[280px] leading-relaxed">
          No explicit task allocations were identified in this session.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 font-sans">
      <div className="flex items-center justify-between select-none">
        <h3 className="text-[10px] font-bold text-[#FFB703] uppercase tracking-widest flex items-center gap-2 font-mono">
          <CheckSquare className="h-4 w-4 text-[#FFB703]" /> Action Items Checklist
        </h3>
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider font-mono">
          {actionItems.length} Tasks Assigned
        </span>
      </div>

      <div className="space-y-4">
        {actionItems.map((item, idx) => (
          <Card key={item.id} className="border border-white/10 bg-[#08091E]/40 backdrop-blur-xl hover:border-[#FFB703] hover:-translate-y-[2px] hover:shadow-[0_0_20px_rgba(255,183,3,0.2)] transition-all duration-300 rounded-none">
            <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                {/* Checkbox box (always interactive) */}
                <button
                  type="button"
                  onClick={() => handleToggleCheck(idx)}
                  className="h-5 w-5 border border-white/20 flex items-center justify-center shrink-0 mt-0.5 bg-black/40 rounded-none shadow-inner cursor-pointer"
                >
                  {item.status === "completed" ? (
                    <div className="h-2.5 w-2.5 bg-[#FFB703] shadow-[0_0_6px_#FFB703]" />
                  ) : item.status === "in-progress" ? (
                    <div className="h-1.5 w-1.5 bg-[#FFB703]/40" />
                  ) : null}
                </button>
                <div className="space-y-1.5 flex-1 min-w-0">
                  {isEditing ? (
                    <div className="space-y-2">
                      <Input
                        value={item.title}
                        onChange={(e) => handleUpdate(idx, { title: e.target.value })}
                        className="text-sm font-bold text-foreground bg-white/5 border border-border h-8 rounded-none"
                      />
                      <div className="flex flex-wrap gap-3">
                        <Input
                          value={item.assignee}
                          onChange={(e) => handleUpdate(idx, { assignee: e.target.value })}
                          placeholder="Assignee"
                          className="text-[10px] bg-white/5 border border-border h-6 w-24 rounded-none font-mono"
                        />
                        <Input
                          value={item.dueDate}
                          onChange={(e) => handleUpdate(idx, { dueDate: e.target.value })}
                          placeholder="YYYY-MM-DD"
                          className="text-[10px] bg-white/5 border border-border h-6 w-24 rounded-none font-mono"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <h4 className={`text-sm font-bold text-foreground leading-snug ${item.status === "completed" && "line-through text-muted-foreground/60 decoration-black/20 dark:decoration-white/20"}`}>
                        {item.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
                        <span className="flex items-center gap-1.5 bg-black/35 px-2 py-0.5 border border-white/5 rounded-none">
                          <User className="h-3.5 w-3.5 text-muted-foreground" />
                          Assignee: {item.assignee}
                        </span>
                        <span className="hidden sm:inline">&bull;</span>
                        <span className="flex items-center gap-1.5 bg-black/35 px-2 py-0.5 border border-white/5 rounded-none">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          Due: {formatDate(item.dueDate)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2 sm:mt-0 select-none">
                {isEditing ? (
                  <select
                    value={item.priority}
                    onChange={(e) => handleUpdate(idx, { priority: e.target.value as any })}
                    className="text-[9px] font-mono font-bold uppercase tracking-wider bg-white/5 border border-border text-foreground px-2 py-1 outline-none"
                  >
                    <option value="high" className="bg-background">HIGH</option>
                    <option value="medium" className="bg-background">MEDIUM</option>
                    <option value="low" className="bg-background">LOW</option>
                  </select>
                ) : (
                  <Badge
                    variant={
                      item.priority === "high"
                        ? "error"
                        : item.priority === "medium"
                        ? "warning"
                        : "secondary"
                    }
                    className="rounded-none font-mono text-[9px]"
                  >
                    {item.priority.toUpperCase()} PRIORITY
                  </Badge>
                )}
                <Badge
                  variant={
                    item.status === "completed"
                      ? "success"
                      : item.status === "in-progress"
                      ? "info"
                      : "outline"
                  }
                  className="rounded-none font-mono text-[9px]"
                >
                  {item.status.replace("-", " ")}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
