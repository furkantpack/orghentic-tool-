"use client";

import { useMemo, useState } from "react";

import {
  Activity,
  ArrowDown,
  ArrowUp,
  Bot,
  CalendarClock,
  Cpu,
  Download,
  Gauge,
  MoreHorizontal,
  Settings2,
  SlidersHorizontal,
  Users,
  Zap,
} from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ForecastMode = "cost" | "tokens" | "energy";
type ResourceTab = "tokens" | "energy" | "hours" | "devDays" | "cost";

type DualMetric = {
  title: string;
  description: string;
  resourceLabel: string;
  resourceValue: string;
  resourceTrend: string;
  costValue: string;
  unitPrice: string;
  accent: string;
  icon: typeof Activity;
};

type Department = {
  name: string;
  humans: number;
  agents: number;
  tokens: number;
  tokenLabel: string;
  energy: string;
  totalCost: string;
  budget: string;
  variance: string;
};

type AgentUsage = {
  name: string;
  model: string;
  tokens: string;
  compute: string;
  unitPrice: string;
  totalCost: string;
  efficiency: string;
  trend: string;
};

const metrics: DualMetric[] = [
  {
    title: "Total Resource Use",
    description: "Unified view across tokens, compute, human hours, and dev days.",
    resourceLabel: "Resource score",
    resourceValue: "84.2",
    resourceTrend: "+6.4% vs last period",
    costValue: "TRY 4.82M",
    unitPrice: "weighted blended unit price",
    accent: "bg-sky-500",
    icon: Gauge,
  },
  {
    title: "Human Capacity",
    description: "Worked hours converted into payroll cost.",
    resourceLabel: "Worked hours",
    resourceValue: "12,480 h",
    resourceTrend: "+2.1% vs last period",
    costValue: "TRY 3.74M",
    unitPrice: "TRY 299.7 / hour",
    accent: "bg-sky-500",
    icon: Users,
  },
  {
    title: "Agent Tokens & Energy",
    description: "Token volume and compute consumption behind agent spend.",
    resourceLabel: "Tokens + compute",
    resourceValue: "59.5M + 340 kWh",
    resourceTrend: "+18.5% tokens",
    costValue: "TRY 286K",
    unitPrice: "TRY 0.0048 / 1K tokens",
    accent: "bg-violet-500",
    icon: Bot,
  },
  {
    title: "Dev & Consulting",
    description: "Implementation effort behind custom agent workflows.",
    resourceLabel: "Delivery capacity",
    resourceValue: "17 dev-wk + 3 advisor-wk",
    resourceTrend: "-7.8% vs last period",
    costValue: "TRY 794K",
    unitPrice: "TRY 39.7K / person-week",
    accent: "bg-emerald-500",
    icon: CalendarClock,
  },
  {
    title: "Value per Resource",
    description: "How much useful work each unit of agent cost produces.",
    resourceLabel: "Efficiency ratio",
    resourceValue: "1 TRY = 0.42 human-hour",
    resourceTrend: "+9.6% efficiency",
    costValue: "resource-positive",
    unitPrice: "8.1 tasks / 1K tokens at best agent",
    accent: "bg-orange-400",
    icon: Activity,
  },
];

const resourceTabs: Record<ResourceTab, { label: string; value: string; detail: string; sparkline: number[] }> = {
  tokens: { label: "Tokens", value: "59.5M", detail: "+18.5% usage", sparkline: [28, 42, 36, 58, 50, 72, 66, 84] },
  energy: { label: "Energy", value: "340 kWh", detail: "+11.2% compute", sparkline: [22, 30, 44, 38, 52, 48, 62, 70] },
  hours: {
    label: "Human Hours",
    value: "12,480 h",
    detail: "+2.1% capacity",
    sparkline: [64, 60, 66, 62, 68, 70, 67, 72],
  },
  devDays: { label: "Dev Days", value: "85 days", detail: "-7.8% effort", sparkline: [78, 72, 70, 62, 58, 55, 48, 44] },
  cost: { label: "Cost", value: "TRY 4.82M", detail: "+4.2% spend", sparkline: [36, 40, 46, 52, 50, 60, 64, 68] },
};

