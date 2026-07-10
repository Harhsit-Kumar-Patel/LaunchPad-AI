"use client";

import * as React from "react";
import { Key, Server, Settings, Check, RefreshCw } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getLocalSettings, saveLocalSettings } from "@/services/api";
import { ProjectSettings } from "@/types";

export function SettingsForm() {
  const [settings, setSettings] = React.useState<ProjectSettings>({
    openaiApiKey: "",
    defaultModel: "gpt-4o",
    jiraIntegrationActive: false,
    slackNotificationsActive: false
  });
  const [saved, setSaved] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    setSettings(getLocalSettings());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      saveLocalSettings(settings);
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 600);
  };

  return (
    <div className="grid gap-6 md:grid-cols-3 font-sans">
      {/* Sidebar instructions */}
      <div className="space-y-4 select-none">
        <h2 className="text-xs font-bold text-foreground uppercase tracking-widest flex items-center gap-2 font-mono">
          <Settings className="h-4 w-4 text-accent" /> Preferences
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
          Configure API credentials, choose AI processing models, and toggle platform integrations for your workspace.
        </p>
        <div className="border-2 border-border-strong p-4 bg-muted/10 text-xs text-muted-foreground font-medium leading-relaxed rounded-none">
          Note: Credentials saved here are stored entirely in your local browser sandbox and never transmitted to our telemetry servers.
        </div>
      </div>

      {/* Main settings form */}
      <Card className="md:col-span-2 border-2 border-border bg-card shadow-hard-md rounded-none">
        <form onSubmit={handleSave}>
          <CardHeader className="border-b-2 border-border p-6 select-none">
            <CardTitle>Workspace Configuration</CardTitle>
            <CardDescription>Setup details for Next.js API processing modules</CardDescription>
          </CardHeader>
          
          <CardContent className="p-6 space-y-6">
            {/* OpenAI API Key */}
            <div className="space-y-2">
              <label htmlFor="apiKey" className="text-[9px] font-bold uppercase tracking-widest text-foreground flex items-center gap-1.5 font-mono select-none">
                <Key className="h-3.5 w-3.5 text-muted-foreground" /> OpenAI API Key
              </label>
              <Input
                id="apiKey"
                type="password"
                placeholder="sk-proj-..."
                value={settings.openaiApiKey}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, openaiApiKey: e.target.value }))
                }
                className="rounded-none bg-background"
              />
              <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider select-none">
                Required for real-time model parsing steps.
              </p>
            </div>

            {/* Model selection */}
            <div className="space-y-2">
              <label htmlFor="model" className="text-[9px] font-bold uppercase tracking-widest text-foreground flex items-center gap-1.5 font-mono select-none">
                <Server className="h-3.5 w-3.5 text-muted-foreground" /> Default Language Model
              </label>
              <select
                id="model"
                className="flex h-10 w-full rounded-none border-2 border-border bg-background px-3 py-2 text-xs text-foreground focus-visible:outline-none focus:border-accent focus:ring-0 transition-colors duration-150"
                value={settings.defaultModel}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, defaultModel: e.target.value }))
                }
              >
                <option value="gpt-4o">GPT-4o (High Accuracy)</option>
                <option value="gpt-4o-mini">GPT-4o Mini (Fast)</option>
                <option value="o1-preview">OpenAI o1 Reasoning</option>
              </select>
            </div>

            {/* Integration toggles */}
            <div className="space-y-4 pt-4 border-t-2 border-border">
              <h3 className="text-[10px] font-bold text-foreground uppercase tracking-widest font-mono select-none">Integrations</h3>

              {/* Jira toggle */}
              <div className="flex items-center justify-between py-1">
                <div className="space-y-1">
                  <label htmlFor="jira" className="text-xs font-bold text-foreground uppercase tracking-wide">Jira Cloud Sync</label>
                  <p className="text-xs text-muted-foreground font-medium">
                    Automatically push generated stories into your Jira boards
                  </p>
                </div>
                <input
                  id="jira"
                  type="checkbox"
                  className="h-4.5 w-4.5 rounded-none border-2 border-border bg-background text-accent focus:ring-0 cursor-pointer"
                  checked={settings.jiraIntegrationActive}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      jiraIntegrationActive: e.target.checked
                    }))
                  }
                />
              </div>

              {/* Slack toggle */}
              <div className="flex items-center justify-between py-1">
                <div className="space-y-1">
                  <label htmlFor="slack" className="text-xs font-bold text-foreground uppercase tracking-wide">Slack Action Alerts</label>
                  <p className="text-xs text-muted-foreground font-medium">
                    Ping assignees with webhook reports for action items
                  </p>
                </div>
                <input
                  id="slack"
                  type="checkbox"
                  className="h-4.5 w-4.5 rounded-none border-2 border-border bg-background text-accent focus:ring-0 cursor-pointer"
                  checked={settings.slackNotificationsActive}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      slackNotificationsActive: e.target.checked
                    }))
                  }
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-border select-none">
              <Button
                type="submit"
                variant="primary"
                disabled={saving}
                className="w-full sm:w-auto h-10 px-6"
              >
                {saving ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 mr-2 animate-spin" /> Saving...
                  </>
                ) : saved ? (
                  <>
                    <Check className="h-3.5 w-3.5 mr-2" /> Saved Settings
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
