import { genAI } from "../lib/gemini";
import { getSystemPrompt, getUserPrompt } from "../lib/prompts";
import { AIServiceResponseSchema, MeetingAnalysis, Decision, ActionItem, JiraStory, geminiResponseSchema } from "../types/analysis";

/**
 * Service class responsible for coordinating transcript analysis operations.
 * Handles the AI request lifecycle, prompt building, structured data parsing,
 * validation, timeouts, and error classification using Google Gemini.
 */
export class AnalysisService {
  /**
   * Analyzes a raw meeting transcript using Google Gemini's structured JSON completions.
   * 
   * @param transcript The raw meeting text or transcript dialogue.
   * @param title An optional title describing the discussion context.
   * @returns A promise resolving to a validated MeetingAnalysis object matching the frontend.
   */
  static async analyze(transcript: string, title?: string): Promise<MeetingAnalysis> {
    if (!transcript || transcript.trim() === "") {
      throw new Error("Transcript content is required.");
    }

    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const requestTimeout = parseInt(process.env.AI_REQUEST_TIMEOUT_MS || "45000", 10);

    try {
      // Get the Gemini generative model with structured JSON constraints
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: geminiResponseSchema as any,
          temperature: 0.1,
        }
      });

      const systemPrompt = getSystemPrompt();
      const userPrompt = getUserPrompt(transcript, title);
      
      // Combine prompts logically for Gemini instruction context
      const combinedPrompt = `${systemPrompt}\n\nMeeting to Analyze:\n${userPrompt}`;

      // Call generation with manual promise race for custom timeout control
      const generatePromise = model.generateContent(combinedPrompt);
      const timeoutPromise = new Promise<never>((_, reject) => {
        const error = new Error("APITimeoutError");
        error.name = "APITimeoutError";
        setTimeout(() => reject(error), requestTimeout);
      });

      const response = await Promise.race([generatePromise, timeoutPromise]);
      const content = response.response?.text();

      if (!content) {
        throw new Error("Gemini API returned an empty or null response body.");
      }

      // Clean Markdown tags if any leak through
      let cleanContent = content.trim();
      if (cleanContent.startsWith("```")) {
        cleanContent = cleanContent.replace(/^```[a-zA-Z]*\n/, "");
        cleanContent = cleanContent.replace(/\n```$/, "");
        cleanContent = cleanContent.trim();
      }

      let parsedJSON: unknown;
      try {
        parsedJSON = JSON.parse(cleanContent);
      } catch (parseErr: any) {
        throw new Error(`Failed to parse AI response content as valid JSON: ${parseErr.message}\nRaw content: ${content}`);
      }

      // Validate parsed JSON matches our required structured Zod subset
      const validation = AIServiceResponseSchema.safeParse(parsedJSON);

      if (!validation.success) {
        const errorDetail = validation.error.issues
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
          .join("; ");
        throw new Error(`AI response failed schema validation: ${errorDetail}`);
      }

      const data = validation.data;

      // 1. MAP summary to markdown block formatting
      const summaryMarkdown = 
        `### Meeting Objective\n${data.summary.meetingObjective}\n\n` +
        `### Business Context\n${data.summary.businessContext}\n\n` +
        `### Executive Summary\n${data.summary.executiveSummary}\n\n` +
        `### Key Outcomes\n${data.summary.keyOutcomes.map(o => `- ${o}`).join("\n")}`;

      // 2. MAP decisions
      const decisions: Decision[] = data.keyDecisions.map((d, index) => {
        // Map priority to decision status
        let status: "agreed" | "proposed" | "needs-review" = "agreed";
        if (d.priority === "medium") status = "proposed";
        if (d.priority === "low") status = "needs-review";

        const description = 
          `**Reasoning:** ${d.reasoning}\n\n` +
          `**Impact:** ${d.impact}\n\n` +
          `**Confidence Level:** ${d.confidenceLevel}`;

        return {
          id: `dec-${Date.now()}-${index + 1}`,
          title: d.decision,
          description,
          owner: d.affectedTeams.join(", ") || "Product Team",
          status,
        };
      });

      // 3. MAP action items
      const actionItems: ActionItem[] = data.actionItems.map((a, index) => {
        // Handle deadline dates safely
        let dueDate = a.suggestedDeadline;
        if (dueDate.toLowerCase() === "tbd" || !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
          dueDate = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split("T")[0]; // default to 7 days out
        }

        const title = a.task + (a.dependency && a.dependency !== "None" ? ` (Depends on: ${a.dependency})` : "");

        return {
          id: `act-${Date.now()}-${index + 1}`,
          title,
          assignee: a.owner,
          dueDate,
          priority: a.priority,
          status: a.status,
        };
      });

      // 4. MAP PRD requirements
      const prdTitle = title ? `${title} PRD Spec` : "Product Requirements Document";
      const prdOverview = 
        `### Background\n${data.prd.background}\n\n` +
        `### Target Users\n${data.prd.targetUsers.map((u) => `- ${u}`).join("\n")}\n\n` +
        `### Future Scope\n${data.prd.futureScope.map((s) => `- ${s}`).join("\n")}`;

      const nonFunctionalAndRisks = 
        `**Non-Functional Requirements:**\n` +
        data.prd.nonFunctionalRequirements.map((r) => `- ${r}`).join("\n") +
        `\n\n**Risks:**\n` +
        data.prd.risks.map((r) => `- ${r}`).join("\n");

      // Merge goals and user stories
      const userStories = [
        ...data.prd.goals.map(g => `Goal: ${g}`),
        ...data.prd.userStories
      ];

      // Merge functional requirements and acceptance criteria
      const functionalRequirements = [
        ...data.prd.functionalRequirements,
        `**Acceptance Criteria Guidelines:**\n` + data.prd.acceptanceCriteria.map(a => `- ${a}`).join("\n")
      ];

      const prd = {
        title: prdTitle,
        overview: prdOverview,
        problemStatement: data.prd.problemStatement,
        userStories,
        functionalRequirements,
        outOfScope: [nonFunctionalAndRisks],
        successMetrics: data.prd.successMetrics,
      };

      // 5. MAP Jira backlog stories
      const jiraStories: JiraStory[] = data.jiraStories.map((story, index) => {
        const title = `[${story.epic}] ${story.title}`;
        const description = 
          `**Business Value:**\n${story.businessValue}\n\n` +
          `**Dependencies:**\n${story.dependencies.join(", ") || "None"}\n\n` +
          `**Description:**\n${story.description}`;

        return {
          id: `jira-${Date.now()}-${index + 1}`,
          key: `COP-${101 + index}`,
          title,
          description,
          acceptanceCriteria: story.acceptanceCriteria,
          priority: story.priority,
          points: story.storyPoints,
        };
      });

      // 6. MAP readiness scores and status
      const score = data.executionReadiness.overallReadinessScore;
      const status = score >= 80 ? "ready" : score >= 50 ? "needs-clarification" : "blocked";

      const blockers = [
        ...data.executionReadiness.criticalBlockers.map(b => `Blocker: ${b}`),
        ...data.prd.risks.map(r => `Risk: ${r}`)
      ];

      const missingInfo = [
        ...data.executionReadiness.missingInformation.map(m => `Missing Info: ${m}`),
        `**Open Questions:**\n` + data.executionReadiness.openQuestions.map(q => `- ${q}`).join("\n")
      ];

      const recommendations = [
        ...data.executionReadiness.recommendations,
        `**Readiness Insights:**\n` +
        `- Product Clarity Score: ${data.executionReadiness.productClarityScore}%\n` +
        `- Engineering Readiness Score: ${data.executionReadiness.engineeringReadinessScore}%\n` +
        `- Risk Score: ${data.executionReadiness.riskScore}%`
      ];

      const readinessCheck = {
        score,
        status: status as "ready" | "needs-clarification" | "blocked",
        blockers,
        recommendations,
        missingInfo,
      };

      const fullAnalysis: MeetingAnalysis = {
        summary: summaryMarkdown,
        decisions,
        actionItems,
        prd,
        jiraStories,
        readinessCheck,
      };

      return fullAnalysis;
    } catch (error: any) {
      // Distinguish API timeout errors specifically
      if (error.name === "APITimeoutError" || error.message?.includes("timeout") || error.message?.includes("APITimeoutError")) {
        throw new Error(`AI Analysis request timed out after ${requestTimeout / 1000}s.`);
      }

      // Rethrow general or system errors
      throw error;
    }
  }
}
