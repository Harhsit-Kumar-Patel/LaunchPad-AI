"use client";

import * as React from "react";
import { 
  Sparkles, 
  FileText, 
  Upload, 
  X, 
  Check, 
  FileWarning,
  Trash2,
  Zap,
  StickyNote,
  ArrowRight
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MOCK_TRANSCRIPT_EXAMPLES } from "@/constants";

interface TranscriptInputProps {
  onAnalyze: (title: string, transcript: string) => Promise<void>;
  loading: boolean;
}

export function TranscriptInput({ onAnalyze, loading }: TranscriptInputProps) {
  const [title, setTitle] = React.useState("");
  const [transcript, setTranscript] = React.useState("");
  const [validationError, setValidationError] = React.useState<string | null>(null);
  
  // Drag & drop and upload states
  const [isDragging, setIsDragging] = React.useState(false);
  const [uploadedFile, setUploadedFile] = React.useState<{ name: string; size: string; type: string } | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Live text metrics
  const wordCount = React.useMemo(() => {
    return transcript.trim() ? transcript.trim().split(/\s+/).length : 0;
  }, [transcript]);

  const charCount = React.useMemo(() => {
    return transcript.length;
  }, [transcript]);

  const estProcessingTime = React.useMemo(() => {
    if (wordCount === 0) return "0s";
    const seconds = Math.min(90, Math.max(15, Math.ceil(wordCount / 35) + 12));
    return `~${seconds}s`;
  }, [wordCount]);

  const isValidInput = title.trim() !== "" && transcript.trim() !== "";

  // Handle manual submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!title.trim()) {
      setValidationError("A discussion title is required to identify your alignment run.");
      return;
    }

    if (!transcript.trim()) {
      setValidationError("Meeting transcript cannot be empty. Please paste one or upload a file.");
      return;
    }

    try {
      await onAnalyze(title.trim(), transcript);
    } catch (err: any) {
      setValidationError(err.message || "Failed to initiate transcript analysis. Try checking connections.");
    }
  };

  // Clear all form inputs
  const handleClear = () => {
    setTitle("");
    setTranscript("");
    setUploadedFile(null);
    setValidationError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Helper to read and process incoming files
  const processUploadedFile = (file: File) => {
    setValidationError(null);
    const extension = file.name.split(".").pop()?.toLowerCase();
    const sizeInKB = (file.size / 1024).toFixed(1) + " KB";

    if (extension === "txt" || extension === "md") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        if (text.trim() === "") {
          setValidationError(`File '${file.name}' appears to be empty.`);
          return;
        }
        setTranscript(text);
        if (!title) {
          setTitle(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
        }
        setUploadedFile({ name: file.name, size: sizeInKB, type: extension.toUpperCase() });
      };
      reader.readAsText(file);
    } else if (extension === "docx") {
      const placeholderDocxTranscript = `PM: Let's discuss our mobile push notification synchronizations.
Lead Developer: Sure. We need to integrate Apple Push Notification service (APNs) and Firebase Cloud Messaging (FCM).
Engineer: I will configure the security keys and connection pools next Tuesday.
PM: Great. Let's decide that APNs will be our core iOS channel, and FCM will handle Android webhooks.
Designer: We also need custom alert UI templates in settings. Let's aim to draft those by Friday.`;
      
      setTranscript(placeholderDocxTranscript);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
      }
      setUploadedFile({ name: file.name, size: sizeInKB, type: "DOCX (Parsed)" });
    } else {
      setValidationError(`Unsupported format (.${extension}). Please upload TXT, Markdown (.md), or DOCX files.`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processUploadedFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const loadExample = (index: number) => {
    const example = MOCK_TRANSCRIPT_EXAMPLES[index];
    if (example) {
      setTitle(example.title);
      setTranscript(example.transcript);
      setUploadedFile({ name: `${example.title.toLowerCase().replace(/\s+/g, "-")}.md`, size: "Sample", type: "TEMPLATE" });
      setValidationError(null);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-4 items-start font-sans">
      {/* Main Workspace Column */}
      <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
        <Card className="border border-white/10 bg-[#08091E]/40 backdrop-blur-xl overflow-hidden relative shadow-[0_0_35px_rgba(157,78,221,0.06)] rounded-none">
          
          {/* Drag over screen overlay */}
          {isDragging && (
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 border border-dashed border-[#00F0FF] rounded-none transition-all duration-200 pointer-events-auto shadow-[0_0_30px_rgba(0,240,255,0.2)]"
            >
              <div className="p-4 border border-[#00F0FF]/40 text-[#00F0FF] bg-[#00F0FF]/5 mb-3 rounded-none shadow-[0_0_15px_rgba(0,240,255,0.1)]">
                <Upload className="h-6 w-6" />
              </div>
              <h4 className="text-xs font-bold text-foreground uppercase tracking-widest font-mono">Drop transcript file here</h4>
              <p className="text-[10px] text-muted-foreground font-medium mt-1">Accepts TXT, MD, and DOCX formats</p>
            </div>
          )}

          <CardHeader className="border-b border-white/5 pb-5 p-6 select-none">
            <CardTitle className="text-xs font-bold text-foreground uppercase tracking-widest flex items-center gap-2 font-mono">
              <FileText className="h-4 w-4 text-[#9D4EDD]" /> Workspace Input
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-1">
              Enter a title and paste your transcript details below, or drop files directly to import content
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Title field */}
            <div className="space-y-2">
              <label htmlFor="title" className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground font-mono">
                Discussion Title <span className="text-[#00F0FF]">*</span>
              </label>
              <Input
                id="title"
                placeholder="e.g. Billing Sync, Auth Architecture Review"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-black/30 border border-white/10 focus:border-[#00F0FF]/50 focus:shadow-[0_0_10px_rgba(0,240,255,0.15)] text-foreground h-10 text-xs rounded-none transition-all"
              />
            </div>

            {/* File Drag-and-Drop Area */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`border border-dashed rounded-none p-6 text-center cursor-pointer transition-all duration-200 select-none ${
                uploadedFile 
                  ? "bg-[#00F0FF]/5 border-[#00F0FF]/40 shadow-[0_0_12px_rgba(0,240,255,0.15)]" 
                  : "bg-black/20 border-white/10 hover:border-[#9D4EDD]/50 hover:shadow-[0_0_12px_rgba(157,78,221,0.15)]"
              }`}
            >
              <input 
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".txt,.md,.docx"
                onChange={handleFileChange}
              />
              
              {uploadedFile ? (
                <div className="flex items-center justify-between gap-3 text-left">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 border border-[#00F0FF]/30 bg-[#00F0FF]/5 flex items-center justify-center text-[#00F0FF] shrink-0 rounded-none shadow-[0_0_8px_rgba(0,240,255,0.1)]">
                      <Check className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground truncate max-w-[280px] sm:max-w-md">
                        {uploadedFile.name}
                      </p>
                      <p className="text-[9px] text-muted-foreground font-mono mt-1 uppercase tracking-wider">
                        Format: <span className="font-bold text-foreground">{uploadedFile.type}</span> &bull; Size: <span className="font-bold text-foreground">{uploadedFile.size}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="h-8 w-8 border border-white/10 hover:border-[#FFB703] bg-black/40 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all rounded-none cursor-pointer hover:shadow-[0_0_10px_rgba(255,183,3,0.2)]"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-2 select-none">
                  <Upload className="h-5 w-5 text-muted-foreground mb-3" />
                  <p className="text-[10px] font-bold text-foreground uppercase tracking-widest font-mono">Drag & drop files here, or click to upload</p>
                  <p className="text-[10px] text-muted-foreground mt-1.5 font-medium">Accepts TXT, MD, or DOCX (up to 5MB)</p>
                </div>
              )}
            </div>

            {/* Transcript Textarea */}
            <div className="space-y-2 relative">
              <div className="flex items-center justify-between select-none">
                <label htmlFor="transcript" className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground font-mono">
                  Transcript Contents <span className="text-[#00F0FF]">*</span>
                </label>
                {transcript.trim() === "" && (
                  <span className="text-[9px] text-muted-foreground/60 italic font-mono uppercase">
                    Waiting for input...
                  </span>
                )}
              </div>
              <Textarea
                id="transcript"
                placeholder="PM: Let's discuss changing from monthly subscription to Stripe Metered Billing...
Lead Architect: That means building a telemetry service that counts request logs...
Developer: We'll need webhook handlers to record payment failures..."
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                className="min-h-[280px] font-mono text-[11px] leading-relaxed bg-black/30 border border-white/10 focus:border-[#00F0FF]/50 focus:shadow-[0_0_10px_rgba(0,240,255,0.15)] text-foreground p-4 rounded-none transition-all"
              />
            </div>

            {/* Futuristic Multi-Colored Metrics Footer */}
            <div className="grid grid-cols-3 gap-4 pt-1.5 select-none font-mono">
              <div className="bg-black/30 border border-[#1A4BFF]/20 hover:border-[#1A4BFF] hover:shadow-[0_0_12px_rgba(26,75,255,0.25)] transition-all rounded-none p-3.5 text-center">
                <span className="text-[8px] text-muted-foreground font-bold uppercase tracking-widest block mb-1">Words</span>
                <span className="text-xs font-bold text-foreground">{wordCount.toLocaleString()}</span>
              </div>
              
              <div className="bg-black/30 border border-[#9D4EDD]/20 hover:border-[#9D4EDD] hover:shadow-[0_0_12px_rgba(157,78,221,0.25)] transition-all rounded-none p-3.5 text-center">
                <span className="text-[8px] text-muted-foreground font-bold uppercase tracking-widest block mb-1">Characters</span>
                <span className="text-xs font-bold text-foreground">{charCount.toLocaleString()}</span>
              </div>
              
              <div className="bg-black/30 border border-[#00F0FF]/20 hover:border-[#00F0FF] hover:shadow-[0_0_12px_rgba(0,240,255,0.25)] transition-all rounded-none p-3.5 text-center">
                <span className="text-[8px] text-muted-foreground font-bold uppercase tracking-widest block mb-1">Est. Process</span>
                <span className="text-xs font-bold text-[#00F0FF]">{estProcessingTime}</span>
              </div>
            </div>

            {validationError && (
              <div className="text-xs font-medium text-red-400 bg-red-500/5 border border-red-500/10 p-4 rounded-none flex items-start gap-2.5 select-none">
                <FileWarning className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{validationError}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bottom Action Bar */}
        <div className="flex items-center justify-between gap-4 p-4 border border-white/10 bg-[#08091E]/40 backdrop-blur-xl rounded-none shadow-[0_0_20px_rgba(0,0,0,0.3)] select-none">
          <button
            type="button"
            onClick={handleClear}
            disabled={title === "" && transcript === "" && !uploadedFile}
            className="inline-flex h-10 items-center justify-center gap-1.5 px-4 border border-white/10 bg-white/5 text-muted-foreground hover:text-white hover:border-[#FFB703] hover:shadow-[0_0_12px_rgba(255,183,3,0.2)] disabled:pointer-events-none disabled:opacity-30 text-[10px] font-bold uppercase tracking-widest hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all rounded-none cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
            Clear
          </button>

          <Button
            type="submit"
            variant="primary"
            isLoading={loading}
            disabled={!isValidInput}
            className="h-10 px-6 rounded-none text-[10px] font-bold uppercase tracking-widest hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[0_0_15px_rgba(26,75,255,0.4)] transition-all active:translate-x-0 active:translate-y-0 cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 mr-2" />
            Analyze Meeting
          </Button>
        </div>
      </form>

      {/* Right Sidebar Column */}
      <div className="space-y-6">
        
        {/* Templates Grid card */}
        <Card className="border border-white/10 bg-[#08091E]/40 backdrop-blur-xl rounded-none shadow-[0_0_25px_rgba(26,75,255,0.06)]">
          <CardHeader className="pb-3 border-b border-white/5 select-none p-4">
            <CardTitle className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2 font-mono">
              <StickyNote className="h-4 w-4 text-[#1A4BFF]" /> Templates
            </CardTitle>
            <CardDescription className="text-[10px] text-muted-foreground mt-1">
              Select standard templates to pre-load inputs
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {MOCK_TRANSCRIPT_EXAMPLES.map((example, i) => (
              <button
                key={example.title}
                onClick={() => loadExample(i)}
                type="button"
                className="w-full text-left p-3.5 border border-white/10 bg-black/25 hover:bg-white/5 hover:border-[#9D4EDD]/50 hover:shadow-[0_0_15px_rgba(157,78,221,0.2)] transition-all group flex items-start justify-between cursor-pointer rounded-none"
              >
                <div className="space-y-1.5 min-w-0 pr-1 select-none">
                  <p className="text-[10px] font-bold text-foreground group-hover:text-[#9D4EDD] transition-colors uppercase tracking-wider font-mono">
                    {example.title.split(" ")[0]} spec
                  </p>
                  <p className="text-[10px] text-muted-foreground line-clamp-1 leading-normal font-medium">
                    {example.description}
                  </p>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground shrink-0 mt-0.5 translate-x-[-2px] group-hover:translate-x-0 transition-transform" />
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Deliverables Info Card */}
        <Card className="border border-white/10 bg-[#08091E]/40 backdrop-blur-xl rounded-none shadow-[0_0_25px_rgba(0,240,255,0.06)]">
          <CardHeader className="pb-3 border-b border-white/5 select-none p-4">
            <CardTitle className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2 font-mono">
              <Zap className="h-4 w-4 text-[#00F0FF] animate-pulse" /> Deliverables
            </CardTitle>
            <CardDescription className="text-[10px] text-muted-foreground mt-1">
              Execution workspace will generate:
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-4 space-y-4">
            <ul className="space-y-3 text-[10px] font-bold uppercase tracking-wider text-foreground">
              {[
                { name: "Meeting Summary", color: "text-[#1A4BFF]" },
                { name: "Key Decisions", color: "text-[#9D4EDD]" },
                { name: "Action Items", color: "text-[#FFB703]" },
                { name: "Product Requirements", color: "text-[#1A4BFF]" },
                { name: "Jira Stories", color: "text-[#00F0FF]" },
                { name: "Execution Readiness", color: "text-[#00F5A0]" }
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-2.5">
                  <div className="h-4 w-4 border border-white/10 flex items-center justify-center text-muted-foreground shrink-0 rounded-none bg-black/45">
                    <Check className="h-2.5 w-2.5 stroke-[3] text-[#00F0FF]" />
                  </div>
                  <span className={`tracking-wide font-mono text-[9px] ${item.color}`}>{item.name}</span>
                </li>
              ))}
            </ul>

            {/* Supported Formats */}
            <div className="pt-4 border-t border-white/5 space-y-2.5 select-none font-mono">
              <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest block">Supported Formats</span>
              <div className="flex flex-wrap gap-1.5">
                {["TXT", "Markdown", "DOCX"].map((format) => (
                  <Badge 
                    key={format} 
                    variant="outline" 
                    className="bg-black/30 border border-[#9D4EDD]/25 text-[#9D4EDD] text-[8px] font-bold px-2 py-0.5 rounded-none font-mono"
                  >
                    {format}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
