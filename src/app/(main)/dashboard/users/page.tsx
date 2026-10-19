"use client";

import { type ReactNode, useMemo, useState } from "react";

import {
  Bot,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  ExternalLink,
  MoreHorizontal,
  Plus,
  Search,
  UserRound,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

type UserStatus = "Active" | "Paused" | "Error" | "Deprecated" | "On leave" | "Inactive";

type BaseUser = {
  id: string;
  name: string;
  role: string;
  department: string;
  status: UserStatus;
};

type HumanUser = BaseUser & {
  type: "Human";
  accessLevel: string;
  activity: string[];
  automatableTasks: number;
  directReports: string[];
  email: string;
  employmentType: string;
  hireDate: string;
  lastLogin: string;
  linkedTools: string[];
  monthlyCost: string;
  reportsTo: string;
  security: {
    lastPasswordChange: string;
    twoFactor: string;
  };
};

type AgentUser = BaseUser & {
  type: "Agent";
  access: string[];
  assignedTasks: {
    lastRun: string;
    name: string;
    score: number;
    source: string;
    status: string;
  }[];
  capabilities: string[];
  connectedBy: string;
  createdAt: string;
  errorMessage?: string;
  internalType: "Internal" | "External";
  lastRun: string;
  model: string;
  provider: string;
  reportsTo: string;
  tokenCost: string;
  usageMetrics: {
    actualCost: string;
    budget: string;
    errors30d: number;
    inputTokens: string;
    outputTokens: string;
    successRate: number;
    trend: string;
    uptime: string;
  };
  webhookUrl: string;
};

type HybridUser = Omit<HumanUser, "type"> & {
  type: "Hybrid";
  assistantAgent: string;
  assistantModel: string;
};

type DirectoryUser = HumanUser | AgentUser | HybridUser;

const users: DirectoryUser[] = [
  {
    id: "aylin",
    type: "Human",
    name: "Aylin Kaya",
    role: "CEO",
    department: "Leadership",
    email: "aylin@orgflow.ai",
    status: "Active",
    lastLogin: "Today",
    hireDate: "Jan 8, 2025",
    employmentType: "Full-time",
    monthlyCost: "TRY 185K",
    reportsTo: "Board",
    directReports: ["Mert Demir", "Ops Agent", "Elif Arslan"],
    automatableTasks: 31,
    accessLevel: "Admin",
    linkedTools: ["Org Chart", "Finance", "Agent Marketplace"],
    security: { twoFactor: "Enabled", lastPasswordChange: "Jun 18, 2026" },
    activity: ["Logged in today", "Approved Finance department transfer", "Reviewed org projection"],
  },
  {
    id: "mert",
    type: "Hybrid",
    name: "Mert Demir + Product Research Agent",
    role: "VP Product",
    department: "Product",
    email: "mert@orgflow.ai",
    status: "Active",
    lastLogin: "Yesterday",
    hireDate: "Mar 12, 2025",
    employmentType: "Full-time",
    monthlyCost: "TRY 132K",
    reportsTo: "Aylin Kaya",
    directReports: ["QA Hybrid", "Research Agent"],
    automatableTasks: 58,
    accessLevel: "Editor",
    linkedTools: ["Roadmap", "Tasks", "Org Chart"],
    security: { twoFactor: "Enabled", lastPasswordChange: "May 30, 2026" },
    activity: ["Hybrid assistant linked", "Roadmap triage converted to agent-assisted", "Logged in yesterday"],
    assistantAgent: "Product Research Agent",
    assistantModel: "GPT-4o · Internal",
  },
  {
    id: "ops-agent",
    type: "Agent",
    name: "Ops Agent",
    role: "Workflow Agent",
    department: "Operations",
    status: "Active",
    lastRun: "3 min ago",
    internalType: "Internal",
    provider: "n8n",
    model: "GPT-4o · n8n",
    createdAt: "Feb 14, 2026",
    connectedBy: "Aylin Kaya",
    reportsTo: "Operations Department",
    tokenCost: "TRY 42K/mo",
    capabilities: ["Workflow routing", "Vendor intake", "Budget alerts", "SLA monitoring"],
    webhookUrl: "https://hooks.orgflow.ai/ops-agent",
    access: ["Task queue - read/write", "Vendor inbox - read only", "Budget alerts - write"],
    assignedTasks: [
      {
        name: "Validate token budget alerts",
        status: "Done",
        lastRun: "3 min ago",
        score: 92,
        source: "Historical usage",
      },
      { name: "Route vendor reminders", status: "In Progress", lastRun: "18 min ago", score: 86, source: "Tag match" },
    ],
    usageMetrics: {
      inputTokens: "18.4M",
      outputTokens: "6.2M",
      actualCost: "TRY 42K",
      budget: "TRY 50K",
      trend: "+8.4%",
      successRate: 94,
      uptime: "99.1%",
      errors30d: 2,
    },
  },
  {
    id: "research-agent",
    type: "Agent",
    name: "Research Agent",
    role: "Market Research",
    department: "Marketing",
    status: "Paused",
    lastRun: "2 days ago",
    internalType: "External",
    provider: "Partner AI",
    model: "Claude · Partner AI",
    createdAt: "Apr 3, 2026",
    connectedBy: "Selin Ak",
    reportsTo: "Marketing Department",
    tokenCost: "TRY 28K/mo",
    capabilities: ["Market research", "Competitor tracking", "Brief generation"],
    webhookUrl: "https://automation.partner.ai/campaigns/research",
    access: ["Campaign docs - read only", "Web research - read only"],
    assignedTasks: [
      {
        name: "Draft agent replacement scenario",
        status: "In Review",
        lastRun: "2 days ago",
        score: 88,
        source: "Tag match",
      },
    ],
    usageMetrics: {
      inputTokens: "9.1M",
      outputTokens: "3.4M",
      actualCost: "TRY 28K",
      budget: "TRY 35K",
      trend: "-4.2%",
      successRate: 81,
      uptime: "96.4%",
      errors30d: 4,
    },
  },
  {
    id: "support-triage",
    type: "Agent",
    name: "Support Triage",
    role: "Ticket Classification Agent",
    department: "CX",
    status: "Error",
    lastRun: "42 min ago",
    internalType: "Internal",
    provider: "Internal Build",
    model: "GPT-4o mini · Internal",
    createdAt: "Dec 2, 2025",
    connectedBy: "Deniz Koc",
    reportsTo: "CX Department",
    tokenCost: "TRY 18K/mo",
    errorMessage: "Webhook retry limit reached for the helpdesk connector.",
    capabilities: ["Intent extraction", "Priority routing", "Knowledge base lookup"],
    webhookUrl: "https://hooks.orgflow.ai/support-triage",
    access: ["Support inbox - read only", "Helpdesk queue - write"],
    assignedTasks: [
      {
        name: "Extract support intents",
        status: "In Progress",
        lastRun: "42 min ago",
        score: 78,
        source: "Historical usage",
      },
    ],
    usageMetrics: {
      inputTokens: "6.3M",
      outputTokens: "2.8M",
      actualCost: "TRY 18K",
      budget: "TRY 24K",
      trend: "+3.1%",
      successRate: 76,
      uptime: "91.2%",
      errors30d: 9,
    },
  },
  {
    id: "elif",
    type: "Human",
    name: "Elif Arslan",
    role: "Finance Lead",
    department: "Finance",
    email: "elif@orgflow.ai",
    status: "Active",
    lastLogin: "Today",
    hireDate: "Aug 19, 2025",
    employmentType: "Full-time",
    monthlyCost: "TRY 118K",
    reportsTo: "Aylin Kaya",
    directReports: ["Finance Partner - Gumloop"],
    automatableTasks: 64,
    accessLevel: "Admin",
    linkedTools: ["Finance", "Billing Usage", "Connected Tools"],
    security: { twoFactor: "Enabled", lastPasswordChange: "Jul 1, 2026" },
    activity: ["Reviewed token budget", "Mapped finance approval flow", "Logged in today"],
  },
  {
    id: "deniz",
    type: "Human",
    name: "Deniz Koc",
    role: "People Operations",
    department: "People",
    email: "deniz@orgflow.ai",
    status: "On leave",
    lastLogin: "6 days ago",
    hireDate: "Nov 5, 2025",
    employmentType: "Contractor",
    monthlyCost: "TRY 74K",
    reportsTo: "Aylin Kaya",
    directReports: [],
    automatableTasks: 42,
    accessLevel: "Editor",
    linkedTools: ["Users", "Departments", "Tasks"],
    security: { twoFactor: "Enabled", lastPasswordChange: "Jun 9, 2026" },
    activity: ["Marked on leave", "Transferred Support Triage ownership", "Updated payroll connector task"],
  },
];

export default function Page() {
  const [activeTab, setActiveTab] = useState<"users" | "agents">("users");
  const visibleUsers = activeTab === "agents" ? users.filter((user) => user.type === "Agent") : users;
  const stats = useMemo(
    () => ({
      total: users.length,
      humans: users.filter((user) => user.type === "Human").length,
      agents: users.filter((user) => user.type === "Agent").length,
      active: users.filter((user) => user.status === "Active").length,
      inactive: users.filter((user) => ["Paused", "Inactive", "Deprecated", "On leave", "Error"].includes(user.status))
        .length,
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
            <span>Users</span>
          </div>
          <h1 className="mt-1 text-2xl tracking-tight">Users & Agents</h1>
          <p className="mt-1 max-w-3xl text-muted-foreground text-sm">
            Manage human users, autonomous agents, hybrid pairings, access, cost, and activity in one directory.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex rounded-md bg-muted p-1">
            <Button
              size="sm"
              variant={activeTab === "users" ? "secondary" : "ghost"}
              className="h-7 px-3"
              onClick={() => setActiveTab("users")}
            >
              Users
            </Button>
            <Button
              size="sm"
              variant={activeTab === "agents" ? "secondary" : "ghost"}
              className="h-7 px-3"
              onClick={() => setActiveTab("agents")}
            >
              Agents
            </Button>
          </div>
          <AddUserMenu />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-5">
        <Summary label="Total users" tone="bg-sky-50/80 dark:bg-sky-500/10" value={`${stats.total}`} />
        <Summary label="Human" tone="bg-slate-50 dark:bg-slate-500/10" value={`${stats.humans}`} />
        <Summary label="Agent" tone="bg-violet-50/80 dark:bg-violet-500/10" value={`${stats.agents}`} />
        <Summary label="Active" tone="bg-teal-50/80 dark:bg-teal-500/10" value={`${stats.active}`} />
        <Summary label="Paused / inactive" tone="bg-orange-50/80 dark:bg-orange-500/10" value={`${stats.inactive}`} />
      </div>

      <Card className="rounded-lg shadow-none">
        <CardHeader className="border-b p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-base">User inventory</CardTitle>
              <CardDescription>
                Rows open type-aware detail drawers for humans, agents, and hybrid users.
              </CardDescription>
            </div>
            <InputGroup className="h-9 lg:w-80">
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
              <InputGroupInput placeholder="Search users, agents, model, department..." />
            </InputGroup>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {[
              "Department: All",
              "Type: All + Hybrid-linked",
              "Status: Active / Paused / Error",
              "Sort: Name",
              "Sort: Last active",
              "Sort: Cost high to low",
              "Bulk actions",
            ].map((filter) => (
              <Button key={filter} size="sm" variant="outline" className="bg-background">
                {filter}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <UsersTable users={visibleUsers} />
        </CardContent>
      </Card>
    </div>
  );
}

function UsersTable({ users: rows }: { users: DirectoryUser[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Email / Model</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Last Login / Run</TableHead>
          <TableHead className="w-16" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((user) => (
          <UserDetailDrawer key={user.id} user={user}>
            <TableRow className="cursor-pointer hover:bg-muted/30">
              <TableCell>
                <div className="flex items-center gap-2">
                  <UserAvatar user={user} />
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-muted-foreground text-xs">
                      {user.type === "Agent" ? user.internalType : "Workspace member"}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium">{user.role}</div>
                {user.type === "Agent" ? <div className="text-muted-foreground text-xs">{user.tokenCost}</div> : null}
                {user.type === "Hybrid" ? (
                  <div className="text-muted-foreground text-xs">Assistant: {user.assistantAgent}</div>
                ) : null}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{user.department}</Badge>
              </TableCell>
              <TableCell>
                <TypeBadge user={user} />
              </TableCell>
              <TableCell>
                <div className="max-w-56 truncate">{user.type === "Agent" ? user.model : user.email}</div>
                {user.type === "Agent" ? <div className="text-muted-foreground text-xs">{user.provider}</div> : null}
              </TableCell>
              <TableCell>
                <StatusBadge status={user.status} />
              </TableCell>
              <TableCell>{user.type === "Agent" ? user.lastRun : user.lastLogin}</TableCell>
              <TableCell>
                <Button size="icon-sm" variant="ghost" aria-label={`Open ${user.name}`}>
                  <MoreHorizontal />
                </Button>
              </TableCell>
            </TableRow>
          </UserDetailDrawer>
        ))}
      </TableBody>
    </Table>
  );
}

function UserDetailDrawer({ children, user }: { children: ReactNode; user: DirectoryUser }) {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      {user.type === "Agent" ? <AgentDetailDrawer user={user} /> : <HumanDetailDrawer user={user} />}
    </Sheet>
  );
}

function HumanDetailDrawer({ user }: { user: HumanUser | HybridUser }) {
  return (
    <SheetContent className="!w-[min(96vw,720px)] !max-w-[min(96vw,720px)] overflow-y-auto p-0">
      <SheetHeader className="border-b p-5">
        <SheetTitle>{user.name}</SheetTitle>
        <SheetDescription>
          {user.role} · {user.department}
        </SheetDescription>
      </SheetHeader>
      <Tabs defaultValue="overview">
        <DrawerTabs
          tabs={[
            { label: "Overview", value: "overview" },
            { label: "Access & Permissions", value: "access" },
            { label: "Reports", value: "reports" },
            { label: "Activity", value: "activity" },
          ]}
        />
        <div className="p-5">
          <TabsContent value="overview" className="m-0 grid gap-4">
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <UserAvatar user={user} />
              <div>
                <div className="font-medium">{user.email}</div>
                <div className="text-muted-foreground text-sm">
                  {user.employmentType} · hired {user.hireDate}
                </div>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Info label="Monthly cost" value={user.monthlyCost} />
              <Info label="Reports to" value={user.reportsTo} />
              <Info label="Direct reports" value={`${user.directReports.length}`} />
              <Info label="Agent suitability" value={`${user.automatableTasks}% of tasks automatable`} />
            </div>
            <div className="rounded-lg border bg-sky-50/60 p-4 dark:bg-sky-500/10">
              <div className="flex items-center justify-between text-sm">
                <span>Automation fit</span>
                <span className="font-medium">{user.automatableTasks}%</span>
              </div>
              <Progress className="mt-3" value={user.automatableTasks} />
            </div>
          </TabsContent>
          <TabsContent value="access" className="m-0 grid gap-3">
            <Info label="Access level" value={user.accessLevel} />
            <Info label="2FA" value={user.security.twoFactor} />
            <Info label="Last password change" value={user.security.lastPasswordChange} />
            {user.linkedTools.map((tool) => (
              <Info key={tool} label="Connected tool" value={tool} />
            ))}
          </TabsContent>
          <TabsContent value="reports" className="m-0 grid gap-3">
            {user.directReports.map((report) => (
              <Info key={report} label="Direct report" value={report} />
            ))}
            {user.type === "Hybrid" ? (
              <div className="rounded-lg border bg-violet-50/60 p-3 dark:bg-violet-500/10">
                <div className="font-medium">Assigned Agent Assistant</div>
                <div className="mt-1 text-muted-foreground text-sm">
                  {user.assistantAgent} · {user.assistantModel}
                </div>
              </div>
            ) : null}
          </TabsContent>
          <TabsContent value="activity" className="m-0 grid gap-3">
            {user.activity.map((item) => (
              <TimelineItem key={item}>{item}</TimelineItem>
            ))}
          </TabsContent>
        </div>
      </Tabs>
      <DrawerFooter>
        <Button variant="outline">Edit User</Button>
        <Button variant="outline">Transfer Department</Button>
        <Button variant="destructive">Deactivate</Button>
      </DrawerFooter>
    </SheetContent>
  );
}

function AgentDetailDrawer({ user }: { user: AgentUser }) {
  return (
    <SheetContent className="!w-[min(96vw,720px)] !max-w-[min(96vw,720px)] overflow-y-auto p-0">
      <SheetHeader className="border-b p-5">
        <SheetTitle>{user.name}</SheetTitle>
        <SheetDescription>
          {user.internalType} agent · {user.provider} · {user.department}
        </SheetDescription>
      </SheetHeader>
      <Tabs defaultValue="overview">
        <DrawerTabs
          tabs={[
            { label: "Overview", value: "overview" },
            { label: "Capabilities & Tasks", value: "capabilities" },
            { label: "Usage & Cost", value: "usage" },
            { label: "Access & Security", value: "security" },
          ]}
        />
        <div className="p-5">
          <TabsContent value="overview" className="m-0 grid gap-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Info label="Model" value={user.model} />
              <Info label="Created" value={user.createdAt} />
              <Info label="Connected by" value={user.connectedBy} />
              <Info label="Reports to" value={user.reportsTo} />
            </div>
            {user.errorMessage ? (
              <div className="flex gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700 text-sm dark:bg-red-500/10 dark:text-red-300">
                <CircleAlert className="size-4 shrink-0" />
                {user.errorMessage}
              </div>
            ) : null}
          </TabsContent>
          <TabsContent value="capabilities" className="m-0 grid gap-3">
            <div className="flex flex-wrap gap-2">
              {user.capabilities.map((capability) => (
                <Badge key={capability} variant="secondary">
                  {capability}
                </Badge>
              ))}
            </div>
            {user.assignedTasks.map((task) => (
              <div key={task.name} className="rounded-lg border p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-medium">{task.name}</div>
                    <div className="text-muted-foreground text-sm">
                      {task.status} · last run {task.lastRun}
                    </div>
                  </div>
                  <ScoreBadge score={task.score} />
                </div>
                <Badge variant="outline" className="mt-2">
                  {task.source}
                </Badge>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="usage" className="m-0 grid gap-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Info label="Input tokens" value={user.usageMetrics.inputTokens} />
              <Info label="Output tokens" value={user.usageMetrics.outputTokens} />
              <Info label="Actual cost" value={user.usageMetrics.actualCost} />
              <Info label="Budget" value={user.usageMetrics.budget} />
              <Info label="Success rate" value={`${user.usageMetrics.successRate}%`} />
              <Info label="Uptime" value={user.usageMetrics.uptime} />
            </div>
            <div className="rounded-lg border bg-orange-50/60 p-4 dark:bg-orange-500/10">
              <div className="flex items-center justify-between text-sm">
                <span>Budget used</span>
                <span className="font-medium">{user.usageMetrics.trend} this month</span>
              </div>
              <Progress className="mt-3" value={Math.min(user.usageMetrics.successRate, 100)} />
            </div>
            <Info label="Errors in last 30 days" value={`${user.usageMetrics.errors30d}`} />
          </TabsContent>
          <TabsContent value="security" className="m-0 grid gap-3">
            {user.access.map((item) => (
              <Info key={item} label="Access" value={item} />
            ))}
            <Info label="Webhook / API URL" value={user.webhookUrl} />
            <Info label="Last security review" value="Jul 3, 2026" />
          </TabsContent>
        </div>
      </Tabs>
      <DrawerFooter>
        <Button variant="outline">Edit Agent</Button>
        <Button variant="outline">Pause Agent</Button>
        <Button variant="destructive">Deprecate</Button>
        <Button>
          <ExternalLink /> Marketplace
        </Button>
      </DrawerFooter>
    </SheetContent>
  );
}

function AddUserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" className="bg-sky-600 text-white hover:bg-sky-700">
          <Plus /> Add User <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>Create account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <AddHumanModal />
        <AddAgentModal />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AddHumanModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
          <UserRound className="size-4" /> Add Human
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add human user</DialogTitle>
          <DialogDescription>Create a workspace member and sync the profile to the org chart.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input placeholder="Full name" />
          <Input placeholder="Email" />
          <Input placeholder="Role" />
          <Input placeholder="Department" />
          <Input placeholder="Employment type" />
          <Input placeholder="Monthly cost" />
          <Input placeholder="Reports to" className="sm:col-span-2" />
        </div>
        <div className="rounded-lg border bg-sky-50/60 p-3 text-sm dark:bg-sky-500/10">
          New users can be synced into Org Chart v2 as a human node after creation.
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Add User</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AddAgentModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
          <Bot className="size-4" /> Add Agent
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add agent user</DialogTitle>
          <DialogDescription>
            Register an internal or external agent with cost, task, and access metadata.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input placeholder="Agent name" />
          <Input placeholder="Type: Internal or External" />
          <Input placeholder="Provider / Source" />
          <Input placeholder="Department" />
          <Input placeholder="Reports to" />
          <Input placeholder="Pricing model and estimated monthly cost" />
          <Input placeholder="Webhook / API URL (optional)" className="sm:col-span-2" />
          <Textarea
            placeholder="Capability tags: workflow routing, invoice matching, SLA monitoring..."
            className="sm:col-span-2"
          />
        </div>
        <label className="flex items-center gap-2 rounded-lg border p-3 text-sm" htmlFor="publish-agent-marketplace">
          <Checkbox id="publish-agent-marketplace" />
          Also publish this agent to the internal Agent Marketplace.
        </label>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Add Agent</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function UserAvatar({ user }: { user: DirectoryUser }) {
  if (user.type === "Hybrid") {
    return (
      <div className="relative size-9">
        <Avatar className="size-9 bg-slate-50 text-slate-700">
          <AvatarFallback>
            <UserRound className="size-4" />
          </AvatarFallback>
        </Avatar>
        <span className="absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full border bg-violet-50 text-violet-700">
          <Bot className="size-3" />
        </span>
      </div>
    );
  }

  return (
    <Avatar
      className={user.type === "Agent" ? "size-9 bg-violet-50 text-violet-700" : "size-9 bg-slate-50 text-slate-700"}
    >
      <AvatarFallback>
        {user.type === "Agent" ? <Bot className="size-4" /> : <UserRound className="size-4" />}
      </AvatarFallback>
    </Avatar>
  );
}

function TypeBadge({ user }: { user: DirectoryUser }) {
  if (user.type === "Agent") {
    return <Badge className="bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">Agent</Badge>;
  }

  if (user.type === "Hybrid") {
    return <Badge className="bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300">Hybrid</Badge>;
  }

  return <Badge variant="secondary">Human</Badge>;
}

function StatusBadge({ status }: { status: UserStatus }) {
  let className = "bg-slate-50 text-slate-700 dark:bg-slate-500/10 dark:text-slate-300";

  if (status === "Active") {
    className = "bg-foreground text-background";
  } else if (status === "Error") {
    className = "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300";
  } else if (status === "Paused" || status === "On leave") {
    className = "border border-border bg-background text-muted-foreground";
  }

  return <Badge className={className}>{status}</Badge>;
}

function Summary({ label, tone, value }: { label: string; tone: string; value: string }) {
  return (
    <Card className="rounded-lg shadow-none">
      <CardContent className={`rounded-lg p-4 ${tone}`}>
        <div className="text-muted-foreground text-xs">{label}</div>
        <div className="mt-1 font-semibold text-2xl">{value}</div>
      </CardContent>
    </Card>
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

function DrawerFooter({ children }: { children: ReactNode }) {
  return <div className="sticky bottom-0 flex flex-wrap gap-2 border-t bg-background p-4">{children}</div>;
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border p-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

function TimelineItem({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-3 rounded-lg border p-3 text-sm">
      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
      <span>{children}</span>
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  let className = "bg-slate-50 text-slate-700";

  if (score >= 85) {
    className = "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300";
  } else if (score >= 70) {
    className = "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300";
  }

  return <Badge className={className}>{score}% match</Badge>;
}
