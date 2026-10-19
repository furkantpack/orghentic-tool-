"use client";

import { useMemo, useState } from "react";

import {
  Bot,
  Check,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Copy,
  GitCompare,
  Grid2X2,
  MoreHorizontal,
  Plus,
  RadioTower,
  Send,
  Settings,
  ShieldCheck,
  Table2,
  UserRound,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ScenarioStatus = "current" | "recommended" | "draft" | "applied";
type AssignmentType = "Human" | "Ready Agent" | "Custom Agent" | "Open";

type RoleAssignment = {
  role: string;
  department: string;
  chosen: AssignmentType;
  monthlyCost: string;
  confidence: number;
};

type Scenario = {
  id: string;
  name: string;
  status: ScenarioStatus;
  description: string;
  cost: string;
  delta: string;
  days: number;
  risk: number;
  ratio: string;
  highlight: string;
  roles: RoleAssignment[];
};

const scenarios: Scenario[] = [
  {
    id: "current",
    name: "Current State",
    status: "current",
    description: "The live org chart with a mostly human operating model.",
    cost: "$18,900/mo",
    delta: "Baseline",
    days: 0,
    risk: 42,
    ratio: "78% human / 22% agent",
    highlight: "Read-only baseline for comparison.",
    roles: [
      { role: "Support Specialist", department: "Support", chosen: "Human", monthlyCost: "$4,800", confidence: 68 },
      { role: "Content Operations", department: "Marketing", chosen: "Human", monthlyCost: "$5,200", confidence: 61 },
      { role: "Finance Analyst", department: "Finance", chosen: "Open", monthlyCost: "$0", confidence: 54 },
    ],
  },
  {
    id: "support-agent",
    name: "Support Agent Shift",
    status: "recommended",
    description: "Moves level-1 triage and knowledge-base replies into a ready agent queue.",
    cost: "$14,600/mo",
    delta: "-$4,300 vs current",
    days: 12,
    risk: 28,
    ratio: "52% human / 48% agent",
    highlight: "Saves about $4,300 per month.",
    roles: [
      {
        role: "Senior Support Specialist",
        department: "Support",
        chosen: "Ready Agent",
        monthlyCost: "$1,900",
        confidence: 91,
      },
      { role: "Support Quality Lead", department: "Support", chosen: "Human", monthlyCost: "$6,400", confidence: 82 },
      {
        role: "Ticket Routing Agent",
        department: "Support",
        chosen: "Ready Agent",
        monthlyCost: "$850",
        confidence: 88,
      },
    ],
  },
  {
    id: "growth-q4",
    name: "Q4 Growth Plan",
    status: "draft",
    description: "Adds two human roles and one custom agent across sales and marketing.",
    cost: "$22,400/mo",
    delta: "+18% vs current",
    days: 34,
    risk: 57,
    ratio: "64% human / 36% agent",
    highlight: "Expands revenue coverage and campaign output together.",
    roles: [
      { role: "Outbound SDR", department: "Sales", chosen: "Human", monthlyCost: "$5,900", confidence: 74 },
      { role: "RevOps Agent", department: "Sales", chosen: "Custom Agent", monthlyCost: "$2,400", confidence: 80 },
      { role: "Campaign Specialist", department: "Marketing", chosen: "Human", monthlyCost: "$5,600", confidence: 69 },
    ],
  },
  {
    id: "finance-automation",
    name: "Finance Analyst Gap",
    status: "applied",
    description: "Closes an analyst vacancy with a reporting agent and human approval flow.",
    cost: "$16,200/mo",
    delta: "-14% vs current",
    days: 18,
    risk: 36,
    ratio: "60% human / 40% agent",
    highlight: "Shortens monthly close by two days.",
    roles: [
      { role: "Finance Analyst", department: "Finance", chosen: "Ready Agent", monthlyCost: "$1,450", confidence: 86 },
      { role: "Finance Controller", department: "Finance", chosen: "Human", monthlyCost: "$7,200", confidence: 76 },
      {
        role: "Variance Monitor",
        department: "Finance",
        chosen: "Custom Agent",
        monthlyCost: "$1,100",
        confidence: 81,
      },
    ],
  },
];

const kpis = [
  {
    label: "Planned Monthly Cost",
    value: "$14,600",
    change: "-22.7% vs current",
    icon: CircleDollarSign,
    tone: "text-emerald-600",
  },
  {
    label: "Human / Agent Mix",
    value: "52 / 48",
    change: "Agent share +26 pts",
    icon: Users,
    tone: "text-sky-600",
  },
  {
    label: "Avg. Time to Launch",
    value: "12 days",
    change: "21 days faster than hiring",
    icon: Clock3,
    tone: "text-orange-500",
  },
  {
    label: "Confidence Score",
    value: "72/100",
    change: "Low-risk recommendation",
    icon: ShieldCheck,
    tone: "text-violet-600",
  },
];

export default function Page() {
  const [selectedIds, setSelectedIds] = useState(["current", "support-agent"]);

  const selectedScenarios = useMemo(
    () => scenarios.filter((scenario) => selectedIds.includes(scenario.id)),
    [selectedIds],
  );

  function toggleScenario(id: string, checked: boolean) {
    setSelectedIds((current) => (checked ? [...new Set([...current, id])] : current.filter((item) => item !== id)));
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <span>Dashboard</span>
            <ChevronRight className="size-3" />
            <span>Org Planning</span>
          </div>
          <h1 className="mt-1 text-2xl tracking-tight">Scenarios</h1>
          <p className="mt-1 max-w-2xl text-muted-foreground text-sm">
            Compare human, ready-agent, and custom-agent options before applying a plan to the org chart.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Tabs defaultValue="quarter">
            <TabsList>
              <TabsTrigger value="quarter">Quarter</TabsTrigger>
              <TabsTrigger value="six">6 Months</TabsTrigger>
              <TabsTrigger value="year">1 Year</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button size="icon-sm" variant="outline" aria-label="Cost assumptions">
            <Settings />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus /> New Scenario
              </Button>
            </DialogTrigger>
            <NewScenarioDialog />
          </Dialog>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi, index) => (
          <KpiCard key={kpi.label} {...kpi} index={index} />
        ))}
      </div>

      <div>
        <Tabs defaultValue="cards" className="min-w-0">
          <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <TabsList>
              <TabsTrigger value="cards">
                <Grid2X2 /> Cards
              </TabsTrigger>
              <TabsTrigger value="table">
                <Table2 /> Table
              </TabsTrigger>
            </TabsList>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{selectedIds.length} selected</Badge>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" disabled={selectedIds.length < 2}>
                    <GitCompare /> Compare
                  </Button>
                </DialogTrigger>
                <CompareDialog scenarios={selectedScenarios} />
              </Dialog>
            </div>
          </div>

          <TabsContent value="cards" className="mt-0">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {scenarios.map((scenario) => (
                <ScenarioCard
                  key={scenario.id}
                  scenario={scenario}
                  selected={selectedIds.includes(scenario.id)}
                  onCheckedChange={(checked) => toggleScenario(scenario.id, checked)}
                />
              ))}
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="min-h-56 rounded-2xl border border-dashed p-5 text-left shadow-sm transition hover:border-sky-400 hover:bg-sky-50/40 dark:hover:bg-sky-500/5"
                  >
                    <div className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <Plus className="size-4" />
                    </div>
                    <div className="mt-4 font-medium">Create scenario</div>
                    <p className="mt-1 max-w-xs text-muted-foreground text-sm">
                      Start from the current chart or let the system generate a recommendation.
                    </p>
                  </button>
                </DialogTrigger>
                <NewScenarioDialog />
              </Dialog>
            </div>
          </TabsContent>

          <TabsContent value="table" className="mt-0">
            <Card className="overflow-hidden rounded-2xl shadow-sm">
              <CardContent className="p-0">
                <div className="overflow-auto">
                  <table className="w-full min-w-[760px] text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="sticky left-0 bg-background p-3 text-left font-medium">Role</th>
                        {scenarios.map((scenario) => (
                          <th key={scenario.id} className="p-3 text-left font-medium">
                            {scenario.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {["Support Specialist", "Finance Analyst", "RevOps Agent"].map((role) => (
                        <tr key={role} className="border-b last:border-0">
                          <td className="sticky left-0 bg-background p-3 font-medium">{role}</td>
                          {scenarios.map((scenario) => {
                            const assignment =
                              scenario.roles.find((item) => item.role.includes(role.split(" ")[0])) ??
                              scenario.roles[0];
                            return (
                              <td key={`${scenario.id}-${role}`} className="p-3">
                                <Badge
                                  variant="secondary"
                                  className={assignment.chosen === "Ready Agent" ? "bg-sky-100 text-sky-700" : ""}
                                >
                                  {assignment.chosen}
                                </Badge>
                                <div className="mt-1 text-muted-foreground text-xs">{assignment.monthlyCost}</div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {selectedIds.length > 1 ? (
        <div className="sticky bottom-4 z-10 mx-auto flex w-fit items-center gap-3 rounded-full border bg-background px-3 py-2 shadow-md">
          <div className="text-sm">
            <span className="font-medium">{selectedIds.length} scenarios</span> selected
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="rounded-full">
                Compare
              </Button>
            </DialogTrigger>
            <CompareDialog scenarios={selectedScenarios} />
          </Dialog>
        </div>
      ) : null}
    </div>
  );
}

function KpiCard({
  label,
  value,
  change,
  icon: Icon,
  tone,
  index,
}: {
  label: string;
  value: string;
  change: string;
  icon: typeof CircleDollarSign;
  tone: string;
  index: number;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Card className="cursor-pointer rounded-2xl shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
          <CardContent className="grid gap-3 p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 font-medium text-sm">
                <span className={`flex size-6 items-center justify-center rounded-md bg-muted ${tone}`}>
                  <Icon className="size-4" />
                </span>
                {label}
              </div>
              <KpiMenu />
            </div>
            <div>
              <div className="font-semibold text-2xl tracking-tight">{value}</div>
              <div className={`mt-0.5 text-xs ${tone}`}>{change}</div>
            </div>
            {renderKpiVisual(index, tone)}
          </CardContent>
        </Card>
      </SheetTrigger>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Cost Breakdown</SheetTitle>
          <SheetDescription>Assumptions, trends, and cost mix for {label.toLowerCase()}.</SheetDescription>
        </SheetHeader>
        <div className="grid gap-3 px-4">
          {["Human payroll", "Tokens and infrastructure", "Development and maintenance", "Consulting"].map(
            (item, itemIndex) => (
              <div key={item} className="rounded-lg border p-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="font-medium">{item}</div>
                  <Badge variant="secondary">{["$9,800", "$2,150", "$1,700", "$950"][itemIndex]}</Badge>
                </div>
                <Sparkline
                  tone={["text-sky-600", "text-violet-600", "text-emerald-600", "text-orange-500"][itemIndex]}
                />
              </div>
            ),
          )}
          <Button>Update assumptions</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function ScenarioCard({
  scenario,
  selected,
  onCheckedChange,
}: {
  scenario: Scenario;
  selected: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  const isRecommended = scenario.status === "recommended";
  const isCurrent = scenario.status === "current";
  const cardTone = getScenarioCardTone(isRecommended, isCurrent);

  return (
    <Sheet>
      <Card
        className={`overflow-hidden rounded-2xl pt-0 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${cardTone}`}
      >
        <div className={getScenarioArtwork(scenario.status)} />
        <CardContent className="grid min-h-[310px] gap-4 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <Checkbox
                checked={selected}
                onCheckedChange={(checked) => onCheckedChange(Boolean(checked))}
                aria-label={`Select ${scenario.name}`}
              />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle className="truncate text-base">{scenario.name}</CardTitle>
                  <StatusBadge status={scenario.status} />
                </div>
                <CardDescription className="mt-1 line-clamp-2">{scenario.description}</CardDescription>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon-sm" variant="ghost" aria-label={`${scenario.name} menu`}>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                <DropdownMenuItem>Rename</DropdownMenuItem>
                <DropdownMenuItem>Apply</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="font-semibold text-2xl tracking-tight">{scenario.cost}</div>
              <div
                className={
                  scenario.delta.startsWith("-") ? "text-emerald-600 text-xs" : "text-muted-foreground text-xs"
                }
              >
                {scenario.delta}
              </div>
            </div>
            <SheetTrigger asChild>
              <Button size="sm" variant="outline" className="rounded-full px-5">
                Details
              </Button>
            </SheetTrigger>
          </div>

          <Separator />
          <div className="grid gap-1.5 text-xs">
            <ChecklistItem>{scenario.roles.filter((role) => role.chosen === "Human").length} human roles</ChecklistItem>
            <ChecklistItem>
              {scenario.roles.filter((role) => role.chosen === "Ready Agent").length} ready agents
            </ChecklistItem>
            <ChecklistItem>
              {scenario.roles.filter((role) => role.chosen === "Custom Agent").length} custom agents
            </ChecklistItem>
            <ChecklistItem>Launch estimate: {scenario.days} days</ChecklistItem>
            <ChecklistItem>Risk: {getRiskLabel(scenario.risk)}</ChecklistItem>
          </div>
        </CardContent>
      </Card>
      <ScenarioSheet scenario={scenario} />
    </Sheet>
  );
}

function ScenarioSheet({ scenario }: { scenario: Scenario }) {
  return (
    <SheetContent className="sm:max-w-[520px]">
      <SheetHeader>
        <div className="flex items-center gap-2">
          <SheetTitle>{scenario.name}</SheetTitle>
          <StatusBadge status={scenario.status} />
        </div>
        <SheetDescription>{scenario.description}</SheetDescription>
      </SheetHeader>
      <div className="px-4">
        <Tabs defaultValue="summary">
          <TabsList className="w-full overflow-x-auto">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="cost">Cost</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>
          <TabsContent value="summary" className="mt-4 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Metric label="Total cost" value={scenario.cost} />
              <Metric label="Delta vs current" value={scenario.delta} />
              <Metric label="Launch time" value={`${scenario.days} days`} />
              <Metric label="Human / Agent" value={scenario.ratio} />
            </div>
            <div className="rounded-lg border p-3">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span>Risk score</span>
                <span>{scenario.risk}/100</span>
              </div>
              <Progress value={scenario.risk} />
              <p className="mt-3 text-muted-foreground text-sm">
                {scenario.highlight} The model recalculates this scenario weekly when assumptions drift.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="roles" className="mt-4 space-y-3">
            {scenario.roles.map((role) => (
              <RoleComparison key={`${scenario.id}-${role.role}`} role={role} />
            ))}
          </TabsContent>
          <TabsContent value="cost" className="mt-4 space-y-3">
            {["Payroll and benefits", "Tokens / API / infrastructure", "Dev team maintenance", "Consulting"].map(
              (item, index) => (
                <div key={item} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>{item}</span>
                    <span className="font-medium">{["$9,800", "$2,150", "$1,700", "$950"][index]}</span>
                  </div>
                  <Progress className="mt-3" value={[68, 42, 28, 18][index]} />
                </div>
              ),
            )}
          </TabsContent>
          <TabsContent value="timeline" className="mt-4 space-y-3">
            {["Agent setup", "Hiring process", "Custom agent sprints"].map((item, index) => (
              <div key={item} className="rounded-lg border p-3">
                <div className="flex items-center justify-between text-sm">
                  <span>{item}</span>
                  <span>{[8, 34, 21][index]} days</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-sky-500" style={{ width: `${[35, 82, 58][index]}%` }} />
                </div>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="notes" className="mt-4 space-y-3">
            <div className="rounded-lg border p-3">
              <div className="font-medium">Aylin Kaya</div>
              <p className="mt-2 text-muted-foreground text-sm">
                The ready-agent option is sensible for support. Keep QA approval with a human lead.
              </p>
            </div>
            <Input placeholder="Add a comment..." />
          </TabsContent>
        </Tabs>
      </div>
      <SheetFooter className="flex-row justify-between gap-2 border-t">
        <Button variant="outline">
          <Copy /> Duplicate
        </Button>
        <Button>
          <Send /> Apply Scenario
        </Button>
      </SheetFooter>
    </SheetContent>
  );
}

function RoleComparison({ role }: { role: RoleAssignment }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className="w-full rounded-lg border p-3 text-left transition hover:border-sky-400 hover:bg-muted/20"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="font-medium">{role.role}</div>
              <div className="text-muted-foreground text-sm">{role.department}</div>
            </div>
            <Badge variant="secondary">{role.chosen}</Badge>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span>{role.monthlyCost}/mo</span>
            <span className="text-emerald-600">{role.confidence}% fit</span>
          </div>
        </button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>{role.role}</SheetTitle>
          <SheetDescription>
            Compare human, ready-agent, and custom-agent options for {role.department}.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-3 px-4 md:grid-cols-3">
          {[
            { title: "Human", icon: UserRound, cost: "$5,900/mo", score: 74, detail: "34-day hire" },
            { title: "Ready Agent", icon: Bot, cost: "$1,900/mo", score: 91, detail: "8-day setup" },
            { title: "Custom Agent", icon: RadioTower, cost: "$2,400/mo", score: 83, detail: "3 sprints + advisor" },
          ].map((option) => (
            <div
              key={option.title}
              className={`rounded-lg border p-3 ${option.title === role.chosen ? "border-sky-500 ring-2 ring-sky-500/10" : ""}`}
            >
              <div className="flex items-center justify-between">
                <option.icon className="size-5" />
                {option.score > 88 ? <Badge className="bg-orange-100 text-orange-700">Recommended</Badge> : null}
              </div>
              <div className="mt-3 font-semibold">{option.title}</div>
              <div className="mt-1 font-semibold text-xl">{option.cost}</div>
              <div className="mt-1 text-muted-foreground text-sm">{option.detail}</div>
              <Progress className="mt-3" value={option.score} />
              <div className="mt-2 text-muted-foreground text-xs">Fit score {option.score}/100</div>
            </div>
          ))}
        </div>
        <div className="mx-4 rounded-lg border p-3">
          <div className="font-medium">Why this recommendation?</div>
          <p className="mt-2 text-muted-foreground text-sm">
            The role has repetitive work, low error cost, and limited approval points, so a ready agent gives the best
            balance.
          </p>
        </div>
        <SheetFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Save Selection</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function NewScenarioDialog() {
  return (
    <DialogContent className="sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle>Create Scenario</DialogTitle>
        <DialogDescription>Start a new org planning scenario in three quick steps.</DialogDescription>
      </DialogHeader>
      <div className="grid gap-4">
        <div className="flex justify-center gap-2">
          {[1, 2, 3].map((step) => (
            <div key={step} className={`h-2 rounded-full ${step === 1 ? "w-10 bg-sky-500" : "w-2 bg-muted"}`} />
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input placeholder="Scenario name" defaultValue="Q4 Agent Support Plan" />
          <Input placeholder="Target period" defaultValue="Jul 2026 - Dec 2026" />
        </div>
        <Input placeholder="Description" defaultValue="Replan support and finance with an agent-first model." />
        <div className="grid gap-3 sm:grid-cols-2">
          <ChoiceCard
            title="Let the system suggest"
            description="Analyze the org chart and prefill the roles."
            active
          />
          <ChoiceCard title="Build manually" description="Start with an empty role list." />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline">Back</Button>
        <Button>Create Scenario</Button>
      </DialogFooter>
    </DialogContent>
  );
}

function CompareDialog({ scenarios: items }: { scenarios: Scenario[] }) {
  return (
    <DialogContent className="max-h-[90dvh] overflow-auto sm:max-w-5xl">
      <DialogHeader>
        <DialogTitle>Compare Scenarios</DialogTitle>
        <DialogDescription>
          Review selected scenarios side by side across cost, timing, risk, and role decisions.
        </DialogDescription>
      </DialogHeader>
      <div className="overflow-auto rounded-lg border">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-left">Metric</th>
              {items.map((scenario) => (
                <th key={scenario.id} className="p-3 text-left">
                  {scenario.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["Total Cost", "cost"],
              ["Human / Agent Mix", "ratio"],
              ["Launch Time", "days"],
              ["Risk Score", "risk"],
              ["Summary", "highlight"],
            ].map(([label, key]) => (
              <tr key={label} className="border-b last:border-0">
                <td className="p-3 font-medium">{label}</td>
                {items.map((scenario) => (
                  <td key={`${scenario.id}-${key}`} className="p-3">
                    {key === "days" ? `${scenario.days} days` : String(scenario[key as keyof Scenario])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <DialogFooter>
        <Button variant="outline">Close</Button>
        <Button>Apply Selected Scenario</Button>
      </DialogFooter>
    </DialogContent>
  );
}

function StatusBadge({ status }: { status: ScenarioStatus }) {
  const config = {
    current: { label: "Current", className: "bg-muted text-muted-foreground" },
    recommended: { label: "Recommended", className: "bg-orange-100 text-orange-700" },
    draft: { label: "Draft", className: "bg-slate-100 text-slate-700" },
    applied: { label: "Applied", className: "bg-emerald-100 text-emerald-700" },
  }[status];

  return (
    <Badge variant="secondary" className={config.className}>
      {config.label}
    </Badge>
  );
}

function ChecklistItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Check className="size-3.5 text-emerald-500" />
      <span>{children}</span>
    </div>
  );
}

function KpiMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon-sm" variant="ghost" aria-label="KPI menu">
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>View details</DropdownMenuItem>
        <DropdownMenuItem>Edit assumptions</DropdownMenuItem>
        <DropdownMenuItem>Export</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function renderKpiVisual(index: number, tone: string) {
  if (index === 1) return <MiniDonut />;
  if (index === 3) return <Gauge value={72} />;

  return <Sparkline tone={tone} />;
}

function getScenarioCardTone(isRecommended: boolean, isCurrent: boolean) {
  if (isRecommended) return "border-sky-500 ring-2 ring-sky-500/10";
  if (isCurrent) return "border-muted";

  return "";
}

function getScenarioArtwork(status: ScenarioStatus) {
  if (status === "recommended") {
    return "h-20 bg-[radial-gradient(circle_at_60%_40%,#ff9f1c_0%,#ffcf5f_20%,#ff8bc3_38%,#70c7ff_65%,#7aa7ff_100%)]";
  }

  if (status === "current") {
    return "h-20 bg-[linear-gradient(135deg,#7c83ff_0%,#d9b4ff_30%,#f8fbff_58%,#5cc8ff_100%)]";
  }

  if (status === "applied") {
    return "h-20 bg-[linear-gradient(135deg,#34d399_0%,#a7f3d0_38%,#f0fdf4_62%,#38bdf8_100%)]";
  }

  return "h-20 bg-[linear-gradient(135deg,#cbd5e1_0%,#f8fafc_45%,#ddd6fe_100%)]";
}

function getRiskLabel(risk: number) {
  if (risk < 35) return "Low";
  if (risk < 55) return "Medium";

  return "High";
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-3">
      <div className="text-muted-foreground text-sm">{label}</div>
      <div className="mt-1 font-medium">{value}</div>
    </div>
  );
}

function ChoiceCard({ title, description, active = false }: { title: string; description: string; active?: boolean }) {
  return (
    <button type="button" className={`rounded-lg border p-4 text-left ${active ? "border-sky-500 bg-sky-500/5" : ""}`}>
      <div className="font-medium">{title}</div>
      <p className="mt-2 text-muted-foreground text-sm">{description}</p>
    </button>
  );
}

function Sparkline({ tone }: { tone: string }) {
  const bars = [
    { id: "m1", height: 28 },
    { id: "m2", height: 44 },
    { id: "m3", height: 34 },
    { id: "m4", height: 58 },
    { id: "m5", height: 42 },
    { id: "m6", height: 68 },
    { id: "m7", height: 52 },
    { id: "m8", height: 76 },
  ];

  return (
    <div className="flex h-10 items-end gap-1">
      {bars.map((bar) => (
        <div
          key={bar.id}
          className={`w-full rounded-t-sm bg-current/70 ${tone}`}
          style={{ height: `${bar.height}%` }}
        />
      ))}
    </div>
  );
}

function MiniDonut() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-12 place-items-center rounded-full bg-[conic-gradient(#2563eb_0_52%,#8b5cf6_52%_100%)]">
        <div className="grid size-8 place-items-center rounded-full bg-background font-medium text-xs">52%</div>
      </div>
      <div className="grid gap-1 text-muted-foreground text-xs">
        <span className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-sky-600" /> Human
        </span>
        <span className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-violet-500" /> Agent
        </span>
      </div>
    </div>
  );
}

function Gauge({ value }: { value: number }) {
  return (
    <div className="grid gap-2">
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#22c55e,#f59e0b,#ef4444)]"
          style={{ width: `${value}%` }}
        />
      </div>
      <div className="flex justify-between text-muted-foreground text-xs">
        <span>Low</span>
        <span>Medium</span>
        <span>High</span>
      </div>
    </div>
  );
}
