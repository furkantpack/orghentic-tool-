"use client";

import { type ReactNode, useMemo, useState } from "react";

import {
  AlertTriangle,
  Bot,
  Check,
  CheckCircle2,
  ExternalLink,
  FileText,
  Link2,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

type AgentType = "Internal" | "External";
type Agent = {
  id: string;
  name: string;
  type: AgentType;
  source: string;
  description: string;
  longDescription: string;
  capabilities: string[];
  matchScore: number;
  pricingModel: "Token-based" | "Fixed" | "Subscription" | "Shared pool";
  price: string;
  activeIn: string[];
  usageHistory: string[];
  access: string[];
};

type RequestStatus = "Pending" | "Reviewing" | "Approved" | "Rejected";
type AgentRequest = {
  id: string;
  rawText: string;
  requestedBy: string;
  department: string;
  date: string;
  matchStatus: string;
  status: RequestStatus;
  matchedAgents: string[];
  approvalChain: string[];
  activity: string[];
};

type Connection = {
  name: string;
  tasks: string[];
  url: string;
  active: boolean;
  lastRun: string;
  history: string[];
  metrics: {
    monthlyTokenCost: string;
    successRate: string;
    errorSummary: string;
  };
  logs: string[][];
};

const agents: Agent[] = [
  {
    id: "invoice-matcher",
    name: "Invoice Matching Agent",
    type: "Internal",
    source: "Built by Finance Automation",
    description: "Matches invoices to purchase orders and flags exception cases for human review.",
    longDescription:
      "A finance-owned agent that reads invoice metadata, compares it with purchase orders, and routes only exceptions to human approvers.",
    capabilities: ["Invoice matching", "PO validation", "ERP lookup", "Exception routing", "Budget policy"],
    matchScore: 86,
    pricingModel: "Shared pool",
    price: "Already active in: Finance, Operations",
    activeIn: ["Finance", "Operations"],
    usageHistory: ["Finance close - active for 4 months", "Operations procurement - active for 2 months"],
    access: ["Finance ERP - read/write", "Vendor inbox - read only", "Budget rules - read only"],
  },
  {
    id: "support-triage",
    name: "Support Triage Agent",
    type: "Internal",
    source: "n8n workspace",
    description: "Classifies tickets, extracts intent, and routes support items to the right queue.",
    longDescription:
      "An internal routing agent that turns inbound support text into structured intent and priority signals.",
    capabilities: ["Ticket classification", "Intent extraction", "SLA routing", "Knowledge base lookup"],
    matchScore: 78,
    pricingModel: "Shared pool",
    price: "Already active in: Support",
    activeIn: ["Support"],
    usageHistory: ["Support intake - active for 6 months"],
    access: ["Support inbox - read only", "Help center - read only", "Ticket queue - write"],
  },
  {
    id: "vendor-intake",
    name: "Vendor Intake Agent",
    type: "External",
    source: "Gumloop",
    description: "Collects vendor details, runs compliance checks, and prepares onboarding packets.",
    longDescription:
      "A managed external agent for vendor onboarding with compliance checks, document collection, and routing.",
    capabilities: ["Vendor onboarding", "Compliance check", "Document parsing", "Email follow-up", "ERP update"],
    matchScore: 71,
    pricingModel: "Token-based",
    price: "~TRY 12K/mo (token-based)",
    activeIn: [],
    usageHistory: [],
    access: ["Vendor portal - read/write", "Email inbox - read only", "Procurement ERP - read/write"],
  },
  {
    id: "campaign-research",
    name: "Campaign Research Agent",
    type: "External",
    source: "Partner AI",
    description: "Generates market briefs, competitor notes, and campaign research summaries.",
    longDescription:
      "An external research agent optimized for marketing planning, competitor tracking, and campaign briefs.",
    capabilities: ["Market research", "Competitor tracking", "Brief generation", "Source summarization"],
    matchScore: 64,
    pricingModel: "Subscription",
    price: "~TRY 18K/mo (subscription)",
    activeIn: [],
    usageHistory: ["Marketing pilot - inactive"],
    access: ["Web research - read only", "Campaign docs - read only"],
  },
];

const requests: AgentRequest[] = [
  {
    id: "req-1",
    rawText: "We need an agent that can reconcile invoices against purchase orders and flag mismatches.",
    requestedBy: "Elif Arslan",
    department: "Finance",
    date: "Jul 9, 2026",
    matchStatus: "Matched to existing agent",
    status: "Reviewing",
    matchedAgents: ["invoice-matcher", "vendor-intake"],
    approvalChain: ["Finance Lead review pending", "Budget owner notified"],
    activity: ["Created", "Matched to marketplace", "Moved to Reviewing"],
  },
  {
    id: "req-2",
    rawText: "Create a custom workflow agent for facilities requests and recurring vendor reminders.",
    requestedBy: "Deniz Koc",
    department: "Operations",
    date: "Jul 8, 2026",
    matchStatus: "No match - custom needed",
    status: "Pending",
    matchedAgents: ["vendor-intake"],
    approvalChain: ["Operations manager pending"],
    activity: ["Created", "Custom dev needed"],
  },
  {
    id: "req-3",
    rawText: "We want campaign research summaries for weekly planning and competitor briefs.",
    requestedBy: "Selin Ak",
    department: "Marketing",
    date: "Jul 7, 2026",
    matchStatus: "Matched to existing agent",
    status: "Approved",
    matchedAgents: ["campaign-research"],
    approvalChain: ["Growth Director approved", "Budget owner approved"],
    activity: ["Created", "Matched", "Approved"],
  },
];

const initialConnections: Connection[] = [
  {
    name: "Support Agent - n8n",
    tasks: ["Extract support intents", "Validate token budget alerts"],
    url: "https://hooks.n8n.cloud/support-agent",
    active: true,
    lastRun: "Today, 09:14",
    history: ["Connected by Arham Khan - Jun 3, 2026", "Token budget alert linked - Jul 5, 2026"],
    metrics: { monthlyTokenCost: "TRY 42K", successRate: "94%", errorSummary: "1 failed run in last 7 days" },
    logs: [
      ["09:14", "Successful"],
      ["08:02", "Successful"],
      ["Yesterday", "Failed"],
    ],
  },
  {
    name: "Finance Partner - Gumloop",
    tasks: ["Map finance approval flow"],
    url: "https://api.gumloop.com/run/finance-partner",
    active: true,
    lastRun: "Yesterday, 17:45",
    history: ["Connected by Elif Arslan - May 18, 2026", "Approval flow updated - Jul 2, 2026"],
    metrics: { monthlyTokenCost: "TRY 28K", successRate: "97%", errorSummary: "No errors this month" },
    logs: [
      ["Yesterday", "Successful"],
      ["Jul 6", "Successful"],
      ["Jul 5", "Successful"],
    ],
  },
  {
    name: "Campaign Research Agent",
    tasks: ["Draft agent replacement scenario"],
    url: "https://automation.partner.ai/campaigns/research",
    active: false,
    lastRun: "Jul 4, 11:22",
    history: ["Connected by Selin Ak - Jun 21, 2026", "Paused after campaign pilot - Jul 4, 2026"],
    metrics: { monthlyTokenCost: "TRY 18K", successRate: "81%", errorSummary: "2 failed summaries in last 30 days" },
    logs: [
      ["Jul 4", "Successful"],
      ["Jul 3", "Failed"],
      ["Jul 2", "Successful"],
    ],
  },
];

const taskMatches = [
  {
    task: "Invoice reconciliation",
    department: "Finance",
    assignee: "Open role",
    score: 91,
    source: "Tag match",
    warning: false,
  },
  {
    task: "Vendor onboarding",
    department: "Operations",
    assignee: "Selim Baran",
    score: 74,
    source: "Historical usage",
    warning: true,
  },
  {
    task: "Campaign brief",
    department: "Marketing",
    assignee: "Campaign Analyst",
    score: 63,
    source: "Tag match",
    warning: true,
  },
];

const taskOptions = [
  "Invoice reconciliation",
  "Vendor onboarding",
  "Ticket triage",
  "Campaign brief",
  "Budget alert review",
];

export default function Page() {
  const [connections, setConnections] = useState(initialConnections);
  const [agentMode, setAgentMode] = useState<AgentType>("Internal");
  const [selectedAgent, setSelectedAgent] = useState<Agent>(agents[0]);
  const [requestModalOpen, setRequestModalOpen] = useState(false);

  function toggleConnection(name: string) {
    setConnections((items) =>
      items.map((connection) =>
        connection.name === name ? { ...connection, active: !connection.active } : connection,
      ),
    );
  }

  const requestStats = useMemo(
    () => ({
      total: requests.length,
      pending: requests.filter((request) => request.status === "Pending").length,
      matched: requests.filter((request) => request.matchStatus.includes("Matched")).length,
      custom: requests.filter((request) => request.matchStatus.includes("custom")).length,
    }),
    [],
  );

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <span>Dashboard</span>
            <span>/</span>
            <span>Agent Marketplace</span>
          </div>
          <h1 className="mt-1 text-2xl tracking-tight">Agent Marketplace</h1>
          <p className="mt-1 max-w-3xl text-muted-foreground text-sm">
            Discover, request, and connect internal or external agents to your tasks.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <NewRequestModal />
          <AddToolDialog />
        </div>
      </div>

      <Tabs defaultValue="marketplace" className="grid gap-4">
        <TabsList className="w-fit">
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="connections">Active Connections</TabsTrigger>
        </TabsList>

        <TabsContent value="marketplace" className="m-0">
          <MarketplaceTab
            agentMode={agentMode}
            onRequest={(agent) => {
              setSelectedAgent(agent);
              setRequestModalOpen(true);
            }}
            setAgentMode={setAgentMode}
          />
        </TabsContent>

        <TabsContent value="requests" className="m-0">
          <RequestsTab stats={requestStats} />
        </TabsContent>

        <TabsContent value="connections" className="m-0">
          <ActiveConnectionsTab connections={connections} toggleConnection={toggleConnection} />
        </TabsContent>
      </Tabs>

      <RequestConnectModal agent={selectedAgent} open={requestModalOpen} setOpen={setRequestModalOpen} />
    </div>
  );
}

