import { Analysis } from "../types";

export const MOCK_ANALYSES: Record<string, Analysis> = {
  "billing-review": {
    id: "billing-review",
    title: "Billing System Architecture Review",
    createdAt: new Date().toISOString(),
    transcript: `PM: Let's discuss moving to usage-based billing. Currently we charge $49/mo flat. But users want metering per API request.
Lead Architect: Moving to Stripe Metered Billing makes sense. We'll need a billing-service that listens to user-event queues, aggregates counts daily, and reports to Stripe.
Engineer: We need a grace period for billing failures, say 3 days, and webhooks to notify the client app.
PM: Sounds good. Let's decide that Stripe is our primary payment gateway, we use Stripe Metered Billing, and we'll send daily summaries of usage to users.
Designer: We also need a billing dashboard where users can see their current meter reading and estimated bill.
PM: Right, that's high priority for release. Let's aim to have this feature in production by the end of Q3.
Engineer: I will set up the Stripe webhook handler next week.`,
    status: "completed",
    summary: `The product team aligned on migrating the application pricing model from a flat $49/month rate to a dynamic, usage-based metered billing model powered by **Stripe**. 

The transition requires building a metering service to process API events, aggregating counts daily, and securely transmitting usage metrics to Stripe. A user-facing dashboard will show real-time consumption and dynamic billing estimates. The transition is scheduled to target release by the end of Q3.`,
    decisions: [
      {
        id: "dec-1",
        title: "Stripe as Primary Payment Gateway",
        description: "Standardize all payment processing and metered billing subscriptions on Stripe.",
        owner: "Product Manager",
        status: "agreed"
      },
      {
        id: "dec-2",
        title: "Daily Aggregated Usage Syncs",
        description: "Aggregate system API request events daily in our billing-service, rather than real-time syncing, to prevent hitting Stripe API rate limits.",
        owner: "Lead Architect",
        status: "agreed"
      },
      {
        id: "dec-3",
        title: "3-Day Subscription Grace Period",
        description: "Implement a 3-day grace period on billing payment failures before restricting user API access, during which email alerts are triggered.",
        owner: "Engineering Lead",
        status: "proposed"
      }
    ],
    actionItems: [
      {
        id: "act-1",
        title: "Implement Stripe Webhook Handler Endpoint",
        assignee: "Backend Engineer",
        dueDate: "2026-07-16T17:00:00.000Z",
        priority: "high",
        status: "in-progress"
      },
      {
        id: "act-2",
        title: "Design Billing Dashboard Interface",
        assignee: "UI/UX Designer",
        dueDate: "2026-07-20T17:00:00.000Z",
        priority: "medium",
        status: "pending"
      },
      {
        id: "act-3",
        title: "Write billing-service event ingestion queue consumer",
        assignee: "Lead Architect",
        dueDate: "2026-07-25T17:00:00.000Z",
        priority: "high",
        status: "pending"
      }
    ],
    prd: {
      title: "Usage-Based Metered Billing Integration",
      overview: "Transition the product billing system from flat monthly plans to metered, consumption-based pricing ($0.01 per API request processed) to align cost directly with product usage.",
      problemStatement: "Heavy API consumers consume vast resources for a flat fee of $49/mo, while low-use trial users are deterred by high upfront monthly prices. We must align pricing with actual user metrics.",
      userStories: [
        "As a developer, I want to pay only for the exact volume of API requests my team processes.",
        "As a finance manager, I want to see our live billing dashboard to monitor usage trends and estimate month-end invoices.",
        "As an administrator, I want to receive webhook alerts if my credit card fails billing, with a grace period to update details."
      ],
      functionalRequirements: [
        "Hourly background job aggregating event logs into customer billing records.",
        "Stripe customer portal integration using secure single-use redirect URLs.",
        "Webhooks capturing 'invoice.payment_failed' and initiating the grace-period state-machine.",
        "Interactive analytics charts tracking API request counts on user profile pages."
      ],
      outOfScope: [
        "Supporting multiple alternative billing engines (e.g. Chargebee, Paddle). Stripe is the sole provider.",
        "Custom, client-specific enterprise contract billing overrides inside the self-service web app."
      ]
    },
    jiraStories: [
      {
        id: "jira-1",
        key: "COP-410",
        title: "Stripe Webhook API Route & Security Validation",
        description: "Create a route `/api/webhooks/stripe` to consume incoming payment events. Implement signature validation using Stripe endpoint secrets. Parse payment failures and updates to configure grace periods.",
        acceptanceCriteria: [
          "Endpoint validates webhook signatures and rejects unsigned payloads with a 401.",
          "Handles invoice.payment_failed by writing current grace period timestamps to DB.",
          "Handles invoice.payment_succeeded by clearing restrictions and active warnings.",
          "Includes automated payload integration tests."
        ],
        priority: "high",
        points: 3
      },
      {
        id: "jira-2",
        key: "COP-411",
        title: "Develop Aggregation Engine for API Event Queue",
        description: "Implement a consumer service that subscribes to the API logs stream. Write aggregated daily events counts per tenant/account, ready for Stripe reporting.",
        acceptanceCriteria: [
          "Accurately counts message payloads inside rabbitMQ/Kafka queues.",
          "Creates daily database snapshots summarizing API transactions.",
          "Gracefully recovers counts from network failures using atomic operations."
        ],
        priority: "high",
        points: 5
      },
      {
        id: "jira-3",
        key: "COP-412",
        title: "Front-end Billing Metering Dashboard",
        description: "Add a new page `/settings/billing` displaying current billing cycle request counts, dollar projections, and high-water limits.",
        acceptanceCriteria: [
          "Displays bar chart matching standard dark theme gradients.",
          "Loads active values inside of a skeleton loader state.",
          "Direct button link to launch stripe self-service billing portal."
        ],
        priority: "medium",
        points: 2
      }
    ],
    readinessCheck: {
      score: 85,
      status: "ready",
      blockers: [],
      recommendations: [
        "Add alert systems in case RabbitMQ queues back up, leading to stale billing charts.",
        "Define concrete limits for Stripe webhook timeouts to prevent connection exhaustion under heavy load."
      ],
      missingInfo: [
        "Need clarification on exact billing threshold limit configs per client tier."
      ]
    }
  }
};

