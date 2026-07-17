"use client";

import * as React from "react";
import { FolderGit2, Check, RefreshCw, Layers, CheckSquare } from "lucide-react";
import { JiraStory } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface JiraViewProps {
  stories: JiraStory[];
  isEditing?: boolean;
  onChange?: (val: JiraStory[]) => void;
}

export function JiraView({ stories, isEditing = false, onChange }: JiraViewProps) {
  const [syncingId, setSyncingId] = React.useState<string | null>(null);
  const [syncedIds, setSyncedIds] = React.useState<Record<string, boolean>>({});

  // Store checklist items complete status locally for developer satisfaction
  const [checkedCriteria, setCheckedCriteria] = React.useState<Record<string, boolean>>({});

  const handleSync = (storyId: string) => {
    setSyncingId(storyId);
    setTimeout(() => {
      setSyncingId(null);
      setSyncedIds((prev) => ({ ...prev, [storyId]: true }));
    }, 1000);
  };

  const handleUpdate = (idx: number, fields: Partial<JiraStory>) => {
    if (!onChange) return;
    const updated = [...stories];
    updated[idx] = { ...updated[idx], ...fields };
    onChange(updated);
  };

  const toggleCriterion = (storyId: string, criterionIdx: number) => {
    const key = `${storyId}-${criterionIdx}`;
    setCheckedCriteria((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!stories || stories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 border border-dashed border-white/10 bg-black/20 select-none rounded-none font-sans">
        <FolderGit2 className="h-8 w-8 text-muted-foreground mb-4" />
        <h4 className="text-xs font-bold text-foreground uppercase tracking-widest font-mono">No stories structured</h4>
        <p className="text-xs text-muted-foreground mt-2 max-w-[280px] leading-relaxed text-center">
          Unable to generate Jira items from this transcript session.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 font-sans">
      <div className="flex items-center justify-between select-none">
        <h3 className="text-[10px] font-bold text-[#00F0FF] uppercase tracking-widest flex items-center gap-2 font-mono">
          <Layers className="h-4 w-4 text-[#00F0FF]" /> Jira Backlog Tickets
        </h3>
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider font-mono">
          {stories.length} User Stories Formatted
        </span>
      </div>

      <div className="space-y-6">
        {stories.map((story, idx) => {
          const isSyncing = syncingId === story.id;
          const isSynced = syncedIds[story.id];

          return (
            <Card 
              key={story.id} 
              className="border border-white/10 bg-[#08091E]/40 backdrop-blur-xl hover:border-[#00F0FF] hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] transition-all duration-300 rounded-none overflow-hidden relative"
            >
              {/* Jira Blue Left Stripe indicator */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00F0FF]" />

              <CardContent className="p-5 pl-6 space-y-4">
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {isEditing ? (
                      <div className="flex gap-2 w-full max-w-md">
                        <Input
                          value={story.key}
                          onChange={(e) => handleUpdate(idx, { key: e.target.value })}
                          className="w-16 text-[9px] font-mono font-bold text-[#00F0FF] bg-[#00F0FF]/5 border border-[#00F0FF]/25 rounded-none focus-visible:ring-0"
                        />
                        <Input
                          value={story.title}
                          onChange={(e) => handleUpdate(idx, { title: e.target.value })}
                          className="text-xs sm:text-sm font-bold text-foreground bg-white/5 border border-white/10 rounded-none flex-1 focus-visible:ring-0"
                        />
                      </div>
                    ) : (
                      <>
                        <span className="text-[9px] font-mono font-bold text-[#00F0FF] bg-[#00F0FF]/5 px-2 py-0.5 border border-[#00F0FF]/25 rounded-none shadow-[0_0_8px_rgba(0,240,255,0.1)] shrink-0">
                          {story.key}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-foreground leading-snug truncate">
                          {story.title}
                        </h4>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0 select-none">
                    {isEditing ? (
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          value={story.points}
                          onChange={(e) => handleUpdate(idx, { points: parseInt(e.target.value) || 0 })}
                          className="w-12 text-[9px] bg-white/5 border border-white/10 rounded-none h-6 font-mono focus-visible:ring-0"
                        />
                        <select
                          value={story.priority}
                          onChange={(e) => handleUpdate(idx, { priority: e.target.value as any })}
                          className="text-[9px] font-mono font-bold uppercase bg-black/60 border border-white/10 text-foreground px-2 py-0.5 outline-none h-6"
                        >
                          <option value="high" className="bg-background">HIGH</option>
                          <option value="medium" className="bg-background">MEDIUM</option>
                          <option value="low" className="bg-background">LOW</option>
                        </select>
                      </div>
                    ) : (
                      <>
                        <Badge variant="outline" className="rounded-none font-mono text-[9px] bg-black/20 border-white/10">{story.points} SP</Badge>
                        <Badge
                          variant={
                            story.priority === "high"
                              ? "error"
                              : story.priority === "medium"
                              ? "warning"
                              : "secondary"
                          }
                          className="rounded-none font-mono text-[9px] uppercase font-bold"
                        >
                          {story.priority}
                        </Badge>
                        <Badge className="rounded-none font-mono text-[9px] bg-sky-950 text-sky-400 border border-sky-400/20 uppercase font-bold">
                          To Do
                        </Badge>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant={isSynced ? "outline" : "primary"}
                      className="h-6 text-[9px] font-bold px-2 rounded-none border border-accent/40 bg-accent text-white hover:shadow-[0_0_12px_rgba(26,75,255,0.35)]"
                      onClick={() => handleSync(story.id)}
                      disabled={isSyncing || isSynced || isEditing}
                    >
                      {isSyncing ? (
                        <>
                          <RefreshCw className="h-2.5 w-2.5 mr-1 animate-spin" /> Syncing
                        </>
                      ) : isSynced ? (
                        <>
                          <Check className="h-2.5 w-2.5 mr-1 text-emerald-500" /> Synced
                        </>
                      ) : (
                        "Sync Story"
                      )}
                    </Button>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest font-mono select-none">
                    Description
                  </span>
                  {isEditing ? (
                    <Textarea
                      value={story.description}
                      onChange={(e) => handleUpdate(idx, { description: e.target.value })}
                      className="text-xs text-muted-foreground bg-white/5 border border-white/10 rounded-none min-h-[60px] focus-visible:ring-0"
                    />
                  ) : (
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
                      {story.description}
                    </p>
                  )}
                </div>

                {/* Acceptance criteria */}
                <div className="space-y-2.5 pt-3 border-t border-white/5 select-text">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest font-mono select-none">
                    Acceptance Criteria Checklist
                  </span>
                  {isEditing ? (
                    <div className="space-y-1">
                      <span className="text-[8px] text-muted-foreground font-mono block">ONE CRITERION PER LINE</span>
                      <Textarea
                        value={story.acceptanceCriteria.join("\n")}
                        onChange={(e) => handleUpdate(idx, { acceptanceCriteria: e.target.value.split("\n").filter(line => line.trim() !== "") })}
                        className="text-xs text-muted-foreground bg-white/5 border border-white/10 rounded-none min-h-[80px] font-mono focus-visible:ring-0"
                      />
                    </div>
                  ) : story.acceptanceCriteria.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">No criteria specified.</p>
                  ) : (
                    <ul className="space-y-2 list-none pl-0">
                      {story.acceptanceCriteria.map((ac, acIdx) => {
                        const isChecked = checkedCriteria[`${story.id}-${acIdx}`];
                        return (
                          <li 
                            key={acIdx} 
                            onClick={() => toggleCriterion(story.id, acIdx)}
                            className="flex items-start gap-2.5 text-xs text-muted-foreground font-medium cursor-pointer select-none group/crit"
                          >
                            <span className="h-4 w-4 border border-white/20 flex items-center justify-center shrink-0 mt-0.5 bg-black/40 rounded-none group-hover/crit:border-[#00F0FF] transition-all">
                              {isChecked && (
                                <div className="h-2 w-2 bg-[#00F0FF] shadow-[0_0_6px_#00F0FF]" />
                              )}
                            </span>
                            <span className={isChecked ? "line-through text-muted-foreground/50" : ""}>
                              {ac}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