const resourceOptions: { label: string; value: ResourceTab }[] = [
  { label: "Token", value: "tokens" },
  { label: "kWh", value: "energy" },
  { label: "Hours", value: "hours" },
  { label: "Dev", value: "devDays" },
  { label: "TRY", value: "cost" },
];

const departments: Department[] = [
  {
    name: "Engineering",
    humans: 68,
    agents: 9,
    tokens: 24.1,
    tokenLabel: "24.1M",
    energy: "118 kWh",
    totalCost: "TRY 1.84M",
    budget: "TRY 1.75M",
    variance: "+5.1%",
  },
  {
    name: "Operations",
    humans: 34,
    agents: 11,
    tokens: 41.2,
    tokenLabel: "41.2M",
    energy: "205 kWh",
    totalCost: "TRY 740K",
    budget: "TRY 820K",
    variance: "-9.8%",
  },
  {
    name: "Marketing",
    humans: 22,
    agents: 4,
    tokens: 11.8,
    tokenLabel: "11.8M",
    energy: "64 kWh",
    totalCost: "TRY 510K",
    budget: "TRY 480K",
    variance: "+6.3%",
  },
  {
    name: "Finance",
    humans: 16,
    agents: 3,
    tokens: 8.4,
    tokenLabel: "8.4M",
    energy: "39 kWh",
    totalCost: "TRY 420K",
    budget: "TRY 390K",
    variance: "+7.7%",
  },
];

const agents: AgentUsage[] = [
  {
    name: "Ops Agent",
    model: "GPT-4.1",
    tokens: "18.4M",
    compute: "42 GPU-h",
    unitPrice: "TRY 0.005",
    totalCost: "TRY 92K",
    efficiency: "3.2 tasks",
    trend: "+12%",
  },
  {
    name: "Research Agent",
    model: "Claude",
    tokens: "8.2M",
    compute: "19 GPU-h",
    unitPrice: "TRY 0.0054",
    totalCost: "TRY 44K",
    efficiency: "5.8 tasks",
    trend: "-4%",
  },
  {
    name: "Support Triage",
    model: "GPT-4.1 mini",
    tokens: "32.9M",
    compute: "28 GPU-h",
    unitPrice: "TRY 0.0023",
    totalCost: "TRY 76K",
    efficiency: "8.1 tasks",
    trend: "+21%",
  },
];

const projects = [
  {
    name: "Procurement Flow",
    type: "Internal Team",
    duration: "8 weeks",
    resource: "2 devs x 8 weeks",
    totalResource: "16 person-weeks",
    cost: "TRY 310K",
    unit: "TRY 19.4K / person-week",
    status: "In progress",
  },
  {
    name: "Payroll Connector",
    type: "Consultant",
    duration: "3 weeks",
    resource: "TRY 4,270 / hour x 30 h",
    totalResource: "30 advisor-hours",
    cost: "TRY 128K",
    unit: "fixed connector review",
    status: "Done",
  },
  {
    name: "Agent Evaluation",
    type: "Internal Team",
    duration: "6 weeks",
    resource: "2 devs x 6 weeks",
    totalResource: "12 person-weeks",
    cost: "TRY 220K",
    unit: "TRY 18.3K / person-week",
    status: "In progress",
  },
];

