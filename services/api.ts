import { Analysis, ProjectSettings } from "../types";

export async function fetchHistory(): Promise<Analysis[]> {
  try {
    const res = await fetch("/api/history");
    if (!res.ok) throw new Error("Failed to fetch history");
    const serverHistory = (await res.json()) as Analysis[];

    if (typeof window !== "undefined") {
      const listStr = localStorage.getItem("copilot_custom_analyses") || "[]";
      try {
        const list = JSON.parse(listStr) as Analysis[];
        const merged = [...list];
        serverHistory.forEach((srvItem) => {
          if (!merged.some((item) => item.id === srvItem.id)) {
            merged.push(srvItem);
          }
        });
        return merged;
      } catch {
        // Ignore JSON parse errors
      }
    }
    return serverHistory;
  } catch (error) {
    console.error("fetchHistory error:", error);
    // Fallback to localStorage if API route is loading/unavailable
    if (typeof window !== "undefined") {
      const listStr = localStorage.getItem("copilot_custom_analyses") || "[]";
      try {
        return JSON.parse(listStr) as Analysis[];
      } catch {
        return [];
      }
    }
    return [];
  }
}

export async function runAnalysis(title: string, transcript: string): Promise<Analysis> {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, transcript })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to analyze transcript");
  }
  const result = (await res.json()) as Analysis;

  // Persist custom run in localStorage
  if (typeof window !== "undefined") {
    const listStr = localStorage.getItem("copilot_custom_analyses") || "[]";
    try {
      const list = JSON.parse(listStr) as Analysis[];
      list.unshift(result);
      localStorage.setItem("copilot_custom_analyses", JSON.stringify(list));
    } catch {
      // Ignore errors
    }
  }

  return result;
}

const SETTINGS_KEY = "copilot_settings";

export function getLocalSettings(): ProjectSettings {
  if (typeof window === "undefined") {
    return {
      openaiApiKey: "",
      defaultModel: "gpt-4o",
      jiraIntegrationActive: false,
      slackNotificationsActive: false
    };
  }
  const stored = localStorage.getItem(SETTINGS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as ProjectSettings;
    } catch {
      // Return default
    }
  }
  return {
    openaiApiKey: "",
    defaultModel: "gpt-4o",
    jiraIntegrationActive: false,
    slackNotificationsActive: false
  };
}

export function saveLocalSettings(settings: ProjectSettings): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }
}
