export type TrendDirection = "up" | "down" | "flat";

export type PersonStatus = "Active" | "On leave" | "Open role";
export type AgentStatus = "Active" | "Paused" | "Error";
export type TaskStatus = "Done" | "In progress" | "Delayed" | "Queued";

export type Person = {
  name: string;
  role: string;
  level: string;
  monthlyCost: string;
  assignedAgents: number;
  status: PersonStatus;
};

export type Agent = {
  name: string;
  role: string;
  model: string;
  status: AgentStatus;
  monthlyTokenCost: string;
  successRate: number;
  uptime: number;
  replaces: string;
  launched: string;
};

export type DepartmentTask = {
  name: string;
  assignee: string;
  mode: "Human-only" | "Agent-only" | "Hybrid";
  status: TaskStatus;
  sla: string;
  cost: string;
  portable: boolean;
};

export type Department = {
  name: string;
  description: string;
  manager: string;
  managerRole: string;
  people: number;
  agentsCount: number;
  openRoles: number;
  monthlyCost: string;
  budget: string;
  budgetUse: number;
  health: number;
  automationFit: number;
  risk: string;
  status: string;
  accent: string;
  soft: string;
  transformationScore: number;
  transformationTrend: TrendDirection;
  transformationTrendLabel: string;
  transformationSparkline: number[];
  tokenSpend: string;
  agentHealth: number;
  recommendation: string;
  periodSummary: {
    totalCost: string;
    change: string;
    trend: TrendDirection;
  };
  taskDistribution: {
    human: number;
    agent: number;
    hybrid: number;
  };
  tokenUsage: {
    input: string;
    output: string;
    cost: string;
    budgetUsed: number;
    avgTaskCost: string;
    series30: number[];
    agentBars: { name: string; value: number; cost: string }[];
  };
  budgetBreakdown: {
    human: number;
    agentToken: number;
    dev: number;
    consulting: number;
    blended: string;
    change: string;
  };
  peopleList: Person[];
  agents: Agent[];
  tasks: DepartmentTask[];
  actions: string[];
};