function MarketplaceTab({
  agentMode,
  onRequest,
  setAgentMode,
}: {
  agentMode: AgentType;
  onRequest: (agent: Agent) => void;
  setAgentMode: (type: AgentType) => void;
}) {
  const visibleAgents = agents.filter((agent) => agent.type === agentMode);

  return (
    <Card className="rounded-lg shadow-none">
      <CardHeader className="border-b p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle className="text-base">Marketplace</CardTitle>
            <CardDescription>Browse reusable internal agents and approved external providers.</CardDescription>
          </div>
          <Tabs value={agentMode} onValueChange={(value) => setAgentMode(value as AgentType)}>
            <TabsList>
              <TabsTrigger value="Internal">Internal</TabsTrigger>
              <TabsTrigger value="External">External</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex flex-col gap-2 pt-2 lg:flex-row lg:items-center lg:justify-between">
          <InputGroup className="h-9 lg:w-96">
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupInput placeholder="Search agents, capabilities, tasks..." />
          </InputGroup>
          <div className="flex flex-wrap gap-2">
            {["All", "High match", "Department"].map((filter) => (
              <Button key={filter} size="sm" variant="outline">
                {filter}
              </Button>
            ))}
            {agentMode === "External"
              ? ["Token-based", "Fixed", "Subscription"].map((filter) => (
                  <Button key={filter} size="sm" variant="outline">
                    {filter}
                  </Button>
                ))
              : null}
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleAgents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} onRequest={() => onRequest(agent)} />
        ))}
      </CardContent>
    </Card>
  );
}

