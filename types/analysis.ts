import { z } from "zod";

// Zod schemas matching frontend models

export const DecisionSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  owner: z.string(),
  status: z.enum(["agreed", "proposed", "needs-review"]),
});

export const ActionItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  assignee: z.string(),
  dueDate: z.string(),
  priority: z.enum(["high", "medium", "low"]),
  status: z.enum(["pending", "in-progress", "completed"]),
});

export const PRDSchema = z.object({
  title: z.string(),
  overview: z.string(),
  problemStatement: z.string(),
  userStories: z.array(z.string()),
  functionalRequirements: z.array(z.string()),
  outOfScope: z.array(z.string()),
  successMetrics: z.array(z.string()).optional(),
});

export const JiraStorySchema = z.object({
  id: z.string(),
  key: z.string(),
  title: z.string(),
  description: z.string(),
  acceptanceCriteria: z.array(z.string()),
  priority: z.enum(["high", "medium", "low"]),
  points: z.number(),
});

export const ExecutionReadinessSchema = z.object({
  score: z.number().min(0).max(100),
  status: z.enum(["ready", "needs-clarification", "blocked"]),
  blockers: z.array(z.string()),
  recommendations: z.array(z.string()),
  missingInfo: z.array(z.string()),
});

// Zod schema representing the highly detailed Product Manager output structure returned by OpenAI
export const AIServiceResponseSchema = z.object({
  summary: z.object({
    executiveSummary: z.string(),
    meetingObjective: z.string(),
    businessContext: z.string(),
    keyOutcomes: z.array(z.string()),
  }),
  
  keyDecisions: z.array(
    z.object({
      decision: z.string(),
      reasoning: z.string(),
      impact: z.string(),
      affectedTeams: z.array(z.string()),
      priority: z.enum(["high", "medium", "low"]),
      confidenceLevel: z.string(),
    })
  ),
  
  actionItems: z.array(
    z.object({
      task: z.string(),
      owner: z.string(),
      priority: z.enum(["high", "medium", "low"]),
      dependency: z.string(),
      suggestedDeadline: z.string(),
      status: z.enum(["pending", "in-progress", "completed"]),
    })
  ),
  
  prd: z.object({
    problemStatement: z.string(),
    background: z.string(),
    goals: z.array(z.string()),
    nonGoals: z.array(z.string()),
    targetUsers: z.array(z.string()),
    functionalRequirements: z.array(z.string()),
    nonFunctionalRequirements: z.array(z.string()),
    userStories: z.array(z.string()),
    acceptanceCriteria: z.array(z.string()),
    risks: z.array(z.string()),
    successMetrics: z.array(z.string()),
    futureScope: z.array(z.string()),
  }),
  
  jiraStories: z.array(
    z.object({
      epic: z.string(),
      title: z.string(),
      description: z.string(),
      businessValue: z.string(),
      priority: z.enum(["high", "medium", "low"]),
      storyPoints: z.number(),
      acceptanceCriteria: z.array(z.string()),
      dependencies: z.array(z.string()),
    })
  ),
  
  executionReadiness: z.object({
    overallReadinessScore: z.number().min(0).max(100),
    productClarityScore: z.number().min(0).max(100),
    engineeringReadinessScore: z.number().min(0).max(100),
    riskScore: z.number().min(0).max(100),
    missingInformation: z.array(z.string()),
    openQuestions: z.array(z.string()),
    criticalBlockers: z.array(z.string()),
    recommendations: z.array(z.string()),
  }),
});

export type AIServiceResponse = z.infer<typeof AIServiceResponseSchema>;

