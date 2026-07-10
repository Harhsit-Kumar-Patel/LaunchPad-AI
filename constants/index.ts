export const APP_NAME = "AI Product Execution Copilot";
export const APP_DESCRIPTION = "Transform your product discussions into execution-ready specs, Jira stories, and action items instantly.";

export const NAVIGATION_ITEMS = [
  { label: "Dashboard", href: "/" },
  { label: "New Analysis", href: "/new-analysis" },
  { label: "Settings", href: "/settings" }
];

export const MOCK_TRANSCRIPT_EXAMPLES = [
  {
    title: "Billing System Architecture Review",
    description: "Discussion about shifting from monthly flat rate to usage-based stripe billing.",
    transcript: `PM: Let's discuss moving to usage-based billing. Currently we charge $49/mo flat. But users want metering per API request.
Lead Architect: Moving to Stripe Metered Billing makes sense. We'll need a billing-service that listens to user-event queues, aggregates counts daily, and reports to Stripe.
Engineer: We need a grace period for billing failures, say 3 days, and webhooks to notify the client app.
PM: Sounds good. Let's decide that Stripe is our primary payment gateway, we use Stripe Metered Billing, and we'll send daily summaries of usage to users.
Designer: We also need a billing dashboard where users can see their current meter reading and estimated bill.
PM: Right, that's high priority for release. Let's aim to have this feature in production by the end of Q3.
Engineer: I will set up the Stripe webhook handler next week.`
  },
  {
    title: "Auth Migration & MFA Setup",
    description: "Aligning on moving from custom JWT cookies to Auth0 with mandatory MFA.",
    transcript: `PM: We need to improve our compliance. Enterprise clients are requesting mandatory MFA and Auth0 migration.
Security Lead: Custom JWTs are getting hard to audit. Migrating to Auth0 handles standard compliance, SSO, and MFA out of the box.
Engineer: What about existing user accounts?
PM: We should do a lazy migration. When users log in, we migrate their credential hashing or trigger a reset link, or hook Auth0 to our current database as a custom user store temporarily.
Security Lead: Yes, custom database connector in Auth0 is the safest way to avoid bulk passwords reset.
PM: Let's do that. We will configure Auth0 custom database connections, then force MFA on enterprise domains only for now.
Engineer: I'll start writing the database migration scripts.`
  }
];
