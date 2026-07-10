import { useState, useEffect, useCallback } from "react";
import { Analysis } from "../types";
import { fetchHistory, runAnalysis } from "../services/api";

export function useAnalysis() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchHistory();
      setAnalyses(data);
    } catch (err: any) {
      setError(err.message || "Failed to load history");
    } finally {
      setLoading(false);
    }
  }, []);

  const analyze = async (title: string, transcript: string): Promise<Analysis> => {
    setLoading(true);
    setError(null);
    try {
      const result = await runAnalysis(title, transcript);
      setAnalyses((prev) => [result, ...prev]);
      return result;
    } catch (err: any) {
      setError(err.message || "Failed to analyze transcript");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return {
    analyses,
    loading,
    error,
    refreshHistory: loadHistory,
    analyze
  };
}
