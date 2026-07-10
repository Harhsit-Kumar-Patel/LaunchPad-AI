import { FileText, AlignLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface SummaryViewProps {
  summary: string;
  transcript: string;
  isEditing?: boolean;
  onChange?: (val: string) => void;
}

export function SummaryView({ summary, transcript, isEditing = false, onChange }: SummaryViewProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 font-sans">
      {/* Left: Summary Analysis */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-bold text-[#9D4EDD] uppercase tracking-widest flex items-center gap-2 font-mono select-none">
          <AlignLeft className="h-4 w-4 text-[#9D4EDD]" /> AI Executive Summary
        </h3>
        <Card className="border border-border bg-[#08091E]/40 backdrop-blur-xl shadow-glow-violet rounded-none">
          <CardContent className="p-6">
            {isEditing && onChange ? (
              <Textarea
                value={summary}
                onChange={(e) => onChange(e.target.value)}
                className="w-full min-h-[300px] text-xs sm:text-sm font-sans leading-relaxed bg-white/5 border border-border rounded-none focus:border-accent p-3"
              />
            ) : (
              <div className="prose prose-sm max-w-none text-xs sm:text-sm text-foreground/90 leading-relaxed space-y-4 whitespace-pre-wrap">
                {summary}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right: Original Transcript for context */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2 font-mono select-none">
          <FileText className="h-4 w-4" /> Meeting Transcript Context
        </h3>
        <Card className="border border-border bg-black/30 backdrop-blur-md rounded-none">
          <CardContent className="p-6">
            <pre className="text-xs font-mono text-muted-foreground overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[420px] overflow-y-auto pr-2">
              {transcript}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
