import Link from "next/link";
import { notFound } from "next/navigation";

import { ArrowLeft, Bot, CalendarDays, CheckCircle2, MessageSquare, Paperclip, UserRound } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tasks = [
  {
    id: "task-1024",
    key: "TASK-1024",
    title: "Map finance approval flow",
    status: "To Do",
    priority: "High",
    department: "Finance",
    assignee: "Elif Arslan",
    type: "Human",
    due: "Jul 11",
    progress: 18,
    cost: "TRY 0",
    description:
      "Document the current approval path, decision owners, budget thresholds, and handoff points before agent automation is proposed.",
  },
  {
    id: "task-1025",
    key: "TASK-1025",
    title: "Extract support intents",
    status: "In Progress",
    priority: "Medium",
    department: "CX",
    assignee: "Support Triage",
    type: "Agent",
    due: "Jul 12",
    progress: 64,
    cost: "TRY 2.4K",
    description:
      "Cluster recent support tickets into reusable intents and identify which flows can be handled by an agent without human escalation.",
  },
  {
    id: "task-1026",
    key: "TASK-1026",
    title: "Draft agent replacement scenario",
    status: "In Review",
    priority: "High",
    department: "Marketing",
    assignee: "Research Agent",
    type: "Agent",
    due: "Jul 14",
    progress: 82,
    cost: "TRY 3.1K",
    description:
      "Prepare a scenario that moves repetitive content research and outline generation to an agent while preserving editorial approval.",
  },
  {
    id: "task-1027",
    key: "TASK-1027",
    title: "Review payroll connector",
    status: "In Progress",
    priority: "Medium",
    department: "People",
    assignee: "Deniz Koc",
    type: "Human",
    due: "Jul 16",
    progress: 46,
    cost: "TRY 0",
    description:
      "Check payroll connector fields, data ownership, and sync timing before it is added to finance projections.",
  },
  {
    id: "task-1028",
    key: "TASK-1028",
    title: "Validate token budget alerts",
    status: "Done",
    priority: "Low",
    department: "Operations",
    assignee: "Ops Agent",
    type: "Agent",
    due: "Jul 17",
    progress: 100,
    cost: "TRY 1.2K",
    description:
      "Confirm warning thresholds for monthly token spend and push budget exceptions into the dashboard alert queue.",
  },
];

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const task = tasks.find((item) => item.id === id);

  if (!task) {
    notFound();
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <Button asChild size="sm" variant="ghost" className="-ms-2 w-fit">
            <Link href="/dashboard/tasks">
              <ArrowLeft /> Back to tasks
            </Link>
          </Button>
          <div>
            <div className="mb-2 flex items-center gap-2 text-muted-foreground text-xs">
              <span>Dashboard</span>
              <span>/</span>
              <span>Tasks</span>
              <span>/</span>
              <span>{task.key}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{task.key}</Badge>
              <StatusBadge status={task.status} />
              <PriorityBadge priority={task.priority} />
            </div>
            <h1 className="mt-2 text-2xl tracking-tight">{task.title}</h1>
            <p className="mt-1 max-w-3xl text-muted-foreground text-sm">{task.description}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline">
            Attach
          </Button>
          <Button size="sm" className="bg-sky-600 text-white hover:bg-sky-700">
            Transition
          </Button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <Summary label="Status" tone="bg-sky-50/80 dark:bg-sky-500/10" value={task.status} />
        <Summary label="Progress" tone="bg-teal-50/80 dark:bg-teal-500/10" value={`${task.progress}%`} />
        <Summary label="Tracked cost" tone="bg-orange-50/80 dark:bg-orange-500/10" value={task.cost} />
        <Summary label="Owner type" tone="bg-violet-50/80 dark:bg-violet-500/10" value={task.type} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex flex-col gap-4">
          <Card className="rounded-lg shadow-none">
            <CardHeader className="border-b p-4">
              <CardTitle className="text-base">Work panel</CardTitle>
              <CardDescription>Jira-style activity, subtasks, and agent execution notes.</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <Tabs defaultValue="activity">
                <TabsList variant="line" className="w-full justify-start border-b ps-0">
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="comments">Comments</TabsTrigger>
                  <TabsTrigger value="agent-log">Agent Log</TabsTrigger>
                  <TabsTrigger value="attachments">Attachments</TabsTrigger>
                </TabsList>
                <TabsContent value="activity" className="space-y-3 pt-4">
                  {[
                    ["Status changed", `${task.status} by ${task.assignee}`],
                    ["Org impact linked", `${task.department} budget and role data attached`],
                    ["Scenario signal", "Reassignment impact calculated"],
                  ].map(([title, detail]) => (
                    <div key={title} className="rounded-lg border bg-background p-3">
                      <div className="font-medium">{title}</div>
                      <div className="mt-1 text-muted-foreground text-sm">{detail}</div>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="comments" className="space-y-3 pt-4">
                  <Comment
                    author="Aylin Kaya"
                    text="Please include finance owner approval before this moves to Done."
                  />
                  <Comment author={task.assignee} text="Updated the cost and timing assumptions." />
                </TabsContent>
                <TabsContent value="agent-log" className="space-y-3 pt-4">
                  <div className="rounded-lg border bg-violet-50/50 p-3 dark:bg-violet-500/10">
                    <div className="font-medium">Execution trace</div>
                    <p className="mt-1 text-muted-foreground text-sm">
                      {task.type === "Agent"
                        ? "Agent read source tasks, clustered the work, and produced a review packet for human approval."
                        : "No agent is currently assigned. Reassign to estimate time and cost impact."}
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="attachments" className="space-y-3 pt-4">
                  <div className="flex items-center gap-3 rounded-lg border bg-background p-3">
                    <Paperclip className="size-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">approval-map.pdf</div>
                      <div className="text-muted-foreground text-sm">Linked from Finance workspace</div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="rounded-lg shadow-none">
            <CardHeader className="border-b p-4">
              <CardTitle className="text-base">Subtasks</CardTitle>
              <CardDescription>Small steps tracked under this issue.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 p-4">
              {["Confirm owner", "Update cost estimate", "Add scenario note"].map((item, index) => (
                <div key={item} className="flex items-center gap-3 rounded-lg border bg-background p-3">
                  <CheckCircle2 className={index === 0 ? "size-4 text-emerald-500" : "size-4 text-muted-foreground"} />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit rounded-lg shadow-none xl:sticky xl:top-16">
          <CardHeader className="border-b p-4">
            <CardTitle className="text-base">Details</CardTitle>
            <CardDescription>Ownership, cost, and delivery state.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-4">
            <div className="flex items-center gap-3">
              <Avatar className="size-10">
                <AvatarFallback>
                  {task.type === "Agent" ? <Bot className="size-5" /> : <UserRound className="size-5" />}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{task.assignee}</div>
                <div className="text-muted-foreground text-sm">{task.type} assignee</div>
              </div>
            </div>
            <Separator />
            <Info label="Department" value={task.department} />
            <Info label="Due date" value={task.due} icon={<CalendarDays className="size-4" />} />
            <Info label="Tracked cost" value={task.cost} />
            <div className="space-y-2 rounded-lg border p-3">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{task.progress}%</span>
              </div>
              <Progress value={task.progress} />
            </div>
            <div className="rounded-lg border bg-sky-50/60 p-3 text-sm dark:bg-sky-500/10">
              Reassigning this task between human and agent ownership will update monthly cost projection automatically.
            </div>
            <Button className="w-full bg-sky-600 text-white hover:bg-sky-700">
              <MessageSquare /> Add comment
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Summary({ label, tone, value }: { label: string; tone: string; value: string }) {
  return (
    <Card className="rounded-lg shadow-none">
      <CardContent className={`rounded-lg p-4 ${tone}`}>
        <div className="text-muted-foreground text-xs">{label}</div>
        <div className="mt-1 truncate font-semibold text-2xl">{value}</div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  let tone = "bg-slate-50 text-slate-700 dark:bg-slate-500/10 dark:text-slate-300";

  if (status === "Done") {
    tone = "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300";
  } else if (status === "In Progress") {
    tone = "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300";
  } else if (status === "In Review") {
    tone = "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300";
  }

  return <Badge className={tone}>{status}</Badge>;
}

function PriorityBadge({ priority }: { priority: string }) {
  let tone = "bg-slate-50 text-slate-700 dark:bg-slate-500/10 dark:text-slate-300";

  if (priority === "High") {
    tone = "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300";
  } else if (priority === "Medium") {
    tone = "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300";
  }

  return <Badge className={tone}>{priority}</Badge>;
}

function Info({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-3 text-sm">
      <span className="flex items-center gap-2 text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function Comment({ author, text }: { author: string; text: string }) {
  return (
    <div className="rounded-lg border p-3">
      <div className="font-medium">{author}</div>
      <p className="mt-1 text-muted-foreground text-sm">{text}</p>
    </div>
  );
}
