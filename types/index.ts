export interface Decision {
  id: string;
  title: string;
  description: string;
  owner: string;
  status: 'agreed' | 'proposed' | 'needs-review';
}

export interface ActionItem {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
}

export interface PRD {
  title: string;
  overview: string;
  problemStatement: string;
  userStories: string[];
  functionalRequirements: string[];
  outOfScope: string[];
}

export interface JiraStory {
  id: string;
  key: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  priority: 'high' | 'medium' | 'low';
  points: number;
}

export interface ReadinessCheck {
  score: number; // 0 to 100
  status: 'ready' | 'needs-clarification' | 'blocked';
  blockers: string[];
  recommendations: string[];
  missingInfo: string[];
}

export interface Analysis {
  id: string;
  title: string;
  createdAt: string;
  transcript: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  summary: string;
  decisions: Decision[];
  actionItems: ActionItem[];
  prd: PRD;
  jiraStories: JiraStory[];
  readinessCheck: ReadinessCheck;
}

export interface ProjectSettings {
  openaiApiKey: string;
  defaultModel: string;
  jiraIntegrationActive: boolean;
  slackNotificationsActive: boolean;
}
