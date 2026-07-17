import { CheckSquare } from "lucide-react";
import { ActionItem } from "@/types";
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
      <div className="flex flex-col items-center justify-center py-16 border border-dashed border-white/10 bg-black/20 select-none rounded-none shadow-[0_0_15px_rgba(255,183,3,0.05)] font-sans">
        <CheckSquare className="h-8 w-8 text-muted-foreground mb-4" />
        <h4 className="text-xs font-bold text-foreground uppercase tracking-widest font-mono">No action items found</h4>
        <p className="text-xs text-muted-foreground mt-2 max-w-[280px] leading-relaxed text-center">
          No explicit task allocations were identified in this session.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 font-sans">
      {/* Header section */}
      <div className="flex items-center justify-between select-none">
        <h3 className="text-[10px] font-bold text-[#FFB703] uppercase tracking-widest flex items-center gap-2 font-mono">
          <CheckSquare className="h-4 w-4 text-[#FFB703]" /> Action Items Task List
        </h3>
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider font-mono">
          {actionItems.length} Tasks Tracked
        </span>
      </div>

      {/* Task table wrapper */}
      <div className="border border-white/10 bg-[#08091E]/40 backdrop-blur-xl rounded-none overflow-x-auto shadow-[0_0_20px_rgba(255,183,3,0.05)]">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-white/10 text-[9px] font-bold text-muted-foreground uppercase tracking-widest bg-black/35 select-none font-mono">
              <th className="px-5 py-3.5 w-10 text-center">#</th>
              <th className="px-5 py-3.5">Task</th>
              <th className="px-5 py-3.5 w-44">Owner</th>
              <th className="px-5 py-3.5 w-32 text-center">Priority</th>
              <th className="px-5 py-3.5 w-36">Deadline</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {actionItems.map((item, idx) => (
              <tr 
                key={item.id} 
                className={`group/row hover:bg-white/[0.02] transition-colors duration-150 ${
                  item.status === "completed" ? "bg-white/[0.005]" : ""
                }`}
              >
                {/* Complete checkbox */}
                <td className="px-5 py-4 text-center align-middle">
                  <button
                    type="button"
                    onClick={() => handleToggleCheck(idx)}
                    className="mx-auto h-4 w-4 border border-white/20 flex items-center justify-center shrink-0 bg-black/40 rounded-none shadow-inner cursor-pointer"
                  >
                    {item.status === "completed" ? (
                      <div className="h-2 w-2 bg-[#FFB703] shadow-[0_0_6px_#FFB703]" />
                    ) : item.status === "in-progress" ? (
                      <div className="h-1 w-1 bg-[#FFB703]/50" />
                    ) : null}
                  </button>
                </td>

                {/* Task Title */}
                <td className="px-5 py-4 align-middle">
                  {isEditing ? (
                    <Input
                      value={item.title}
                      onChange={(e) => handleUpdate(idx, { title: e.target.value })}
                      className="text-xs font-bold text-foreground bg-white/5 border border-white/10 h-7 rounded-none p-2 w-full focus-visible:ring-0 focus:border-[#FFB703]"
                    />
                  ) : (
                    <span 
                      className={`text-xs font-semibold leading-relaxed ${
                        item.status === "completed" 
                          ? "line-through text-muted-foreground/50 decoration-white/20" 
                          : "text-foreground"
                      }`}
                    >
                      {item.title}
                    </span>
                  )}
                </td>

                {/* Owner */}
                <td className="px-5 py-4 align-middle">
                  {isEditing ? (
                    <Input
                      value={item.assignee}
                      onChange={(e) => handleUpdate(idx, { assignee: e.target.value })}
                      className="text-xs bg-white/5 border border-white/10 h-7 rounded-none p-2 w-full font-mono text-muted-foreground focus-visible:ring-0 focus:border-[#FFB703]"
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground font-medium font-mono">
                      {item.assignee}
                    </span>
                  )}
                </td>

                {/* Priority */}
                <td className="px-5 py-4 align-middle text-center select-none">
                  {isEditing ? (
                    <select
                      value={item.priority}
                      onChange={(e) => handleUpdate(idx, { priority: e.target.value as any })}
                      className="text-[10px] font-mono font-bold uppercase tracking-wider bg-black/60 border border-white/10 text-foreground px-2 py-1 outline-none w-full"
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
                      className="rounded-none font-mono text-[9px] uppercase tracking-wider py-0.5 px-2 font-bold"
                    >
                      {item.priority}
                    </Badge>
                  )}
                </td>

                {/* Deadline */}
                <td className="px-5 py-4 align-middle">
                  {isEditing ? (
                    <Input
                      value={item.dueDate}
                      onChange={(e) => handleUpdate(idx, { dueDate: e.target.value })}
                      className="text-xs bg-white/5 border border-white/10 h-7 rounded-none p-2 w-full font-mono text-muted-foreground focus-visible:ring-0 focus:border-[#FFB703]"
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground font-medium font-mono">
                      {formatDate(item.dueDate)}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