function AgentCard({ agent, onRequest }: { agent: Agent; onRequest: () => void }) {
  return (
    <Sheet>
      <Card className="overflow-hidden rounded-2xl pt-0 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
        <div
          className={
            agent.type === "Internal"
              ? "h-20 bg-[linear-gradient(135deg,#7c83ff_0%,#d9b4ff_30%,#f8fbff_58%,#5cc8ff_100%)]"
              : "h-20 bg-[radial-gradient(circle_at_60%_40%,#ff9f1c_0%,#ffcf5f_20%,#ff8bc3_38%,#70c7ff_65%,#7aa7ff_100%)]"
          }
        />
        <CardContent className="flex min-h-[360px] flex-col gap-5 p-5">
          <SheetTrigger asChild>
            <button className="w-full text-left" type="button">
              <AgentCardBody agent={agent} />
            </button>
          </SheetTrigger>
          <div className="mt-auto flex items-center gap-2 border-t pt-4">
            <SheetTrigger asChild>
              <Button className="rounded-full px-5" size="sm" variant="outline">
                View details
              </Button>
            </SheetTrigger>
            <Button
              size="sm"
              className="ml-auto rounded-full bg-sky-500 px-5 text-white hover:bg-sky-600"
              onClick={onRequest}
            >
              Request
            </Button>
          </div>
        </CardContent>
      </Card>
      <AgentDetailDrawer agent={agent} onRequest={onRequest} />
    </Sheet>
  );
}

