// All copy and data for the site lives here. Anything in [brackets] is a
// placeholder to replace with real details.

export const site = {
  name: "Albert Labarento",
  initials: "AL",
  role: "Full-stack engineer · Automation & AI",
  email: "albertlabarentodev@gmail.com",
  github: "https://github.com/albertlabarentodev",
  linkedin: "#",
  bookingUrl: "#",
  resumeUrl: "#",
  availability: "[Open to freelance & full-time]",
};

export const stack = [
  "Laravel",
  "Vue 3 · Nuxt",
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind",
  "n8n",
  "Claude API",
  "Claude Code",
  "MCP",
  "Figma",
  "Postgres",
  "Redis",
];

export type Project = {
  slug: string;
  title: string;
  kicker: string;
  summary: string;
  image: string;
  imageAlt: string;
  metric: string;
  metricLabel: string;
  role: string;
  client: string;
  timeline: string;
  stack: string;
  problem: string;
  context: string;
  steps: { label: string; text: string }[];
  code?: { file: string; body: string };
  design: string;
  result: string;
};

export const projects: Project[] = [
  {
    slug: "lead-intake",
    title: "Lead intake on autopilot",
    kicker: "Automation · AI · Laravel + n8n + Claude",
    summary:
      "Website leads were copied from a shared inbox into the CRM by hand. Now each one is classified, scored and routed in seconds.",
    image: "/images/lead-intake.png",
    imageAlt:
      "Workflow editor: a website form feeds a Claude classify-and-score step, which creates a HubSpot deal and notifies Slack",
    metric: "[X hrs/week]",
    metricLabel: "manual entry removed",
    role: "Design, build, automation",
    client: "[Client / industry]",
    timeline: "[N weeks]",
    stack: "Laravel · Vue · n8n · Claude",
    problem:
      "[One sentence on the pain: e.g. every lead landed in a shared inbox and someone copied it into the CRM by hand.]",
    context: "[Two or three sentences of context: who was affected, what it cost, why it mattered now.]",
    steps: [
      {
        label: "Laravel",
        text: "Validates the form, stores the lead and dispatches a queued job, so the site never waits on outside APIs.",
      },
      {
        label: "n8n",
        text: "Enriches the company, calls Claude, then branches to the CRM and Slack, with retries on every step.",
      },
      {
        label: "Claude",
        text: "Returns strict JSON (intent, size, score, route, summary) checked against a schema before anything is written.",
      },
    ],
    code: {
      file: "app/Jobs/RouteLead.php",
      body: `public function handle(N8n $n8n): void
{
    $n8n->trigger('lead-intake', [
        'lead_id' => $this->lead->id,
        'email'   => $this->lead->email,
        'message' => $this->lead->message,
    ]);
}`,
    },
    design: "[How the Figma design became the Vue screens, and what changed after real users touched it.]",
    result: "[The outcome in plain words, plus one thing you would do differently next time.]",
  },
  {
    slug: "ops-dashboard",
    title: "Client operations dashboard",
    kicker: "Full-stack · Laravel + Inertia + Vue 3",
    summary:
      "One screen for clients, invoices, queues and integrations. Designed in Figma, shipped with role-based access and Horizon monitoring.",
    image: "/images/ops-dashboard.png",
    imageAlt:
      "Operations dashboard: KPI tiles, a 14-day throughput chart, queue status bars and a client sync table",
    metric: "[N users]",
    metricLabel: "using it daily",
    role: "Product design, full-stack build",
    client: "[Client / industry]",
    timeline: "[N weeks]",
    stack: "Laravel · Inertia · Vue 3 · Horizon",
    problem: "[One sentence on the pain.]",
    context: "[Two or three sentences of context.]",
    steps: [
      { label: "Laravel", text: "[Backend: models, policies, queues.]" },
      { label: "Inertia + Vue", text: "[Front end: screens, components, state.]" },
      { label: "Integrations", text: "[Stripe, HubSpot, Xero, Google Sheets syncs.]" },
    ],
    design: "[Design notes.]",
    result: "[Outcome.]",
  },
  {
    slug: "marketing-site",
    title: "Marketing site with Figma-synced tokens",
    kicker: "Front end · Next.js + Tailwind + Figma",
    summary:
      "App Router, static where it can be, with design tokens exported from Figma variables, so design and code stop drifting apart.",
    image: "/images/marketing-site.png",
    imageAlt:
      "A light marketing site in a browser window, overlapped by a Tailwind config file synced from Figma",
    metric: "[Score / load time]",
    metricLabel: "measured in production",
    role: "Design system, front-end build",
    client: "[Client / industry]",
    timeline: "[N weeks]",
    stack: "Next.js · Tailwind · Figma",
    problem: "[One sentence on the pain.]",
    context: "[Two or three sentences of context.]",
    steps: [
      { label: "Figma", text: "[Variables and components as the source of truth.]" },
      { label: "Token script", text: "[Exports variables to Tailwind theme values.]" },
      { label: "Next.js", text: "[Static pages, image optimisation, CMS previews.]" },
    ],
    design: "[Design notes.]",
    result: "[Outcome.]",
  },
];