const forecastData = [
  {
    month: "Jan",
    human: 245,
    agent: 54,
    dev: 48,
    consultant: 26,
    input: 18,
    output: 8,
    cached: 4,
    compute: 22,
    cooling: 5,
    network: 3,
  },
  {
    month: "Feb",
    human: 252,
    agent: 58,
    dev: 52,
    consultant: 24,
    input: 20,
    output: 9,
    cached: 5,
    compute: 24,
    cooling: 6,
    network: 3,
  },
  {
    month: "Mar",
    human: 258,
    agent: 64,
    dev: 55,
    consultant: 29,
    input: 23,
    output: 11,
    cached: 6,
    compute: 27,
    cooling: 6,
    network: 4,
  },
  {
    month: "Apr",
    human: 262,
    agent: 62,
    dev: 51,
    consultant: 22,
    input: 22,
    output: 10,
    cached: 7,
    compute: 26,
    cooling: 6,
    network: 4,
  },
  {
    month: "May",
    human: 270,
    agent: 71,
    dev: 58,
    consultant: 25,
    input: 26,
    output: 12,
    cached: 8,
    compute: 30,
    cooling: 7,
    network: 4,
  },
  {
    month: "Jun",
    human: 278,
    agent: 78,
    dev: 61,
    consultant: 28,
    input: 29,
    output: 14,
    cached: 9,
    compute: 34,
    cooling: 8,
    network: 5,
  },
  {
    month: "Jul",
    human: 286,
    agent: 86,
    dev: 64,
    consultant: 31,
    input: 33,
    output: 16,
    cached: 11,
    compute: 38,
    cooling: 9,
    network: 5,
  },
  {
    month: "Aug",
    human: 292,
    agent: 94,
    dev: 68,
    consultant: 27,
    input: 37,
    output: 18,
    cached: 11,
    compute: 42,
    cooling: 9,
    network: 6,
  },
  {
    month: "Sep",
    human: 298,
    agent: 101,
    dev: 70,
    consultant: 30,
    input: 39,
    output: 19,
    cached: 12,
    compute: 45,
    cooling: 10,
    network: 6,
  },
  {
    month: "Oct",
    human: 305,
    agent: 109,
    dev: 73,
    consultant: 34,
    input: 42,
    output: 21,
    cached: 13,
    compute: 49,
    cooling: 11,
    network: 6,
  },
  {
    month: "Nov",
    human: 312,
    agent: 118,
    dev: 76,
    consultant: 32,
    input: 46,
    output: 23,
    cached: 15,
    compute: 53,
    cooling: 12,
    network: 7,
  },
  {
    month: "Dec",
    human: 320,
    agent: 128,
    dev: 81,
    consultant: 36,
    input: 50,
    output: 25,
    cached: 16,
    compute: 58,
    cooling: 13,
    network: 7,
  },
];

const costChartConfig = {
  human: { label: "Human", color: "var(--color-sky-500)" },
  agent: { label: "Agent", color: "var(--color-violet-500)" },
  dev: { label: "Dev team", color: "var(--color-emerald-500)" },
  consultant: { label: "Consultant", color: "var(--color-orange-400)" },
} satisfies ChartConfig;

const tokenChartConfig = {
  input: { label: "Input tokens", color: "var(--color-violet-500)" },
  output: { label: "Output tokens", color: "var(--color-fuchsia-500)" },
  cached: { label: "Cached tokens", color: "var(--color-sky-500)" },
} satisfies ChartConfig;

const energyChartConfig = {
  compute: { label: "Compute", color: "var(--color-emerald-500)" },
  cooling: { label: "Cooling", color: "var(--color-cyan-500)" },
  network: { label: "Network", color: "var(--color-amber-500)" },
} satisfies ChartConfig;