function AgentCardBody({ agent }: { agent: Agent }) {
  return (
    <div className="grid gap-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <CardTitle className="truncate text-xl">{agent.name}</CardTitle>
            <Badge variant={agent.type === "Internal" ? "secondary" : "outline"}>{agent.type}</Badge>
          </div>
          <CardDescription className="mt-1 truncate">{agent.source}</CardDescription>
        </div>
        <div
          className={
            agent.type === "Internal"
              ? "flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300"
              : "flex size-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300"
          }
        >
          <Bot className="size-5" />
        </div>
      </div>

      <p className="line-clamp-2 text-muted-foreground text-sm leading-6">{agent.description}</p>

      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-muted-foreground text-xs">{agent.type === "Internal" ? "Usage" : "Pricing"}</div>
          <div className="mt-1 font-semibold text-lg tracking-tight">{agent.price}</div>
        </div>
        <div className="text-right">
          <div className="text-muted-foreground text-xs">Match score</div>
          <div className="mt-1">
            <ScoreBadge score={agent.matchScore} />
          </div>
        </div>
      </div>

      <div className="grid gap-2">
        {agent.capabilities.slice(0, 3).map((capability) => (
          <div key={capability} className="flex items-center gap-2 rounded-xl border p-3 text-sm">
            <Check className="size-4 shrink-0 text-emerald-500" />
            <span className="truncate">{capability}</span>
          </div>
        ))}
        {agent.capabilities.length > 3 ? (
          <div className="pl-1 text-muted-foreground text-xs">+{agent.capabilities.length - 3} more capabilities</div>
        ) : null}
      </div>
    </div>
  );
}