export const departments: Department[] = [
  {
    name: "Engineering",
    description: "Product delivery, platform, integrations, and internal tooling.",
    manager: "Mert Demir",
    managerRole: "VP Product",
    people: 61,
    agentsCount: 16,
    openRoles: 4,
    monthlyCost: "TRY 1.84M",
    budget: "TRY 1.75M",
    budgetUse: 105,
    health: 82,
    automationFit: 48,
    risk: "Budget overrun",
    status: "Needs review",
    accent: "bg-sky-500",
    soft: "bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
    transformationScore: 54,
    transformationTrend: "up",
    transformationTrendLabel: "+7% vs last month",
    transformationSparkline: [24, 30, 34, 38, 43, 48, 54],
    tokenSpend: "TRY 286K",
    agentHealth: 94,
    recommendation: "2 roles can move to agents",
    periodSummary: { totalCost: "TRY 2.21M", change: "+5.8%", trend: "up" },
    taskDistribution: { human: 48, agent: 31, hybrid: 21 },
    tokenUsage: {
      input: "28.4M",
      output: "11.2M",
      cost: "TRY 286K",
      budgetUsed: 72,
      avgTaskCost: "TRY 41.20",
      series30: [22, 26, 30, 28, 36, 42, 39, 48, 52, 57, 61, 68],
      agentBars: [
        { name: "QA Agent", value: 82, cost: "TRY 92K" },
        { name: "Release Agent", value: 64, cost: "TRY 71K" },
        { name: "Research Agent", value: 48, cost: "TRY 53K" },
      ],
    },
    budgetBreakdown: { human: 69, agentToken: 13, dev: 12, consulting: 6, blended: "TRY 2.21M", change: "+5.8%" },
    peopleList: [
      {
        name: "Mert Demir",
        role: "Engineering Lead",
        level: "L6",
        monthlyCost: "TRY 168K",
        assignedAgents: 4,
        status: "Active",
      },
      {
        name: "Ayse Polat",
        role: "Senior Engineer",
        level: "L5",
        monthlyCost: "TRY 126K",
        assignedAgents: 2,
        status: "Active",
      },
      {
        name: "Open QA Lead",
        role: "QA Lead",
        level: "L4",
        monthlyCost: "TRY 92K",
        assignedAgents: 1,
        status: "Open role",
      },
    ],
    agents: [
      {
        name: "QA Agent",
        role: "Regression triage",
        model: "GPT-4.1",
        status: "Active",
        monthlyTokenCost: "TRY 92K",
        successRate: 96,
        uptime: 99,
        replaces: "Open QA Lead support",
        launched: "May 12, 2026",
      },
      {
        name: "Release Agent",
        role: "Release notes",
        model: "Claude",
        status: "Active",
        monthlyTokenCost: "TRY 71K",
        successRate: 91,
        uptime: 98,
        replaces: "Senior Engineer assistant",
        launched: "June 04, 2026",
      },
      {
        name: "Research Agent",
        role: "Technical discovery",
        model: "GPT-4.1 mini",
        status: "Paused",
        monthlyTokenCost: "TRY 53K",
        successRate: 87,
        uptime: 94,
        replaces: "Research support",
        launched: "April 18, 2026",
      },
    ],
    tasks: [
      {
        name: "Regression triage",
        assignee: "QA Agent",
        mode: "Agent-only",
        status: "Done",
        sla: "On time",
        cost: "TRY 12K",
        portable: false,
      },
      {
        name: "Integration review",
        assignee: "Ayse Polat + Release Agent",
        mode: "Hybrid",
        status: "In progress",
        sla: "2h left",
        cost: "TRY 18K",
        portable: false,
      },
      {
        name: "Bug report routing",
        assignee: "Open QA Lead",
        mode: "Human-only",
        status: "Delayed",
        sla: "Late",
        cost: "TRY 9K",
        portable: true,
      },
    ],
    actions: ["Create QA automation scenario", "Review token budget", "Open senior platform role"],
  },
  {
    name: "Operations",
    description: "Back-office workflows, procurement, facilities, and process automation.",
    manager: "Deniz Koc",
    managerRole: "Operations Lead",
    people: 34,
    agentsCount: 11,
    openRoles: 2,
    monthlyCost: "TRY 740K",
    budget: "TRY 820K",
    budgetUse: 90,
    health: 76,
    automationFit: 71,
    risk: "Agent dependency",
    status: "Healthy",
    accent: "bg-teal-500",
    soft: "bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300",
    transformationScore: 68,
    transformationTrend: "up",
    transformationTrendLabel: "+12% vs last month",
    transformationSparkline: [36, 42, 44, 49, 56, 62, 68],
    tokenSpend: "TRY 154K",
    agentHealth: 91,
    recommendation: "Vendor intake can be agent-led",
    periodSummary: { totalCost: "TRY 934K", change: "-3.4%", trend: "down" },
    taskDistribution: { human: 34, agent: 42, hybrid: 24 },
    tokenUsage: {
      input: "19.1M",
      output: "7.8M",
      cost: "TRY 154K",
      budgetUsed: 61,
      avgTaskCost: "TRY 24.80",
      series30: [18, 24, 27, 32, 38, 36, 43, 47, 49, 54, 58, 60],
      agentBars: [
        { name: "Procurement Agent", value: 74, cost: "TRY 65K" },
        { name: "SLA Agent", value: 45, cost: "TRY 41K" },
        { name: "Vendor Agent", value: 38, cost: "TRY 33K" },
      ],
    },
    budgetBreakdown: { human: 72, agentToken: 16, dev: 8, consulting: 4, blended: "TRY 934K", change: "-3.4%" },
    peopleList: [
      {
        name: "Deniz Koc",
        role: "Operations Lead",
        level: "L5",
        monthlyCost: "TRY 118K",
        assignedAgents: 3,
        status: "Active",
      },
      {
        name: "Selim Baran",
        role: "Procurement Manager",
        level: "L4",
        monthlyCost: "TRY 86K",
        assignedAgents: 2,
        status: "Active",
      },
      {
        name: "Vendor Coordinator",
        role: "Coordinator",
        level: "L3",
        monthlyCost: "TRY 54K",
        assignedAgents: 1,
        status: "On leave",
      },
    ],
    agents: [
      {
        name: "Procurement Agent",
        role: "PO drafting",
        model: "GPT-4.1 mini",
        status: "Active",
        monthlyTokenCost: "TRY 65K",
        successRate: 93,
        uptime: 98,
        replaces: "Procurement assistant",
        launched: "March 21, 2026",
      },
      {
        name: "SLA Agent",
        role: "Deadline alerts",
        model: "Rules + LLM",
        status: "Active",
        monthlyTokenCost: "TRY 41K",
        successRate: 89,
        uptime: 97,
        replaces: "Operations coordinator",
        launched: "May 02, 2026",
      },
      {
        name: "Vendor Agent",
        role: "Vendor intake",
        model: "GPT-4.1",
        status: "Error",
        monthlyTokenCost: "TRY 33K",
        successRate: 74,
        uptime: 86,
        replaces: "Vendor desk support",
        launched: "June 12, 2026",
      },
    ],
    tasks: [
      {
        name: "Purchase order draft",
        assignee: "Procurement Agent",
        mode: "Agent-only",
        status: "Done",
        sla: "On time",
        cost: "TRY 6K",
        portable: false,
      },
      {
        name: "Vendor onboarding",
        assignee: "Vendor Agent + Selim",
        mode: "Hybrid",
        status: "Delayed",
        sla: "Late",
        cost: "TRY 11K",
        portable: true,
      },
      {
        name: "Facilities request",
        assignee: "Operations team",
        mode: "Human-only",
        status: "Queued",
        sla: "1d left",
        cost: "TRY 4K",
        portable: true,
      },
    ],
    actions: ["Fix vendor agent errors", "Move facilities intake to agent", "Create SLA alert policy"],
  },
  {
    name: "Marketing",
    description: "Content, growth, lifecycle campaigns, and market research.",
    manager: "Selin Ak",
    managerRole: "Growth Director",
    people: 22,
    agentsCount: 4,
    openRoles: 3,
    monthlyCost: "TRY 510K",
    budget: "TRY 480K",
    budgetUse: 106,
    health: 68,
    automationFit: 79,
    risk: "High replacement opportunity",
    status: "Actionable",
    accent: "bg-violet-500",
    soft: "bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
    transformationScore: 73,
    transformationTrend: "up",
    transformationTrendLabel: "+15% vs last month",
    transformationSparkline: [28, 38, 44, 51, 58, 66, 73],
    tokenSpend: "TRY 118K",
    agentHealth: 88,
    recommendation: "2 content roles can move to agents",
    periodSummary: { totalCost: "TRY 682K", change: "+8.1%", trend: "up" },
    taskDistribution: { human: 29, agent: 46, hybrid: 25 },
    tokenUsage: {
      input: "15.5M",
      output: "9.4M",
      cost: "TRY 118K",
      budgetUsed: 81,
      avgTaskCost: "TRY 18.60",
      series30: [20, 28, 34, 45, 49, 53, 59, 64, 67, 73, 77, 82],
      agentBars: [
        { name: "Content Agent", value: 88, cost: "TRY 58K" },
        { name: "Research Agent", value: 52, cost: "TRY 36K" },
        { name: "Campaign Agent", value: 34, cost: "TRY 24K" },
      ],
    },
    budgetBreakdown: { human: 64, agentToken: 17, dev: 7, consulting: 12, blended: "TRY 682K", change: "+8.1%" },
    peopleList: [
      {
        name: "Selin Ak",
        role: "Growth Director",
        level: "L5",
        monthlyCost: "TRY 112K",
        assignedAgents: 2,
        status: "Active",
      },
      {
        name: "Campaign Analyst",
        role: "Analyst",
        level: "L3",
        monthlyCost: "TRY 58K",
        assignedAgents: 1,
        status: "Active",
      },
      {
        name: "Open Writer",
        role: "Content Writer",
        level: "L3",
        monthlyCost: "TRY 49K",
        assignedAgents: 1,
        status: "Open role",
      },
    ],
    agents: [
      {
        name: "Content Agent",
        role: "Draft production",
        model: "GPT-4.1",
        status: "Active",
        monthlyTokenCost: "TRY 58K",
        successRate: 90,
        uptime: 96,
        replaces: "Open Writer draft work",
        launched: "April 26, 2026",
      },
      {
        name: "Research Agent",
        role: "Market summaries",
        model: "Claude",
        status: "Active",
        monthlyTokenCost: "TRY 36K",
        successRate: 86,
        uptime: 95,
        replaces: "Campaign analyst assistant",
        launched: "May 18, 2026",
      },
      {
        name: "Campaign Agent",
        role: "Lifecycle variants",
        model: "GPT-4.1 mini",
        status: "Paused",
        monthlyTokenCost: "TRY 24K",
        successRate: 82,
        uptime: 91,
        replaces: "Lifecycle support",
        launched: "June 08, 2026",
      },
    ],
    tasks: [
      {
        name: "Blog first draft",
        assignee: "Content Agent",
        mode: "Agent-only",
        status: "Done",
        sla: "On time",
        cost: "TRY 5K",
        portable: false,
      },
      {
        name: "Campaign analysis",
        assignee: "Campaign Analyst + Research Agent",
        mode: "Hybrid",
        status: "In progress",
        sla: "4h left",
        cost: "TRY 8K",
        portable: false,
      },
      {
        name: "Landing page copy",
        assignee: "Open Writer",
        mode: "Human-only",
        status: "Queued",
        sla: "2d left",
        cost: "TRY 6K",
        portable: true,
      },
    ],
    actions: ["Create content-agent scenario", "Review writer opening", "Tune campaign agent prompts"],
  },
];

export const departmentTotals = {
  people: departments.reduce((sum, item) => sum + item.people, 0),
  agents: departments.reduce((sum, item) => sum + item.agentsCount, 0),
  openRoles: departments.reduce((sum, item) => sum + item.openRoles, 0),
  averageHealth: Math.round(departments.reduce((sum, item) => sum + item.health, 0) / departments.length),
};
