"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Cpu, Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const PROCESSING_STEPS = [
  "Understanding Meeting Context",
  "Identifying Product Decisions",
  "Extracting Action Items",
  "Building Product Requirements",
  "Creating Jira Stories",
  "Checking Execution Readiness"
];

function LoadingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams?.get("id");

  const [activeStep, setActiveStep] = React.useState(0);

  // Cycle through the steps to simulate loading progress
  React.useEffect(() => {
    if (activeStep >= PROCESSING_STEPS.length) {
      // Transition delay for polish
      const timer = setTimeout(() => {
        if (id) {
          router.push(`/results/${id}`);
        } else {
          router.push("/");
        }
      }, 1000);
      return () => clearTimeout(timer);
    }

    const interval = setTimeout(() => {
      setActiveStep((prev) => prev + 1);
    }, 1200);

    return () => clearTimeout(interval);
  }, [activeStep, id, router]);

  const progress = Math.min(100, Math.round((activeStep / PROCESSING_STEPS.length) * 100));

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 font-sans">
      <div className="max-w-md w-full space-y-10 py-12 px-6 border border-border bg-card backdrop-blur-xl rounded-none shadow-glow-violet text-center relative overflow-hidden">
        {/* Top diagonal geometric corner details */}
        <div className="absolute right-0 top-0 w-16 h-16 border-b border-l border-border pointer-events-none" />
        <div className="absolute left-0 bottom-0 w-16 h-16 border-t border-r border-border pointer-events-none" />

        {/* Dynamic Abstract Rotating AI Logo */}
        <div className="relative w-32 h-32 mx-auto flex items-center justify-center select-none">
          {/* Glowing background halo */}
          <div className="absolute inset-0 bg-accent/10 rounded-full blur-2xl animate-pulse" />
          
          {/* Outer rotating ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
            className="absolute inset-0 border-2 border-dashed border-[#9D4EDD]/35 rounded-full"
          />
          
          {/* Inner opposite rotating ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            className="absolute inset-3 border border-dashed border-[#00F0FF]/35 rounded-full"
          />
          
          {/* Core pulsing CPU container */}
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="h-16 w-16 bg-gradient-to-br from-accent to-[#9D4EDD] flex items-center justify-center text-white font-black text-xl shadow-[0_0_25px_rgba(26,75,255,0.45)]"
          >
            <Cpu className="h-7 w-7 animate-pulse text-white" />
          </motion.div>
        </div>

        {/* Progress Percentage Display */}
        <div className="space-y-3 select-none">
          <h2 className="text-xs font-bold text-foreground uppercase tracking-widest font-mono">
            Compiling Analysis... {progress}%
          </h2>
          {/* Premium Gradient Progress Bar */}
          <div className="h-1.5 w-full bg-white/5 border border-border rounded-none overflow-hidden relative shadow-inner">
            <motion.div
              className="h-full bg-gradient-to-r from-accent via-[#9D4EDD] to-[#00F0FF]"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
            Synthesizing dialogue models & backlog diagnostics
          </p>
        </div>

        {/* Sequential Processing Steps Checklist */}
        <div className="space-y-3.5 text-left max-w-[270px] mx-auto pt-4 border-t border-border select-none">
          {PROCESSING_STEPS.map((step, idx) => {
            const isCompleted = activeStep > idx;
            const isActive = activeStep === idx;
            
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: isCompleted || isActive ? 1 : 0.25, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3 text-xs"
              >
                {isCompleted ? (
                  <div className="h-4.5 w-4.5 border border-[#047857]/30 bg-emerald-500/10 flex items-center justify-center text-[#047857] dark:text-[#00F5A0] dark:border-[#00F5A0]/30 shadow-[0_0_8px_rgba(0,245,160,0.15)] shrink-0">
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
                  isCompleted && "text-muted-foreground/60 line-through decoration-black/20 dark:decoration-white/20",
                  isActive && "text-foreground",
                  !isCompleted && !isActive && "text-muted-foreground/30"
                )}>
                  {step}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
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