function RequestsTab({ stats }: { stats: { total: number; pending: number; matched: number; custom: number } }) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-3 md:grid-cols-4">
        <SummaryCard label="Total requests" value={`${stats.total}`} tone="bg-sky-50/80 dark:bg-sky-500/10" />
        <SummaryCard label="Pending approval" value={`${stats.pending}`} tone="bg-slate-50 dark:bg-slate-500/10" />
        <SummaryCard
          label="Matched marketplace"
          value={`${stats.matched}`}
          tone="bg-emerald-50/80 dark:bg-emerald-500/10"
        />
        <SummaryCard label="Custom dev needed" value={`${stats.custom}`} tone="bg-orange-50/80 dark:bg-orange-500/10" />
      </div>
      <Card className="rounded-lg shadow-none">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request</TableHead>
                <TableHead>Requested by</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Match status</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-16" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <RequestDetailDrawer key={request.id} request={request}>
                  <TableRow className="cursor-pointer">
                    <TableCell className="max-w-80 font-medium">{request.rawText.slice(0, 40)}...</TableCell>
                    <TableCell>{request.requestedBy}</TableCell>
                    <TableCell>{request.department}</TableCell>
                    <TableCell>{request.date}</TableCell>
                    <TableCell>{request.matchStatus}</TableCell>
                    <TableCell>
                      <StatusBadge status={request.status} />
                    </TableCell>
                    <TableCell>
                      <Button size="icon-sm" variant="ghost">
                        <MoreHorizontal />
                      </Button>
                    </TableCell>
                  </TableRow>
                </RequestDetailDrawer>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function ActiveConnectionsTab({
  connections,
  toggleConnection,
}: {
  connections: Connection[];
  toggleConnection: (name: string) => void;
}) {
  return (
    <Card className="rounded-lg shadow-none">
      <CardHeader className="border-b p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle className="text-base">Active connections</CardTitle>
            <CardDescription>Existing tool table preserved with row-level detail drawers.</CardDescription>
          </div>
          <InputGroup className="h-9 lg:w-80">
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupInput placeholder="Search tools, tasks, URLs..." />
          </InputGroup>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tool name</TableHead>
              <TableHead>Linked task(s)</TableHead>
              <TableHead>Webhook / API URL</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last run</TableHead>
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {connections.map((connection) => (
              <ConnectionDetailDrawer key={connection.name} connection={connection} toggleConnection={toggleConnection}>
                <TableRow className="cursor-pointer">
                  <TableCell className="font-medium">{connection.name}</TableCell>
                  <TableCell className="max-w-80">
                    <div className="flex flex-wrap gap-1.5">
                      {connection.tasks.map((task) => (
                        <Badge key={task} variant="secondary">
                          {task}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex max-w-64 items-center gap-1 truncate text-muted-foreground">
                      <Link2 className="size-3.5" />
                      {shortUrl(connection.url)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={connection.active}
                        onClick={(event) => event.stopPropagation()}
                        onCheckedChange={() => toggleConnection(connection.name)}
                      />
                      <Badge variant={connection.active ? "default" : "outline"}>
                        {connection.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{connection.lastRun}</TableCell>
                  <TableCell>
                    <Button size="icon-sm" variant="ghost">
                      <MoreHorizontal />
                    </Button>
                  </TableCell>
                </TableRow>
              </ConnectionDetailDrawer>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function AgentDetailDrawer({ agent, onRequest }: { agent: Agent; onRequest: () => void }) {
  return (
    <SheetContent className="!w-[min(96vw,720px)] !max-w-[min(96vw,720px)] overflow-y-auto p-0">
      <SheetHeader className="border-b p-5">
        <SheetTitle>{agent.name}</SheetTitle>
        <SheetDescription>
          {agent.type} agent from {agent.source}
        </SheetDescription>
      </SheetHeader>
      <Tabs defaultValue="overview">
        <DrawerTabs
          tabs={[
            { label: "Overview", value: "overview" },
            { label: "Task Match", value: "task-match" },
            { label: "Usage History", value: "usage-history" },
            { label: "Access & Security", value: "access-security" },
          ]}
        />
        <div className="p-5">
          <TabsContent value="overview" className="m-0 grid gap-4">
            <p className="text-muted-foreground text-sm">{agent.longDescription}</p>
            <div className="flex flex-wrap gap-2">
              {agent.capabilities.map((capability) => (
                <Badge key={capability} variant="secondary">
                  {capability}
                </Badge>
              ))}
            </div>
            <Info label="Pricing" value={agent.price} />
            {agent.activeIn.length ? <Info label="Already active in" value={agent.activeIn.join(", ")} /> : null}
          </TabsContent>
          <TabsContent value="task-match" className="m-0 grid gap-3">
            <div className="rounded-lg border bg-sky-50/60 p-3 text-sm dark:bg-sky-500/10">
              Scores combine capability overlap and historical usage performance.
            </div>
            {taskMatches.map((match) => (
              <div key={match.task} className="rounded-lg border p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-medium">{match.task}</div>
                    <div className="text-muted-foreground text-sm">
                      {match.department} - {match.assignee}
                    </div>
                  </div>
                  <ScoreBadge score={match.score} />
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant="outline">{match.source}</Badge>
                  {match.warning ? (
                    <span className="inline-flex items-center gap-1 text-orange-600 text-xs">
                      <AlertTriangle className="size-3" />
                      Already assigned; connecting creates hybrid ownership
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="usage-history" className="m-0 grid gap-3">
            {agent.usageHistory.length ? (
              agent.usageHistory.map((item) => <Info key={item} label="Usage" value={item} />)
            ) : (
              <EmptyState title="Not yet connected" detail="Usage metrics will appear after this agent is connected." />
            )}
          </TabsContent>
          <TabsContent value="access-security" className="m-0 grid gap-3">
            {agent.access.map((item) => (
              <Info key={item} label="Access" value={item} />
            ))}
            <Info
              label="Last security review"
              value={agent.type === "External" ? "Jun 22, 2026" : "Internal policy inherited"}
            />
          </TabsContent>
        </div>
      </Tabs>
      <div className="sticky bottom-0 border-t bg-background p-4">
        <Button className="w-full bg-sky-600 text-white hover:bg-sky-700" onClick={onRequest}>
          Request this agent
        </Button>
      </div>
    </SheetContent>
  );
}

function RequestConnectModal({
  agent,
  open,
  setOpen,
}: {
  agent: Agent;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Request or connect agent</DialogTitle>
          <DialogDescription>Submit a focused request for the selected agent.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="rounded-lg border bg-sky-50/60 p-4 dark:bg-sky-500/10">
            <div className="font-medium">{agent.name}</div>
            <div className="mt-1 text-muted-foreground text-sm">
              {agent.type} - {agent.price}
            </div>
          </div>
          <div className="grid gap-2">
            <div className="font-medium text-sm">Linked tasks</div>
            <div className="flex flex-wrap gap-2 rounded-lg border p-3">
              {taskOptions.slice(0, 3).map((task, index) => (
                <Badge key={task} variant={index === 0 ? "default" : "secondary"}>
                  {task}
                </Badge>
              ))}
            </div>
          </div>
          <div className="rounded-lg border bg-orange-50/70 p-3 text-sm dark:bg-orange-500/10">
            This connection adds about TRY 12K to the monthly department budget. Current usage is 72%.
          </div>
          <div className="rounded-lg border bg-emerald-50/70 p-3 text-sm dark:bg-emerald-500/10">
            This request can be auto-approved when it stays inside the budget limit.
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Connect Now</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function NewRequestModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-sky-600 text-white hover:bg-sky-700">
          <Plus /> Request Agent
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Request a custom agent</DialogTitle>
          <DialogDescription>
            Describe the job and we will suggest marketplace matches or route it to custom development.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <Textarea
            className="min-h-28"
            placeholder="Example: I need an agent that can match invoices automatically and process 200 invoices per week."
          />
          <Input defaultValue="Finance" />
          <div className="grid gap-2 rounded-lg border p-3">
            <div className="font-medium text-sm">Instant suggestions</div>
            {agents.slice(0, 2).map((agent) => (
              <div key={agent.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                <span>{agent.name}</span>
                <ScoreBadge score={agent.matchScore} />
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">None fit, request custom</Button>
          <Button>Submit Request</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AddToolDialog() {
  const [connectionState, setConnectionState] = useState<"idle" | "success" | "failed">("idle");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Plus /> Add Tool
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Add connected tool</DialogTitle>
          <DialogDescription>Connect a webhook or API endpoint to one or more eligible tasks.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <Input placeholder="Support Agent - n8n" />
          <Input placeholder="https://hooks.example.com/task-agent" />
          <div className="rounded-lg border p-3">
            <div className="flex flex-wrap gap-2">
              {taskOptions.map((task, index) => (
                <Badge key={task} variant={index < 2 ? "default" : "secondary"}>
                  {task}
                </Badge>
              ))}
            </div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="font-medium">Connection test</div>
                <p className="text-muted-foreground text-sm">Send a sample ping before saving this tool.</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setConnectionState("failed")}>
                  Fail test
                </Button>
                <Button onClick={() => setConnectionState("success")}>Test connection</Button>
              </div>
            </div>
            {connectionState !== "idle" ? (
              <div className="mt-3 flex items-center gap-2 text-sm">
                {connectionState === "success" ? (
                  <>
                    <Check className="size-4 text-emerald-500" />
                    <span>Connection successful</span>
                  </>
                ) : (
                  <>
                    <X className="size-4 text-destructive" />
                    <span>Connection failed. Check the URL.</span>
                  </>
                )}
              </div>
            ) : null}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RequestDetailDrawer({ children, request }: { children: ReactNode; request: AgentRequest }) {
  const matched = agents.filter((agent) => request.matchedAgents.includes(agent.id));

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="!w-[min(96vw,680px)] !max-w-[min(96vw,680px)] overflow-y-auto p-0">
        <SheetHeader className="border-b p-5">
          <SheetTitle>Request detail</SheetTitle>
          <SheetDescription>{request.rawText}</SheetDescription>
        </SheetHeader>
        <Tabs defaultValue="overview">
          <DrawerTabs
            tabs={[
              { label: "Overview", value: "overview" },
              { label: "Suggested Matches", value: "suggested-matches" },
              { label: "Approval", value: "approval" },
              { label: "Activity", value: "activity" },
            ]}
          />
          <div className="p-5">
            <TabsContent value="overview" className="m-0 grid gap-3">
              <Info label="Requested by" value={request.requestedBy} />
              <Info label="Department" value={request.department} />
              <Info label="Date" value={request.date} />
            </TabsContent>
            <TabsContent value="suggested-matches" className="m-0 grid gap-3">
              {matched.map((agent) => (
                <Info key={agent.id} label={agent.name} value={`${agent.matchScore}% match`} />
              ))}
            </TabsContent>
            <TabsContent value="approval" className="m-0 grid gap-3">
              <StatusBadge status={request.status} />
              {request.approvalChain.map((item) => (
                <Info key={item} label="Approval" value={item} />
              ))}
              <div className="flex gap-2">
                <Button>Approve</Button>
                <Button variant="outline">Reject</Button>
              </div>
            </TabsContent>
            <TabsContent value="activity" className="m-0 grid gap-3">
              {request.activity.map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-lg border p-3 text-sm">
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  {item}
                </div>
              ))}
            </TabsContent>
          </div>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

function ConnectionDetailDrawer({
  children,
  connection,
  toggleConnection,
}: {
  children: ReactNode;
  connection: Connection;
  toggleConnection: (name: string) => void;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="!w-[min(96vw,680px)] !max-w-[min(96vw,680px)] overflow-y-auto p-0">
        <SheetHeader className="border-b p-5">
          <SheetTitle>{connection.name}</SheetTitle>
          <SheetDescription>{shortUrl(connection.url)}</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <Info label="Status" value={connection.active ? "Active" : "Inactive"} />
            <Info label="Last run" value={connection.lastRun} />
            <Info label="Monthly token cost" value={connection.metrics.monthlyTokenCost} />
            <Info label="Success rate" value={connection.metrics.successRate} />
          </div>
          <Info label="Error summary" value={connection.metrics.errorSummary} />
          <div className="rounded-lg border p-3">
            <div className="font-medium">History</div>
            <div className="mt-3 grid gap-2">
              {connection.history.map((item) => (
                <div key={item} className="text-muted-foreground text-sm">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="font-medium">Run logs</div>
            <div className="mt-3 grid gap-2">
              {connection.logs.map(([time, result]) => (
                <div
                  key={`${time}-${result}`}
                  className="flex items-center justify-between rounded-lg border p-2 text-sm"
                >
                  <span>{time}</span>
                  <Badge variant={result === "Successful" ? "default" : "outline"}>{result}</Badge>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">
              <ExternalLink /> Edit linked tasks
            </Button>
            <Button variant="outline" onClick={() => toggleConnection(connection.name)}>
              {connection.active ? "Pause" : "Activate"}
            </Button>
            <Button variant="destructive">
              <Trash2 /> Disconnect
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function DrawerTabs({ tabs }: { tabs: { label: string; value: string }[] }) {
  return (
    <div className="sticky top-0 z-10 overflow-x-auto border-b bg-background px-5 py-3">
      <TabsList
        className="grid min-w-[560px]"
        style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
      >
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  );
}

function SummaryCard({ label, tone, value }: { label: string; tone: string; value: string }) {
  return (
    <Card className="rounded-lg shadow-none">
      <CardContent className={`rounded-lg p-4 ${tone}`}>
        <div className="text-muted-foreground text-xs">{label}</div>
        <div className="mt-1 font-semibold text-2xl">{value}</div>
      </CardContent>
    </Card>
  );
}

function ScoreBadge({ score }: { score: number }) {
  let tone = "bg-slate-50 text-slate-700 dark:bg-slate-500/10 dark:text-slate-300";

  if (score >= 70) {
    tone = "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300";
  } else if (score >= 40) {
    tone = "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300";
  }

  return <Badge className={tone}>{score}% match</Badge>;
}

function StatusBadge({ status }: { status: RequestStatus }) {
  const tone = {
    Pending: "bg-slate-100 text-slate-700",
    Reviewing: "bg-sky-100 text-sky-700",
    Approved: "bg-emerald-100 text-emerald-700",
    Rejected: "bg-red-100 text-red-700",
  }[status];

  return <Badge className={tone}>{status}</Badge>;
}

function EmptyState({ detail, title }: { detail: string; title: string }) {
  return (
    <div className="grid place-items-center rounded-lg border p-8 text-center">
      <div className="flex size-10 items-center justify-center rounded-full bg-muted">
        <FileText className="size-5 text-muted-foreground" />
      </div>
      <div className="mt-3 font-medium">{title}</div>
      <p className="mt-1 max-w-sm text-muted-foreground text-sm">{detail}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border p-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

function shortUrl(url: string) {
  return `${url.replace("https://", "").slice(0, 34)}...`;
}
