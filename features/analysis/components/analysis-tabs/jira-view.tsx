"use client";

import * as React from "react";
import { FolderGit2, Check, RefreshCw, Layers } from "lucide-react";
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

  if (!stories || stories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 border border-dashed border-white/10 bg-black/20 select-none rounded-none">
        <FolderGit2 className="h-8 w-8 text-muted-foreground mb-4" />
        <h4 className="text-xs font-bold text-foreground uppercase tracking-widest font-mono">No stories structured</h4>
        <p className="text-xs text-muted-foreground mt-2 max-w-[280px] leading-relaxed">
          Unable to generate Jira items from this transcript session.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 font-sans">
      <div className="flex items-center justify-between select-none">
        <h3 className="text-[10px] font-bold text-[#00F0FF] uppercase tracking-widest flex items-center gap-2 font-mono">
          <Layers className="h-4 w-4 text-[#00F0FF]" /> Compiled Jira Stories
        </h3>
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider font-mono">
          {stories.length} User Stories Formatted
        </span>
      </div>

      <div className="space-y-4">
        {stories.map((story, idx) => {
          const isSyncing = syncingId === story.id;
          const isSynced = syncedIds[story.id];

          return (
            <Card key={story.id} className="border border-white/10 bg-[#08091E]/40 backdrop-blur-xl hover:border-[#00F0FF] hover:-translate-y-[2px] hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all duration-300 rounded-none">
              <CardContent className="p-5 space-y-4">
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {isEditing ? (
                      <div className="flex gap-2 w-full max-w-md">
                        <Input
                          value={story.key}
                          onChange={(e) => handleUpdate(idx, { key: e.target.value })}
                          className="w-16 text-[9px] font-mono font-bold text-[#00F0FF] bg-[#00F0FF]/5 border border-[#00F0FF]/25 rounded-none"
                        />
                        <Input
                          value={story.title}
                          onChange={(e) => handleUpdate(idx, { title: e.target.value })}
                          className="text-sm font-bold text-foreground bg-white/5 border border-border rounded-none flex-1"
                        />
                      </div>
                    ) : (
                      <>
                        <span className="text-[9px] font-mono font-bold text-[#00F0FF] bg-[#00F0FF]/5 px-2 py-0.5 border border-[#00F0FF]/25 rounded-none shadow-[0_0_8px_rgba(0,240,255,0.1)] shrink-0">
                          {story.key}
                        </span>
                        <h4 className="text-sm font-bold text-foreground leading-snug truncate">
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
                          className="w-12 text-[9px] bg-white/5 border border-border rounded-none h-6 font-mono"
                        />
                        <select
                          value={story.priority}
                          onChange={(e) => handleUpdate(idx, { priority: e.target.value as any })}
                          className="text-[9px] font-mono font-bold uppercase bg-white/5 border border-border text-foreground px-2 py-0.5 outline-none h-6"
                        >
                          <option value="high" className="bg-background">HIGH</option>
                          <option value="medium" className="bg-background">MEDIUM</option>
                          <option value="low" className="bg-background">LOW</option>
                        </select>
                      </div>
                    ) : (
                      <>
                        <Badge variant="outline" className="rounded-none font-mono text-[9px]">{story.points} SP</Badge>
                        <Badge
                          variant={
                            story.priority === "high"
                              ? "error"
                              : story.priority === "medium"
                              ? "warning"
                              : "secondary"
                          }
                          className="rounded-none font-mono text-[9px]"
                        >
                          {story.priority.toUpperCase()}
                        </Badge>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant={isSynced ? "outline" : "primary"}
                      className="h-7 text-[9px] font-bold px-2.5 rounded-none border border-accent/40 bg-accent text-white hover:shadow-[0_0_12px_rgba(26,75,255,0.35)]"
                      onClick={() => handleSync(story.id)}
                      disabled={isSyncing || isSynced || isEditing}
                    >
                      {isSyncing ? (
                        <>
                          <RefreshCw className="h-3 w-3 mr-1 animate-spin" /> Syncing
                        </>
                      ) : isSynced ? (
                        <>
                          <Check className="h-3 w-3 mr-1 text-emerald-600" /> Synced
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
                      className="text-xs text-muted-foreground bg-white/5 border border-border rounded-none min-h-[60px]"
                    />
                  ) : (
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
                      {story.description}
                    </p>
                  )}
                </div>

                {/* Acceptance criteria */}
                <div className="space-y-2 pt-3 border-t border-white/5 select-text">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest font-mono select-none">
                    Acceptance Criteria
                  </span>
                  {isEditing ? (
                    <div className="space-y-1">
                      <span className="text-[8px] text-muted-foreground font-mono block">ONE CRITERION PER LINE</span>
                      <Textarea
                        value={story.acceptanceCriteria.join("\n")}
                        onChange={(e) => handleUpdate(idx, { acceptanceCriteria: e.target.value.split("\n").filter(line => line.trim() !== "") })}
                        className="text-xs text-muted-foreground bg-white/5 border border-border rounded-none min-h-[80px] font-mono"
                      />
                    </div>
                  ) : (
                    <ul className="space-y-2 list-none pl-0">
                      {story.acceptanceCriteria.map((ac, acIdx) => (
                        <li key={acIdx} className="flex items-start gap-2.5 text-xs text-muted-foreground font-medium">
                          <span className="text-[#00F0FF] select-none font-bold mt-0.5 font-mono text-[9px]">-</span>
                          <span>{ac}</span>
                        </li>
                      ))}
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