export const getAnalysisById = async (id: string): Promise<Analysis | null> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return MOCK_ANALYSES[id] || null;
};

export const createAnalysis = async (title: string, transcript: string): Promise<Analysis> => {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  // Calculate readiness score
  const hasDecisions = transcript.includes("decide") || transcript.includes("decided");
  const score = 50 + (hasDecisions ? 25 : 0) + Math.floor(Math.random() * 25);
  
  const id = `analysis-${Date.now()}`;
  const newAnalysis: Analysis = {
    id,
    title: title || "Untitled Analysis",
    createdAt: new Date().toISOString(),
    transcript,
    status: "completed",
    summary: `This is a generated summary for: **${title}**.\n\nThe discussion centered around key infrastructure developments and project delivery goals. Based on transcripts, the team discussed next steps, timelines, and action assignments to reach launch objectives.`,
    decisions: [
      {
        id: `dec-${Date.now()}-1`,
        title: "Standardize System Workflows",
        description: "Align system modules to leverage modern REST frameworks and secure key stores.",
        owner: "Product Owner",
        status: "agreed"
      },
      {
        id: `dec-${Date.now()}-2`,
        title: "Implement Phased Security Audits",
        description: "Perform penetration testing steps across the microservices prior to public launch.",
        owner: "Security Lead",
        status: "needs-review"
      }
    ],
    actionItems: [
      {
        id: `act-${Date.now()}-1`,
        title: "Draft Technical Design Document",
        assignee: "Lead Architect",
        dueDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
        priority: "high",
        status: "pending"
      },
      {
        id: `act-${Date.now()}-2`,
        title: "Configure Mock API Pipeline Interfaces",
        assignee: "Frontend Developer",
        dueDate: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString(),
        priority: "medium",
        status: "pending"
      }
    ],
    prd: {
      title: `${title || "Product"} PRD Spec`,
      overview: "Standard product requirements detailing the implementation guidelines, milestones, and deliverables agreed upon during the team alignment discussion.",
      problemStatement: "The current project setup lacks structured execution components, requiring consolidation of meeting concepts into standard product specifications.",
      userStories: [
        "As a user, I want to access features quickly and securely.",
        "As an engineer, I want clean specs to streamline development."
      ],
      functionalRequirements: [
        "The system shall display structured analysis details on a responsive dashboard.",
        "User navigation must load fast with lazy-loaded modules."
      ],
      outOfScope: [
        "Integration of secondary webhooks or external chat servers for initial phase deployment."
      ]
    },
    jiraStories: [
      {
        id: `jira-${Date.now()}-1`,
        key: "COP-101",
        title: "Scaffold Core Repository Modules",
        description: "Set up baseline directory architecture, configurations, and core interfaces for module communication.",
        acceptanceCriteria: [
          "Successfully compiling codebase in Next.js environment.",
          "Tests verified with unit execution suites."
        ],
        priority: "high",
        points: 3
      },
      {
        id: `jira-${Date.now()}-2`,
        key: "COP-102",
        title: "Construct User Preference Layouts",
        description: "Create local settings hooks and simple storage controls for application configuration toggles.",
        acceptanceCriteria: [
          "Visual styling conforms to typography dark theme guide.",
          "Saves variables to application local storage layers."
        ],
        priority: "medium",
        points: 2
      }
    ],
    readinessCheck: {
      score,
      status: score >= 80 ? "ready" : score >= 50 ? "needs-clarification" : "blocked",
      blockers: score < 50 ? ["Critical structural alignment details missing in initial transcripts."] : [],
      recommendations: [
        "Outline standard schema requirements inside metadata tables.",
        "Coordinate secondary alignment sync to lock in assignee dates."
      ],
      missingInfo: [
        "Definitive target timeline for integration testing phase."
      ]
    }
  };
  
  MOCK_ANALYSES[id] = newAnalysis;
  return newAnalysis;
};

export const getHistory = async (): Promise<Analysis[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return Object.values(MOCK_ANALYSES).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};