export const lab = [
  { tag: "n8n · Workflow JSON", title: "Invoice inbox to Sheets to Slack", text: "Parses PDF invoices from Gmail and posts a daily summary.", href: "#" },
  { tag: "Claude · MCP server", title: "Let Claude query a Laravel app", text: "Read-only tools for orders and customers, with scoped tokens.", href: "#" },
  { tag: "Figma · Script", title: "Figma variables to Tailwind", text: "One command keeps design tokens and code in sync.", href: "#" },
  { tag: "Claude Code · CI", title: "PR reviewer with house rules", text: "A CI step that checks Laravel pull requests against a style guide.", href: "#" },
  { tag: "RAG · pgvector", title: "Docs Q&A with sources", text: "Ask questions over company docs; every answer cites its page.", href: "#" },
  { tag: "Webhooks · Laravel", title: "Stripe to CRM, idempotent", text: "Retries, dedupe keys and a replay log for every event.", href: "#" },
];

export const experience = [
  { dates: "[2023 — Now]", title: "[Senior Full-stack Engineer] · [Company]", text: "[What you owned and what changed, in one line.]", tags: "Laravel · Vue · n8n" },
  { dates: "[2021 — 2023]", title: "[Full-stack Developer] · [Company]", text: "[What you built and who used it.]", tags: "React · Next.js · Tailwind" },
  { dates: "[2019 — 2021]", title: "[Web Developer] · [Company / Freelance]", text: "[Client sites, first integrations, first APIs.]", tags: "JavaScript · Figma" },
];

export const notes = [
  { title: "Connecting Laravel queues to n8n without losing jobs", date: "[Date]", href: "#" },
  { title: "My first MCP server, step by step", date: "[Date]", href: "#" },
  { title: "Figma to Tailwind without the drift", date: "[Date]", href: "#" },
];

export const uses = [
  { group: "Editor & terminal", items: ["[Editor]", "[Terminal]", "Claude Code"] },
  { group: "Automation", items: ["n8n (self-hosted)", "[Zapier / Make]"] },
  { group: "Hosting", items: ["Laravel Forge", "Vercel"] },
  { group: "Design", items: ["Figma", "[Favourite plugins]"] },
];

// Canned answers used when ANTHROPIC_API_KEY is not set, and as suggested questions.
export const faq = [
  {
    q: "What do you build?",
    a: "Full-stack products: Laravel on the backend, Vue, React or Next.js on the front end. Then I automate the work around them with n8n and Claude, so data moves without anyone copying it.",
  },
  {
    q: "Can you integrate my tools?",
    a: "Yes. CRMs, Stripe, Google Workspace, Slack, webhooks and custom APIs. I usually start by mapping where data is still moved by hand, then fix the most expensive step first.",
  },
  {
    q: "How do you use AI?",
    a: "Two ways. Claude Code speeds up how I build and review. Inside products, I use the Claude API and MCP servers for triage, extraction, summaries and agents that call your own systems with scoped access.",
  },
  {
    q: "Are you available?",
    a: "[Your current availability, e.g. open to freelance projects and full-time roles from a given month.]",
  },
];

// The assistant only answers from this text. Keep it factual and up to date.
export function assistantContext(): string {
  const lines = [
    `Name: ${site.name}`,
    `Role: ${site.role}`,
    `Availability: ${site.availability}`,
    `Contact: ${site.email}`,
    `Stack: ${stack.join(", ")}`,
    "",
    "Experience:",
    ...experience.map((e) => `- ${e.dates} ${e.title}: ${e.text} (${e.tags})`),
    "",
    "Projects:",
    ...projects.map((p) => `- ${p.title} (${p.stack}): ${p.summary} Result: ${p.metric} ${p.metricLabel}.`),
    "",
    "Automation Lab:",
    ...lab.map((l) => `- ${l.title} (${l.tag}): ${l.text}`),
    "",
    "Common answers:",
    ...faq.map((f) => `Q: ${f.q}\nA: ${f.a}`),
  ];
  return lines.join("\n");
}