export default function Page() {
  const [resourceTab, setResourceTab] = useState<ResourceTab>("tokens");
  const [forecastMode, setForecastMode] = useState<ForecastMode>("cost");
  const [sortByTokens, setSortByTokens] = useState(false);

  const departmentRows = useMemo(() => {
    if (!sortByTokens) return departments;

    return [...departments].sort((a, b) => b.tokens - a.tokens);
  }, [sortByTokens]);

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <span>Dashboard</span>
            <span>/</span>
            <span>Finance v2</span>
          </div>
          <h1 className="mt-1 text-2xl tracking-tight">Finance v2</h1>
          <p className="mt-1 max-w-2xl text-muted-foreground text-sm">
            Track both resource consumption and the cost it creates across humans, agents, compute, development, and
            consulting.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Tabs defaultValue="monthly">
            <TabsList>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button size="sm" variant="outline">
            <Download /> Report
          </Button>
          <ResourceLimitDialog>
            <Button size="sm">
              <Settings2 /> Set Limit
            </Button>
          </ResourceLimitDialog>
        </div>
      </div>

      <div className="grid gap-3">
        <TotalResourceCard resourceTab={resourceTab} setResourceTab={setResourceTab} />
        <div className="grid items-stretch gap-3 lg:grid-cols-3">
          {metrics.slice(1, 4).map((metric) => (
            <DualMetricCard key={metric.title} metric={metric} />
          ))}
        </div>
      </div>

      <Card className="rounded-lg shadow-none">
        <CardHeader className="flex flex-col gap-3 p-4 pb-2 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <CardTitle className="text-base">Stacked Cost & Resource Forecast</CardTitle>
            <CardDescription>Switch the same forecast between cost, token, and energy views.</CardDescription>
          </div>
          <Tabs value={forecastMode} onValueChange={(value) => setForecastMode(value as ForecastMode)}>
            <TabsList>
              <TabsTrigger value="cost">Cost</TabsTrigger>
              <TabsTrigger value="tokens">Token</TabsTrigger>
              <TabsTrigger value="energy">Energy</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <ForecastChart mode={forecastMode} />
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="rounded-lg shadow-none xl:col-span-2">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base">Department Cost & Resource Table</CardTitle>
            <CardDescription>Click Token Usage to sort departments by consumption.</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead>Humans</TableHead>
                  <TableHead>Agents</TableHead>
                  <TableHead>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1"
                      onClick={() => setSortByTokens((value) => !value)}
                    >
                      Token Usage
                      {sortByTokens ? <ArrowDown className="size-3" /> : <ArrowUp className="size-3" />}
                    </button>
                  </TableHead>
                  <TableHead>Energy</TableHead>
                  <TableHead>Total Cost</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Variance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departmentRows.map((row) => (
                  <DepartmentDrawer key={row.name} department={row}>
                    <TableRow className="cursor-pointer">
                      <TableCell className="font-medium">{row.name}</TableCell>
                      <TableCell>{row.humans}</TableCell>
                      <TableCell>{row.agents}</TableCell>
                      <TableCell>{row.tokenLabel}</TableCell>
                      <TableCell>{row.energy}</TableCell>
                      <TableCell>{row.totalCost}</TableCell>
                      <TableCell>{row.budget}</TableCell>
                      <TableCell className={row.variance.startsWith("+") ? "text-destructive" : "text-emerald-600"}>
                        {row.variance}
                      </TableCell>
                    </TableRow>
                  </DepartmentDrawer>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="rounded-lg shadow-none">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base">Next Month Forecast</CardTitle>
            <CardDescription>Limit-aware budget warning.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-4 pt-2">
            <div className="mx-auto flex size-36 items-center justify-center rounded-full border-[16px] border-sky-500">
              <div className="text-center">
                <div className="font-semibold text-2xl">+6.8%</div>
                <div className="text-muted-foreground text-xs">projected</div>
              </div>
            </div>
            <div className="rounded-lg border p-3 text-sm">
              Agent token growth will breach the current monthly cap unless usage stays below 59M tokens.
            </div>
            <ResourceLimitDialog>
              <Button className="w-full" variant="outline">
                <SlidersHorizontal /> Set Resource Limit
              </Button>
            </ResourceLimitDialog>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-lg shadow-none">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-base">Token & Agent Resource Detail</CardTitle>
          <CardDescription>Model-level token, compute, unit price, cost, and efficiency trend.</CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Monthly Tokens</TableHead>
                <TableHead>Compute</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Total Cost</TableHead>
                <TableHead>Efficiency</TableHead>
                <TableHead>Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agents.map((agent) => (
                <AgentDrawer key={agent.name} agent={agent}>
                  <TableRow className="cursor-pointer">
                    <TableCell className="font-medium">{agent.name}</TableCell>
                    <TableCell>{agent.model}</TableCell>
                    <TableCell>{agent.tokens}</TableCell>
                    <TableCell>{agent.compute}</TableCell>
                    <TableCell>{agent.unitPrice}</TableCell>
                    <TableCell>{agent.totalCost}</TableCell>
                    <TableCell>{agent.efficiency}/1K token</TableCell>
                    <TableCell>
                      <Badge variant="outline">{agent.trend}</Badge>
                    </TableCell>
                  </TableRow>
                </AgentDrawer>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="rounded-lg shadow-none">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-base">Dev & Consulting Resource Costs</CardTitle>
          <CardDescription>Project effort shown as person-weeks or advisor-hours before cost.</CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <div className="grid gap-3 md:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.name} className="rounded-lg shadow-none">
                <CardContent className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-medium">{project.name}</div>
                      <div className="mt-1 text-muted-foreground text-sm">
                        {project.type} - {project.duration}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon-sm" variant="ghost" aria-label={`${project.name} menu`}>
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Add to resource plan</DropdownMenuItem>
                        <DropdownMenuItem>Link to scenario</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="mt-4 rounded-lg border p-3">
                    <div className="text-muted-foreground text-xs">Resource</div>
                    <div className="mt-1 font-medium">{project.resource}</div>
                    <div className="text-muted-foreground text-xs">{project.totalResource}</div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{project.cost}</div>
                      <div className="text-muted-foreground text-xs">{project.unit}</div>
                    </div>
                    <Badge variant="secondary">{project.status}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ForecastChart({ mode }: { mode: ForecastMode }) {
  if (mode === "cost") {
    return (
      <div className="rounded-lg border p-3">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <div className="font-medium text-sm">Monthly cost composition</div>
            <div className="text-muted-foreground text-xs">Stacked forecast · TRY thousands</div>
          </div>
          <Badge variant="outline">Next month +6.8%</Badge>
        </div>
        <ChartContainer config={costChartConfig} className="h-64 w-full">
          <AreaChart accessibilityLayer data={forecastData} margin={{ left: 0, right: 8, top: 8 }}>
            <CartesianGrid vertical={false} strokeDasharray="4 4" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tickMargin={10} />
            <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `₺${value}K`} width={58} />
            <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
            <Area
              dataKey="human"
              stackId="cost"
              type="monotone"
              fill="var(--color-human)"
              stroke="var(--color-human)"
              fillOpacity={0.78}
            />
            <Area
              dataKey="agent"
              stackId="cost"
              type="monotone"
              fill="var(--color-agent)"
              stroke="var(--color-agent)"
              fillOpacity={0.82}
            />
            <Area
              dataKey="dev"
              stackId="cost"
              type="monotone"
              fill="var(--color-dev)"
              stroke="var(--color-dev)"
              fillOpacity={0.82}
            />
            <Area
              dataKey="consultant"
              stackId="cost"
              type="monotone"
              fill="var(--color-consultant)"
              stroke="var(--color-consultant)"
              fillOpacity={0.82}
            />
          </AreaChart>
        </ChartContainer>
        <ForecastLegend
          items={[
            ["Human", "bg-sky-500"],
            ["Agent", "bg-violet-500"],
            ["Dev team", "bg-emerald-500"],
            ["Consultant", "bg-orange-400"],
          ]}
        />
      </div>
    );
  }

  if (mode === "tokens") {
    return (
      <div className="rounded-lg border p-3">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <div className="font-medium text-sm">Token volume by type</div>
            <div className="text-muted-foreground text-xs">Input, output, and cache forecast · millions</div>
          </div>
          <Badge variant="outline">Cache hit 17.6%</Badge>
        </div>
        <ChartContainer config={tokenChartConfig} className="h-64 w-full">
          <BarChart accessibilityLayer data={forecastData} margin={{ left: 0, right: 8, top: 8 }} barCategoryGap="28%">
            <CartesianGrid vertical={false} strokeDasharray="4 4" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tickMargin={10} />
            <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${value}M`} width={48} />
            <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
            <Bar dataKey="input" stackId="tokens" fill="var(--color-input)" radius={[0, 0, 3, 3]} />
            <Bar dataKey="output" stackId="tokens" fill="var(--color-output)" />
            <Bar dataKey="cached" stackId="tokens" fill="var(--color-cached)" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ChartContainer>
        <ForecastLegend
          items={[
            ["Input tokens", "bg-violet-500"],
            ["Output tokens", "bg-fuchsia-500"],
            ["Cached tokens", "bg-sky-500"],
          ]}
        />
      </div>
    );
  }

  return (
    <div className="rounded-lg border p-3">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <div className="font-medium text-sm">Energy consumption forecast</div>
          <div className="text-muted-foreground text-xs">Infrastructure demand by source · kWh</div>
        </div>
        <Badge variant="outline">Efficiency +11.2%</Badge>
      </div>
      <ChartContainer config={energyChartConfig} className="h-64 w-full">
        <LineChart accessibilityLayer data={forecastData} margin={{ left: 0, right: 8, top: 8 }}>
          <CartesianGrid vertical={false} strokeDasharray="4 4" />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tickMargin={10} />
          <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${value} kWh`} width={62} />
          <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
          <Line dataKey="compute" type="monotone" stroke="var(--color-compute)" strokeWidth={3} dot={false} />
          <Line dataKey="cooling" type="monotone" stroke="var(--color-cooling)" strokeWidth={2.5} dot={false} />
          <Line dataKey="network" type="monotone" stroke="var(--color-network)" strokeWidth={2.5} dot={false} />
        </LineChart>
      </ChartContainer>
      <ForecastLegend
        items={[
          ["Compute", "bg-emerald-500"],
          ["Cooling", "bg-cyan-500"],
          ["Network", "bg-amber-500"],
        ]}
      />
    </div>
  );
}

function ForecastLegend({ items }: { items: [string, string][] }) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      {items.map(([label, color]) => (
        <Badge key={label} variant="secondary">
          <span className={`mr-1.5 size-2 rounded-full ${color}`} />
          {label}
        </Badge>
      ))}
    </div>
  );
}

function TotalResourceCard({
  resourceTab,
  setResourceTab,
}: {
  resourceTab: ResourceTab;
  setResourceTab: (tab: ResourceTab) => void;
}) {
  const item = resourceTabs[resourceTab];
  const metric = metrics[0];
  const efficiency = metrics[4];

  return (
    <Card className="rounded-lg shadow-none">
      <CardContent className="p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="font-semibold text-base">{metric.title}</div>
              <Badge className="bg-sky-100 text-sky-700" variant="secondary">
                Live
              </Badge>
            </div>
            <p className="mt-1 text-muted-foreground text-sm">{metric.description}</p>
          </div>
          <Badge variant="outline" className="w-fit whitespace-nowrap">
            {efficiency.resourceValue} - {efficiency.resourceTrend}
          </Badge>
        </div>

        <div className="mt-4 flex w-fit flex-wrap gap-1 rounded-lg border bg-muted/20 p-1">
          {resourceOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`rounded-md px-2.5 py-1 font-medium text-xs transition ${
                resourceTab === option.value
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setResourceTab(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,0.8fr)_minmax(260px,1fr)] md:items-end">
          <div>
            <div className="text-muted-foreground text-xs">{item.label}</div>
            <div className="mt-1 font-semibold text-4xl tracking-tight">{item.value}</div>
            <div className="mt-2 text-muted-foreground text-sm">{item.detail}</div>
          </div>

          <div className="flex h-24 items-end gap-2 rounded-lg border p-3">
            {item.sparkline.map((value) => (
              <div
                key={`${resourceTab}-${value}`}
                className="flex-1 rounded-t-sm bg-sky-500/80"
                style={{ height: `${value}%` }}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DualMetricCard({ metric }: { metric: DualMetric }) {
  const Icon = metric.icon;

  return (
    <Card className="rounded-lg shadow-none">
      <CardContent className="flex h-full flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="font-semibold text-base">{metric.title}</div>
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-foreground">
            <Icon className="size-4" />
          </span>
        </div>

        <div className="mt-5 flex-1">
          <div className="text-muted-foreground text-xs">{metric.resourceLabel}</div>
          <div className="mt-1 break-words font-semibold text-2xl leading-tight">{metric.resourceValue}</div>
          <div className="mt-3 text-muted-foreground text-sm" title={metric.unitPrice}>
            {metric.costValue}
          </div>
          <div className="mt-2 text-muted-foreground text-xs">{metric.resourceTrend}</div>
        </div>

        <Button className="mt-5 w-full" size="sm" variant="outline">
          Review details
        </Button>
        <div className={`mt-4 h-0.5 rounded-full ${metric.accent}`} />
      </CardContent>
    </Card>
  );
}

function DepartmentDrawer({ children, department }: { children: React.ReactNode; department: Department }) {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>{department.name} Resources</SheetTitle>
          <SheetDescription>Resource consumption, cost, and forecast for this department.</SheetDescription>
        </SheetHeader>
        <div className="grid gap-3 px-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <MiniMetric title="Human hours" value={`${department.humans * 172} h`} icon={Users} />
            <MiniMetric title="Tokens" value={department.tokenLabel} icon={Bot} />
            <MiniMetric title="Energy" value={department.energy} icon={Zap} />
            <MiniMetric title="Dev days" value={`${Math.round(department.agents * 2.4)} days`} icon={Cpu} />
          </div>
          <div className="rounded-lg border p-3">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span>Budget vs actual</span>
              <span>{department.totalCost}</span>
            </div>
            <Progress value={department.variance.startsWith("+") ? 92 : 74} />
          </div>
          <div className="rounded-lg border p-3">
            <div className="font-medium">Filtered agents</div>
            <div className="mt-3 grid gap-2">
              {agents.slice(0, 2).map((agent) => (
                <div key={agent.name} className="flex items-center justify-between text-sm">
                  <span>{agent.name}</span>
                  <span className="text-muted-foreground">{agent.tokens}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <SheetFooter>
          <Button variant="outline">Edit Budget</Button>
          <ResourceLimitDialog>
            <Button>Set Resource Limit</Button>
          </ResourceLimitDialog>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function AgentDrawer({ children, agent }: { children: React.ReactNode; agent: AgentUsage }) {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="sm:max-w-xl">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <SheetTitle>{agent.name}</SheetTitle>
            <Badge variant="secondary">{agent.model}</Badge>
          </div>
          <SheetDescription>Token, compute, cost, and efficiency details.</SheetDescription>
        </SheetHeader>
        <div className="px-4">
          <Tabs defaultValue="overview">
            <TabsList className="w-full">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tokens">Tokens</TabsTrigger>
              <TabsTrigger value="compute">Compute</TabsTrigger>
              <TabsTrigger value="cost">Cost</TabsTrigger>
              <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-4 grid gap-3 sm:grid-cols-2">
              <MiniMetric title="Monthly tokens" value={agent.tokens} icon={Bot} />
              <MiniMetric title="Compute" value={agent.compute} icon={Cpu} />
              <MiniMetric title="Cost" value={agent.totalCost} icon={Gauge} />
              <MiniMetric title="Efficiency" value={`${agent.efficiency}/1K`} icon={Activity} />
            </TabsContent>
            {["tokens", "compute", "cost", "efficiency"].map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-4">
                <div className="rounded-lg border p-3">
                  <div className="mb-3 font-medium capitalize">{tab} trend</div>
                  <SmallBars />
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
        <SheetFooter>
          <Button variant="outline">Change Model</Button>
          <ResourceLimitDialog>
            <Button>Set Token Limit</Button>
          </ResourceLimitDialog>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function ResourceLimitDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Set Resource Limit</DialogTitle>
          <DialogDescription>
            Create a resource or budget threshold for a department, agent, or project.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input defaultValue="Department: Operations" />
            <Input defaultValue="Monthly token cap" />
          </div>
          <Input defaultValue="59,000,000 tokens" />
          <Tabs defaultValue="approval">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="warn">Warn only</TabsTrigger>
              <TabsTrigger value="stop">Auto stop</TabsTrigger>
              <TabsTrigger value="approval">Require approval</TabsTrigger>
            </TabsList>
          </Tabs>
          <p className="text-muted-foreground text-sm">
            This threshold also powers the next-month forecast warning when projected usage crosses the limit.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Save Limit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function MiniMetric({ icon: Icon, title, value }: { icon: typeof Activity; title: string; value: string }) {
  return (
    <div className="rounded-lg border p-3">
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        <Icon className="size-4" />
        {title}
      </div>
      <div className="mt-2 font-semibold">{value}</div>
      <SmallBars />
    </div>
  );
}

function SmallBars() {
  return (
    <div className="mt-3 flex h-8 items-end gap-1">
      {[30, 48, 38, 62, 54, 76, 69, 84].map((height) => (
        <div key={height} className="w-full rounded-t-sm bg-sky-500/70" style={{ height: `${height}%` }} />
      ))}
    </div>
  );
}
