import * as React from "react";
import { cn } from "../../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "warning" | "error" | "info";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-none border-2 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-accent",
        variant === "default" && "border-transparent bg-primary text-primary-foreground",
        variant === "secondary" && "border-border bg-secondary text-foreground",
        variant === "outline" && "text-foreground border-border bg-background",
        variant === "success" && "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        variant === "warning" && "bg-amber-500/10 text-amber-400 border-amber-500/20",
        variant === "error" && "bg-red-500/10 text-red-400 border-red-500/20",
        variant === "info" && "bg-accent/10 text-accent-foreground border-accent/20",
        className
      )}
      {...props}
    />
  );
}

export { Badge };
