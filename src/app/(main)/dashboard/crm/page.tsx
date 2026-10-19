"use client";

import { AlertTriangle, ArrowUpRight, Bot, CalendarDays, CheckCircle2, Users } from "lucide-react";
import { Area, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const kpis = [
  {
    title: "Total Headcount",
    value: "184",
    change: "+8.4%",
    icon: Users,
    tone: "from-sky-50 to-background text-sky-700",
  },
  {
    title: "Active Agents",
    value: "27",
    change: "+12.1%",
    icon: Bot,
    tone: "from-violet-50 to-background text-violet-700",
  },
  {
    title: "Monthly Cost",
    value: "TRY 4.82M",
    change: "-6.2%",
    icon: CalendarDays,
    tone: "from-emerald-50 to-background text-emerald-700",
  },
  {
    title: "Open Suggestions",
    value: "13",
    change: "3 high impact",
    icon: AlertTriangle,
    tone: "from-amber-50 to-background text-amber-700",
  },
];

const alerts = [
  ["Content Writer role is 70% agent-ready", "Marketing", "TRY 42K/mo"],
  ["Support triage can move to hybrid ownership", "CX", "TRY 68K/mo"],
  ["Finance analyst vacancy has agent-first option", "Finance", "TRY 31K/mo"],
];

const departments = [
  ["Engineering", 68, "TRY 1.84M", 72],
  ["Operations", 34, "TRY 740K", 58],
  ["Marketing", 22, "TRY 510K", 44],
  ["Finance", 16, "TRY 420K", 63],
];

const costTrendData = [
  { month: "Jan", human: 4.18, agent: 0.12, total: 5.06 },
  { month: "Feb", human: 4.16, agent: 0.13, total: 5.03 },
  { month: "Mar", human: 4.11, agent: 0.15, total: 4.99 },
  { month: "Apr", human: 4.08, agent: 0.16, total: 4.96 },
  { month: "May", human: 4.03, agent: 0.18, total: 4.91 },
  { month: "Jun", human: 3.98, agent: 0.19, total: 4.88 },
  { month: "Jul", human: 3.94, agent: 0.21, total: 4.86 },
  { month: "Aug", human: 3.91, agent: 0.23, total: 4.84 },
  { month: "Sep", human: 3.86, agent: 0.24, total: 4.81 },
  { month: "Oct", human: 3.82, agent: 0.25, total: 4.79 },
  { month: "Nov", human: 3.78, agent: 0.27, total: 4.76 },
  { month: "Dec", human: 3.74, agent: 0.286, total: 4.82 },
];

const costTrendConfig = {
  human: { label: "Human cost", color: "var(--color-sky-500)" },
  agent: { label: "Agent cost", color: "var(--color-violet-500)" },
  total: { label: "Total operating cost", color: "var(--color-emerald-500)" },
} satisfies ChartConfig;

export default function Page() {
  return (
    <div data-content-padding="false" className="min-h-[calc(100dvh-3rem)] bg-[#f4f4f3] p-2 dark:bg-muted/40">
      <div className="relative min-h-[calc(100dvh-4rem)] overflow-hidden rounded-2xl bg-background ring-1 ring-foreground/10">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-[length:7px_7px] bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.07)_1px,transparent_1px)] opacity-20" />
        <div className="relative mx-auto flex max-w-screen-2xl flex-col gap-4 px-4 py-6 md:gap-6 md:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground text-sm">
                Organization health, agent opportunities, and cost signals.
              </p>
            </div>
            <Tabs defaultValue="month">
              <TabsList>
                <TabsTrigger value="month">This Month</TabsTrigger>
                <TabsTrigger value="quarter">Last 3 Months</TabsTrigger>
                <TabsTrigger value="year">This Year</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {kpis.map((kpi) => (
              <Card
                key={kpi.title}
                className={`rounded-2xl bg-gradient-to-br ${kpi.tone} shadow-[0_10px_28px_rgba(0,0,0,0.04)]`}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="font-medium text-sm">{kpi.title}</CardTitle>
                  <kpi.icon className="size-4" />
                </CardHeader>
                <CardContent>
                  <div className="font-semibold text-2xl text-foreground">{kpi.value}</div>
                  <p className="mt-1 text-muted-foreground text-xs">{kpi.change} vs previous period</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            <Card className="rounded-2xl shadow-[0_10px_28px_rgba(0,0,0,0.04)] xl:col-span-2">
              <CardHeader>
                <CardTitle>Cost Trend</CardTitle>
                <CardDescription>Human cost, agent cost, and total operating cost.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-2xl border bg-gradient-to-br from-sky-50/70 via-background to-emerald-50/70 p-3 dark:from-sky-500/10 dark:to-emerald-500/10">
                  <ChartContainer config={costTrendConfig} className="h-72 w-full">
                    <ComposedChart accessibilityLayer data={costTrendData} margin={{ left: 0, right: 12, top: 12 }}>
                      <defs>
                        <linearGradient id="human-cost-fill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-human)" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="var(--color-human)" stopOpacity={0.03} />
                        </linearGradient>
                        <linearGradient id="agent-cost-fill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-agent)" stopOpacity={0.55} />
                          <stop offset="95%" stopColor="var(--color-agent)" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} strokeDasharray="4 4" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tickMargin={10} />
                      <YAxis
                        yAxisId="cost"
                        axisLine={false}
                        tickLine={false}
                        width={58}
                        domain={[0, 5.5]}
                        tickFormatter={(value) => `₺${value}M`}
                      />
                      <YAxis
                        yAxisId="agent"
                        orientation="right"
                        axisLine={false}
                        tickLine={false}
                        width={48}
                        domain={[0, 0.35]}
                        tickFormatter={(value) => `₺${Math.round(Number(value) * 1000)}K`}
                      />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            indicator="dot"
                            formatter={(value, name) => (
                              <div className="flex min-w-40 items-center justify-between gap-4">
                                <span className="text-muted-foreground">
                                  {costTrendConfig[name as keyof typeof costTrendConfig]?.label}
                                </span>
                                <span className="font-mono font-medium">
                                  TRY{" "}
                                  {Number(value) < 1
                                    ? `${Math.round(Number(value) * 1000)}K`
                                    : `${Number(value).toFixed(2)}M`}
                                </span>
                              </div>
                            )}
                          />
                        }
                      />
                      <Area
                        yAxisId="cost"
                        dataKey="human"
                        type="monotone"
                        fill="url(#human-cost-fill)"
                        stroke="var(--color-human)"
                        strokeWidth={2.5}
                      />
                      <Area
                        yAxisId="agent"
                        dataKey="agent"
                        type="monotone"
                        fill="url(#agent-cost-fill)"
                        stroke="var(--color-agent)"
                        strokeWidth={2.5}
                      />
                      <Line
                        yAxisId="cost"
                        dataKey="total"
                        type="monotone"
                        stroke="var(--color-total)"
                        strokeWidth={3}
                        dot={false}
                      />
                    </ComposedChart>
                  </ChartContainer>
                </div>
                <div className="mt-3 flex flex-wrap gap-3 text-sm">
                  <Badge variant="secondary">
                    <span className="mr-1.5 size-2 rounded-full bg-sky-500" /> Human cost
                  </Badge>
                  <Badge variant="secondary">
                    <span className="mr-1.5 size-2 rounded-full bg-violet-500" /> Agent cost
                  </Badge>
                  <Badge variant="outline">
                    <span className="mr-1.5 size-2 rounded-full bg-emerald-500" /> Total operating cost
                  </Badge>
                  <Badge variant="outline" className="ml-auto">
                    Automation impact: -6.2%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl bg-gradient-to-br from-violet-50 via-background to-sky-50 shadow-[0_10px_28px_rgba(0,0,0,0.04)] dark:from-violet-500/10 dark:to-sky-500/10">
              <CardHeader>
                <CardTitle>Headcount Mix</CardTitle>
                <CardDescription>Human vs agent distribution by department.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="mx-auto flex size-44 items-center justify-center rounded-full border-[22px] border-sky-300 bg-background shadow-inner">
                  <div className="text-center">
                    <div className="font-semibold text-2xl">87%</div>
                    <div className="text-muted-foreground text-xs">Human-led</div>
                  </div>
                </div>
                {departments.slice(0, 3).map(([name, count, , progress]) => (
                  <div key={name as string} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{name}</span>
                      <span className="text-muted-foreground">{count} roles</span>
                    </div>
                    <Progress value={progress as number} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-2xl shadow-[0_10px_28px_rgba(0,0,0,0.04)]">
            <CardHeader>
              <CardTitle>Pending Suggestions & Alerts</CardTitle>
              <CardDescription>High-value actions waiting for review.</CardDescription>
            </CardHeader>
            <CardContent className="divide-y p-0">
              {alerts.map(([title, department, savings]) => (
                <Sheet key={title}>
                  <SheetTrigger asChild>
                    <button
                      type="button"
                      className="grid w-full gap-3 p-4 text-left text-sm hover:bg-sky-50/70 md:grid-cols-[auto_1fr_auto_auto] md:items-center dark:hover:bg-sky-500/10"
                    >
                      <AlertTriangle className="size-4 text-amber-500" />
                      <div>
                        <div className="font-medium">{title}</div>
                        <div className="text-muted-foreground">Estimated saving: {savings}</div>
                      </div>
                      <Badge variant="secondary">{department}</Badge>
                      <Button size="sm" variant="outline">
                        Review <ArrowUpRight />
                      </Button>
                    </button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>{title}</SheetTitle>
                      <SheetDescription>{department} impact review</SheetDescription>
                    </SheetHeader>
                    <div className="space-y-4 px-4">
                      <div className="rounded-lg border p-3">
                        <div className="font-medium">Recommended action</div>
                        <p className="mt-1 text-muted-foreground text-sm">
                          Create a hybrid agent scenario and keep human approval for final output.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Automation fit</span>
                          <span>70%</span>
                        </div>
                        <Progress value={70} />
                      </div>
                      <Badge className="w-fit" variant="outline">
                        Medium risk
                      </Badge>
                      <Button className="w-full">
                        <CheckCircle2 /> Create Scenario
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              ))}
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {departments.map(([name, count, cost, progress]) => (
              <Card
                key={name as string}
                className="rounded-2xl bg-gradient-to-br from-background to-muted/30 shadow-[0_10px_28px_rgba(0,0,0,0.04)]"
              >
                <CardHeader>
                  <CardTitle className="text-base">{name}</CardTitle>
                  <CardDescription>{count} humans and agents</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="font-medium">{cost}/mo</div>
                  <Progress value={progress as number} />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