export const geminiResponseSchema = {
  type: "OBJECT",
  properties: {
    summary: {
      type: "OBJECT",
      properties: {
        executiveSummary: { type: "STRING" },
        meetingObjective: { type: "STRING" },
        businessContext: { type: "STRING" },
        keyOutcomes: { type: "ARRAY", items: { type: "STRING" } }
      },
      required: ["executiveSummary", "meetingObjective", "businessContext", "keyOutcomes"]
    },
    keyDecisions: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          decision: { type: "STRING" },
          reasoning: { type: "STRING" },
          impact: { type: "STRING" },
          affectedTeams: { type: "ARRAY", items: { type: "STRING" } },
          priority: { type: "STRING", enum: ["high", "medium", "low"] },
          confidenceLevel: { type: "STRING" }
        },
        required: ["decision", "reasoning", "impact", "affectedTeams", "priority", "confidenceLevel"]
      }
    },
    actionItems: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          task: { type: "STRING" },
          owner: { type: "STRING" },
          priority: { type: "STRING", enum: ["high", "medium", "low"] },
          dependency: { type: "STRING" },
          suggestedDeadline: { type: "STRING" },
          status: { type: "STRING", enum: ["pending", "in-progress", "completed"] }
        },
        required: ["task", "owner", "priority", "dependency", "suggestedDeadline", "status"]
      }
    },
    prd: {
      type: "OBJECT",
      properties: {
        problemStatement: { type: "STRING" },
        background: { type: "STRING" },
        goals: { type: "ARRAY", items: { type: "STRING" } },
        nonGoals: { type: "ARRAY", items: { type: "STRING" } },
        targetUsers: { type: "ARRAY", items: { type: "STRING" } },
        functionalRequirements: { type: "ARRAY", items: { type: "STRING" } },
        nonFunctionalRequirements: { type: "ARRAY", items: { type: "STRING" } },
        userStories: { type: "ARRAY", items: { type: "STRING" } },
        acceptanceCriteria: { type: "ARRAY", items: { type: "STRING" } },
        risks: { type: "ARRAY", items: { type: "STRING" } },
        successMetrics: { type: "ARRAY", items: { type: "STRING" } },
        futureScope: { type: "ARRAY", items: { type: "STRING" } }
      },
      required: [
        "problemStatement", "background", "goals", "nonGoals", "targetUsers",
        "functionalRequirements", "nonFunctionalRequirements", "userStories",
        "acceptanceCriteria", "risks", "successMetrics", "futureScope"
      ]
    },
    jiraStories: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          epic: { type: "STRING" },
          title: { type: "STRING" },
          description: { type: "STRING" },
          businessValue: { type: "STRING" },
          priority: { type: "STRING", enum: ["high", "medium", "low"] },
          storyPoints: { type: "INTEGER" },
          acceptanceCriteria: { type: "ARRAY", items: { type: "STRING" } },
          dependencies: { type: "ARRAY", items: { type: "STRING" } }
        },
        required: ["epic", "title", "description", "businessValue", "priority", "storyPoints", "acceptanceCriteria", "dependencies"]
      }
    },
    executionReadiness: {
      type: "OBJECT",
      properties: {
        overallReadinessScore: { type: "INTEGER" },
        productClarityScore: { type: "INTEGER" },
        engineeringReadinessScore: { type: "INTEGER" },
        riskScore: { type: "INTEGER" },
        missingInformation: { type: "ARRAY", items: { type: "STRING" } },
        openQuestions: { type: "ARRAY", items: { type: "STRING" } },
        criticalBlockers: { type: "ARRAY", items: { type: "STRING" } },
        recommendations: { type: "ARRAY", items: { type: "STRING" } }
      },
      required: [
        "overallReadinessScore", "productClarityScore", "engineeringReadinessScore", "riskScore",
        "missingInformation", "openQuestions", "criticalBlockers", "recommendations"
      ]
    }
  },
  required: ["summary", "keyDecisions", "actionItems", "prd", "jiraStories", "executionReadiness"]
};

export const MeetingAnalysisSchema = z.object({
  summary: z.string(),
  decisions: z.array(DecisionSchema),
  actionItems: z.array(ActionItemSchema),
  prd: PRDSchema,
  jiraStories: z.array(JiraStorySchema),
  readinessCheck: ExecutionReadinessSchema,
});

// Infer TypeScript interfaces from Zod schemas
export type Decision = z.infer<typeof DecisionSchema>;
export type ActionItem = z.infer<typeof ActionItemSchema>;
export type PRD = z.infer<typeof PRDSchema>;
export type JiraStory = z.infer<typeof JiraStorySchema>;
export type ExecutionReadiness = z.infer<typeof ExecutionReadinessSchema>;
export type MeetingAnalysis = z.infer<typeof MeetingAnalysisSchema>;

// Additional API communication types
export const AnalyzeRequestSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  transcript: z.string().min(1, "Transcript content is required"),
});

export type AnalyzeRequest = z.infer<typeof AnalyzeRequestSchema>;
