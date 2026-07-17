"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Cpu, Check, AlertCircle, RefreshCw, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { runAnalysis } from "@/services/api";
import { Analysis } from "@/types";
import { Button } from "@/components/ui/button";

const PROCESSING_STEPS = [
  { label: "Reading transcript", threshold: 15 },
  { label: "Understanding product context", threshold: 35 },
  { label: "Extracting decisions", threshold: 50 },
  { label: "Building PRD", threshold: 70 },
  { label: "Creating engineering tickets", threshold: 85 },
  { label: "Evaluating execution readiness", threshold: 98 }
];

function LoadingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idParam = searchParams?.get("id");

  const [progress, setProgress] = React.useState(0);
  const [loadingState, setLoadingState] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = React.useState<Analysis | null>(null);

  // Store transcript configuration locally for retries
  const [pendingSpec, setPendingSpec] = React.useState<{ title: string; transcript: string } | null>(null);

  // Mounted ref to track component existence across hook cleanups securely
  const isMountedRef = React.useRef(true);
  React.useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Initialize transcript data from sessionStorage or localStorage (regeneration)
  React.useEffect(() => {
    let title = "";
    let transcript = "";
    let pendingStr: string | null = null;

    // 1. Try reading from sessionStorage, fallback to localStorage
    try {
      if (typeof window !== "undefined") {
        pendingStr = sessionStorage.getItem("copilot_pending_analysis") || localStorage.getItem("copilot_pending_analysis");
      }
    } catch (e) {
      console.warn("Could not read from storage APIs:", e);
    }

    if (pendingStr) {
      try {
        const parsed = JSON.parse(pendingStr);
        title = parsed.title || "";
        transcript = parsed.transcript || "";
        setPendingSpec({ title, transcript });
        setLoadingState("loading");
        return;
      } catch (err) {
        console.error("Failed to parse pending analysis spec:", err);
      }
    }

    // 2. Try loading by ID if regenerating
    if (idParam) {
      const customList = localStorage.getItem("copilot_custom_analyses");
      if (customList) {
        try {
          const list = JSON.parse(customList) as Analysis[];
          const found = list.find((item) => item.id === idParam);
          if (found) {
            title = found.title;
            transcript = found.transcript;
            setPendingSpec({ title, transcript });
            setLoadingState("loading");
            return;
          }
        } catch (err) {
          console.error("Failed to load historical analyses lists:", err);
        }
      }
    }

    // If no context is found, redirect to new analysis
    router.push("/new-analysis");
  }, [idParam, router]);

  // Run the API call and progress simulation
  React.useEffect(() => {
    if (loadingState !== "loading" || !pendingSpec) return;

    let progressTimer: NodeJS.Timeout;

    // Reset progress tracker
    setProgress(0);
    setErrorMsg(null);

    // 1. Simulate progress bar percentage slowly
    const runProgressSimulation = () => {
      progressTimer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 97) {
            clearInterval(progressTimer);
            return 97; // Hold at 97% until fetch succeeds
          }
          // Increment faster early on, slower as it nears completion
          const increment = prev < 50 ? 2 : 1;
          return prev + increment;
        });
      }, 250);
    };

    runProgressSimulation();

    // 2. Execute the actual API analysis call
    async function executeCall() {
      try {
        const result = await runAnalysis(pendingSpec!.title, pendingSpec!.transcript);
        
        if (!isMountedRef.current) return;
        
        // Fast-forward progress to 100%
        clearInterval(progressTimer);
        setProgress(100);
        setAnalysisResult(result);
        setLoadingState("success");
        
        // Clear pending spec out of session and local state
        try {
          sessionStorage.removeItem("copilot_pending_analysis");
          localStorage.removeItem("copilot_pending_analysis");
        } catch (_) {}

        // Delay redirect to allow Success screen to display fully
        setTimeout(() => {
          if (isMountedRef.current) {
            router.push(`/results/${result.id}`);
          }
        }, 1800);

      } catch (err: any) {
        if (!isMountedRef.current) return;
        clearInterval(progressTimer);
        
        // Handle common error states cleanly
        let friendlyError = err.message || "An unexpected network error occurred.";
        if (friendlyError.toLowerCase().includes("timeout")) {
          friendlyError = "The analysis request timed out (API took too long to reply). Please retry.";
        } else if (friendlyError.toLowerCase().includes("rate limit") || friendlyError.includes("429")) {
          friendlyError = "API rate limits exceeded. Please wait a few seconds and try again.";
        } else if (friendlyError.toLowerCase().includes("api key") || friendlyError.includes("401")) {
          friendlyError = "Invalid API Key. Please verify settings configuration.";
        }

        setErrorMsg(friendlyError);
        setLoadingState("error");
      }
    }

    executeCall();

    return () => {
      clearInterval(progressTimer);
    };
  }, [loadingState, pendingSpec, router]);

  // Determine current active processing step based on simulated progress
  const getActiveStepIndex = () => {
    for (let i = 0; i < PROCESSING_STEPS.length; i++) {
      if (progress < PROCESSING_STEPS[i].threshold) {
        return i;
      }
    }
    return PROCESSING_STEPS.length - 1;
  };

  const activeStepIdx = getActiveStepIndex();

  const handleRetry = () => {
    setLoadingState("loading");
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 font-sans select-none">
      <AnimatePresence mode="wait">
        
        {/* SUCCESS STATE */}
        {loadingState === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="max-w-md w-full py-12 px-8 border border-[#00F5A0]/25 bg-card backdrop-blur-xl rounded-none shadow-[0_0_30px_rgba(0,245,160,0.15)] text-center space-y-6 relative overflow-hidden"
          >
            <div className="absolute right-0 top-0 w-16 h-16 border-b border-l border-[#00F5A0]/20 pointer-events-none" />
            <div className="absolute left-0 bottom-0 w-16 h-16 border-t border-r border-[#00F5A0]/20 pointer-events-none" />

            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: [0.5, 1.1, 1], opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-16 w-16 bg-[#00F5A0]/10 border border-[#00F5A0]/30 mx-auto flex items-center justify-center text-[#00F5A0] shadow-[0_0_20px_rgba(0,245,160,0.15)]"
            >
              <Check className="h-8 w-8 stroke-[3]" />
            </motion.div>

            <div className="space-y-2">
              <h2 className="text-sm font-bold text-foreground uppercase tracking-widest font-mono">
                Analysis Completed
              </h2>
              <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                Writing spec reports to workspace database...
              </p>
            </div>
          </motion.div>
        )}

        {/* ERROR STATE */}
        {loadingState === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="max-w-md w-full py-10 px-8 border border-red-500/25 bg-card backdrop-blur-xl rounded-none shadow-[0_0_30px_rgba(239,68,68,0.15)] text-center space-y-6 relative overflow-hidden animate-none"
          >
            <div className="absolute right-0 top-0 w-16 h-16 border-b border-l border-red-500/10 pointer-events-none" />
            <div className="absolute left-0 bottom-0 w-16 h-16 border-t border-r border-red-500/10 pointer-events-none" />

            <div className="h-14 w-14 bg-red-500/10 border border-red-500/30 mx-auto flex items-center justify-center text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
              <AlertCircle className="h-7 w-7" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xs font-bold text-red-500 uppercase tracking-widest font-mono">
                Pipeline Execution Failed
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto font-medium">
                {errorMsg || "An unexpected communication error occurred. Check network connection or configurations."}
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => router.push("/new-analysis")}
                className="h-8 text-[10px] font-bold uppercase tracking-wider font-mono rounded-none"
              >
                Abort
              </Button>
              <Button
                variant="primary"
                onClick={handleRetry}
                className="h-8 text-[10px] font-bold uppercase tracking-wider font-mono rounded-none bg-accent text-white flex items-center gap-1.5"
              >
                <RefreshCw className="h-3 w-3" /> Retry Analysis
              </Button>
            </div>
          </motion.div>
        )}

        {/* LOADING STATE */}
        {(loadingState === "loading" || loadingState === "idle") && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-md w-full space-y-10 py-12 px-6 border border-border bg-card backdrop-blur-xl rounded-none shadow-glow-violet text-center relative overflow-hidden"
          >
            <div className="absolute right-0 top-0 w-16 h-16 border-b border-l border-border pointer-events-none" />
            <div className="absolute left-0 bottom-0 w-16 h-16 border-t border-r border-border pointer-events-none" />

            {/* Dynamic AI Logo */}
            <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 bg-accent/10 rounded-full blur-2xl animate-pulse" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                className="absolute inset-0 border-2 border-dashed border-[#9D4EDD]/35 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                className="absolute inset-3 border border-dashed border-[#00F0FF]/35 rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="h-16 w-16 bg-gradient-to-br from-accent to-[#9D4EDD] flex items-center justify-center text-white font-black text-xl shadow-[0_0_25px_rgba(26,75,255,0.45)]"
              >
                <Cpu className="h-7 w-7 animate-pulse text-white" />
              </motion.div>
            </div>

            {/* Progress Percentage Display */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-foreground uppercase tracking-widest font-mono flex items-center justify-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#00F0FF] animate-spin" /> Compiling Analysis... {progress}%
              </h2>
              <div className="h-1.5 w-full bg-white/5 border border-border rounded-none overflow-hidden relative shadow-inner">
                <motion.div
                  className="h-full bg-gradient-to-r from-accent via-[#9D4EDD] to-[#00F0FF]"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
                Synthesizing dialogue models & backlog diagnostics
              </p>
            </div>

            {/* Processing Steps Checklist */}
            <div className="space-y-3.5 text-left max-w-[270px] mx-auto pt-4 border-t border-border">
              {PROCESSING_STEPS.map((step, idx) => {
                const isCompleted = progress >= PROCESSING_STEPS[idx].threshold || (progress === 100);
                const isActive = activeStepIdx === idx && progress < 100;
                
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: isCompleted || isActive ? 1 : 0.25, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-3 text-xs"
                  >
                    {isCompleted ? (
                      <div className="h-4.5 w-4.5 border border-[#00F5A0]/30 bg-[#00F5A0]/10 flex items-center justify-center text-[#00F5A0] shadow-[0_0_8px_rgba(0,245,160,0.15)] shrink-0">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                    ) : isActive ? (
                      <div className="h-4.5 w-4.5 border border-[#00F0FF]/30 bg-[#00F0FF]/10 flex items-center justify-center text-[#00F0FF] shadow-[0_0_8px_rgba(0,240,255,0.2)] shrink-0">
                        <span className="h-1.5 w-1.5 bg-[#00F0FF] rounded-full animate-ping" />
                      </div>
                    ) : (
                      <div className="h-4.5 w-4.5 border border-border bg-white/5 shrink-0" />
                    )}
                    <span className={cn(
                      "font-mono uppercase tracking-wider font-bold text-[10px] truncate",
                      isCompleted && "text-muted-foreground/60 line-through decoration-white/10",
                      isActive && "text-foreground",
                      !isCompleted && !isActive && "text-muted-foreground/30"
                    )}>
                      {step.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AnalysisLoadingPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-[70vh] flex items-center justify-center font-mono text-[10px] font-bold text-muted-foreground tracking-widest uppercase animate-pulse">
        Initializing execution pipeline...
      </div>
    }>
      <LoadingContent />
    </React.Suspense>
  );
}
