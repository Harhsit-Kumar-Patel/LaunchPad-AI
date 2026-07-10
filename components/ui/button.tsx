import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-none font-bold uppercase tracking-widest text-[10px] sm:text-xs transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-40 cursor-pointer",
          // Variants
          variant === "primary" && "bg-primary text-primary-foreground border-2 border-primary hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-hard-sm active:translate-x-0 active:translate-y-0 shadow-none",
          variant === "secondary" && "bg-secondary text-foreground border-2 border-border-strong hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-hard-sm active:translate-x-0 active:translate-y-0",
          variant === "outline" && "border-2 border-border bg-transparent text-foreground hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-hard-sm active:translate-x-0 active:translate-y-0",
          variant === "ghost" && "hover:bg-muted/60 hover:text-foreground border-2 border-transparent",
          variant === "destructive" && "bg-destructive text-destructive-foreground border-2 border-destructive hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-hard-sm active:translate-x-0 active:translate-y-0",
          // Sizes
          size === "sm" && "h-8 px-3 text-[9px] tracking-wider",
          size === "md" && "h-10 px-5 text-[10px]",
          size === "lg" && "h-11 px-8 text-xs",
          className
        )}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 h-3.5 w-3.5 animate-spin rounded-none border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
