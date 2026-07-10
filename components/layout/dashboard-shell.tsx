"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Sparkles, 
  History, 
  Settings, 
  Search, 
  Menu, 
  X, 
  Cpu, 
  Bell, 
  Command,
  ArrowRight,
  Sun,
  Moon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [searchFocused, setSearchFocused] = React.useState(false);
  const [cmdKOpen, setCmdKOpen] = React.useState(false);
  const [cmdKSearch, setCmdKSearch] = React.useState("");
  const [theme, setTheme] = React.useState<"light" | "dark">("dark");

  // Sync state with HTML root class on mount
  React.useEffect(() => {
    const isLight = document.documentElement.classList.contains("light");
    setTheme(isLight ? "light" : "dark");
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    if (nextTheme === "light") {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  const navigationItems = [
    { label: "Workspace", href: "/", icon: LayoutDashboard, shortcut: "G D" },
    { label: "Analyze", href: "/new-analysis", icon: Sparkles, shortcut: "G N" },
    { label: "History", href: "/history", icon: History, shortcut: "G H" },
    { label: "Settings", href: "/settings", icon: Settings, shortcut: "G S" }
  ];

  // Cmd+K shortcut listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdKOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setCmdKOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navigateTo = (href: string) => {
    router.push(href);
    setCmdKOpen(false);
    setMobileMenuOpen(false);
  };

  const filteredItems = navigationItems.filter(item => 
    item.label.toLowerCase().includes(cmdKSearch.toLowerCase())
  );

  const springTransition = {
    type: "spring",
    stiffness: 400,
    damping: 28,
    mass: 0.8
  } as const;

  return (
    <div className="min-h-screen flex bg-background text-foreground overflow-x-hidden selection:bg-accent/20 selection:text-white font-sans">
      
      {/* Desktop Minimal Left Rail */}
      <aside className="hidden md:flex flex-col w-20 border-r border-white/5 bg-[#050614]/65 backdrop-blur-xl fixed top-0 bottom-0 left-0 z-40">
        {/* Logo Section */}
        <div className="h-20 flex items-center justify-center border-b border-white/5">
          <Link href="/" className="group">
            <div className="flex h-10 w-10 items-center justify-center border-2 border-accent/80 bg-accent/5 text-accent transition-all duration-200 group-hover:bg-accent group-hover:text-white font-black text-lg shadow-[0_0_12px_rgba(26,75,255,0.3)]">
              L
            </div>
          </Link>
        </div>

        {/* Sidebar Nav (Vertical icons with micro text labels) */}
        <nav className="flex-1 py-8 space-y-6 flex flex-col items-center">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center w-16 h-16 transition-all duration-200 group relative focus:outline-none border-2",
                  isActive
                    ? "border-accent/40 bg-accent/10 text-foreground shadow-[0_0_15px_rgba(26,75,255,0.15)]"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5 transition-transform duration-200 group-hover:scale-105",
                  isActive ? "text-accent" : ""
                )} />
                <span className="text-[9px] font-bold uppercase tracking-wider mt-1 text-center scale-90 group-hover:scale-95 transition-transform">
                  {item.label === "Workspace" ? "Board" : item.label.split(" ")[0]}
                </span>
                
                {/* Active Indicator Pin */}
                {isActive && (
                  <div className="absolute right-[-2px] top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer Profile */}
        <div className="p-4 border-t-2 border-border flex items-center justify-center">
          <div 
            onClick={() => navigateTo("/settings")}
            className="h-10 w-10 border-2 border-border-strong hover:border-foreground cursor-pointer transition-all duration-200 flex items-center justify-center font-bold text-xs bg-muted text-foreground uppercase shadow-hard-sm"
            title="Harshit Amin (Workspace Owner)"
          >
            HA
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Drawer Sidebar */}
      <div className={cn(
        "fixed top-0 bottom-0 left-0 z-50 w-72 bg-card border-r-2 border-border flex flex-col transition-transform duration-300 ease-in-out md:hidden rounded-none",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-20 flex items-center justify-between px-6 border-b-2 border-border">
          <Link href="/" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
            <div className="flex h-9 w-9 items-center justify-center border-2 border-foreground bg-transparent text-foreground font-black text-sm">
              L
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
                LaunchPad AI
              </span>
              <span className="text-xs font-black tracking-tight mt-0.5 uppercase">
                Execution Workspace
              </span>
            </div>
          </Link>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="p-1.5 text-muted-foreground hover:text-foreground border-2 border-transparent hover:border-border-strong bg-transparent transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 border-2 transition-all duration-200 text-sm font-bold uppercase tracking-wider",
                  isActive
                    ? "border-accent bg-accent/5 text-foreground shadow-hard-sm"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-accent" : "")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t-2 border-border bg-background">
          <div className="flex items-center gap-3 p-2 border-2 border-transparent hover:border-border-strong transition-all">
            <div className="h-8 w-8 border-2 border-border-strong flex items-center justify-center text-xs font-bold uppercase">
              HA
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">Harshit Amin</p>
              <p className="text-[9px] text-muted-foreground truncate uppercase tracking-wider">Workspace Pro</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col md:pl-20 min-w-0">
        
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-20 border-b border-white/5 bg-[#030307]/50 backdrop-blur-xl px-6 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            {/* Hamburger for mobile */}
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-muted-foreground hover:text-foreground border-2 border-transparent hover:border-border bg-transparent md:hidden transition-all duration-200"
            >
              <Menu className="h-4.5 w-4.5" />
            </button>

            {/* Path Breadcrumb */}
            <div className="flex items-center gap-2 select-none">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-mono hidden sm:inline">
                LaunchPad AI
              </span>
              <span className="text-muted-foreground font-mono text-xs hidden sm:inline">/</span>
              <h1 className="text-xs font-bold uppercase tracking-widest font-mono text-foreground">
                {pathname === "/" 
                  ? "Execution Board" 
                  : pathname.split("/").pop()?.replace("-", " ") || "Dashboard"}
              </h1>
            </div>
          </div>

          {/* Search Trigger (⌘K) & Actions */}
          <div className="flex items-center gap-4 flex-none">
            {/* Elegant Search Button */}
            <button 
              onClick={() => setCmdKOpen(true)}
              className={cn(
                "relative hidden md:flex items-center w-52 h-10 px-3.5 border transition-all duration-200 bg-white/5 hover:bg-white/10 cursor-pointer border-border hover:border-border-strong",
                cmdKOpen && "border-[#9D4EDD] text-foreground shadow-[0_0_12px_rgba(157,78,221,0.15)] bg-[#9D4EDD]/5"
              )}
            >
              <Search className="h-3.5 w-3.5 text-muted-foreground mr-2" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-mono">Search Board...</span>
              <kbd className="absolute right-2.5 h-5 px-1.5 border border-border bg-background font-mono text-[9px] font-bold text-muted-foreground flex items-center gap-0.5">
                <span>⌘</span>K
              </kbd>
            </button>

            {/* Theme Toggle Switcher */}
            <button 
              onClick={toggleTheme}
              className="p-2.5 text-muted-foreground hover:text-foreground border border-transparent hover:border-border transition-all duration-200 cursor-pointer rounded-none"
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            {/* Notifications */}
            <button className="relative p-2.5 text-muted-foreground hover:text-foreground border border-transparent hover:border-border transition-all duration-200">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-[#00F0FF] shadow-[0_0_6px_#00F0FF]" />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-6 sm:px-8 py-10 md:py-12">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t-2 border-border py-8 text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-card">
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              &copy; {new Date().getFullYear()} LaunchPad AI &bull; From Product Meetings to Launch-Ready Execution.
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <span>&bull;</span>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <span>&bull;</span>
              <a href="#" className="hover:text-foreground transition-colors">Integrations</a>
            </div>
          </div>
        </footer>
      </div>

      {/* Command Palette Modal */}
      <AnimatePresence>
        {cmdKOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
            {/* Modal Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={springTransition}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setCmdKOpen(false)}
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={springTransition}
              className="relative w-full max-w-lg border-2 border-border-strong bg-card text-foreground shadow-hard-lg overflow-hidden rounded-none"
            >
              {/* Search input header */}
              <div className="flex items-center border-b-2 border-border px-4 h-12">
                <Command className="h-4 w-4 text-muted-foreground mr-3" />
                <input
                  type="text"
                  placeholder="Type a command or page name..."
                  value={cmdKSearch}
                  onChange={(e) => setCmdKSearch(e.target.value)}
                  className="flex-1 bg-transparent border-0 text-sm placeholder-muted-foreground focus:outline-none focus:ring-0 font-mono"
                  autoFocus
                />
                <span className="text-[9px] font-bold font-mono text-muted-foreground border border-border-strong px-1.5 py-0.5 bg-background select-none">ESC</span>
              </div>

              {/* Action list */}
              <div className="max-h-72 overflow-y-auto p-2">
                <div className="px-2 py-1.5 text-[9px] font-bold text-muted-foreground uppercase tracking-widest font-mono">
                  Navigation Commands
                </div>
                {filteredItems.length > 0 ? (
                  <div className="space-y-0.5 mt-1">
                    {filteredItems.map((item) => (
                      <button
                        key={item.href}
                        onClick={() => navigateTo(item.href)}
                        className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-mono font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-all text-left"
                      >
                        <span className="flex items-center gap-3">
                          <item.icon className="h-4 w-4" />
                          {item.label}
                        </span>
                        <span className="text-[9px] text-muted-foreground border border-border-strong px-1.5 py-0.5 bg-background uppercase">
                          {item.shortcut}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-3 py-8 text-center text-xs text-muted-foreground font-mono">
                    No commands matching "{cmdKSearch}"
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
