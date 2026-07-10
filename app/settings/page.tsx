"use client";

import { SettingsForm } from "@/features/settings/components/settings-form";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b-2 border-border pb-6 select-none">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground flex items-center gap-2 uppercase">
          Workspace Settings
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mt-1 font-medium">
          Adjust preferences, manage API keys, and configure standard deployment settings.
        </p>
      </div>

      {/* Main settings form */}
      <SettingsForm />
    </div>
  );
}
