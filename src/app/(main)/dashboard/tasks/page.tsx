import Link from "next/link";

import { Bot, CalendarDays, ListFilter, Plus, Search, UserRound } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tasks = [
  {
    id: "TASK-1024",
    title: "Map finance approval flow",
    status: "To Do",
    priority: "High",
    department: "Finance",
    assignee: "Elif Arslan",
    type: "Human",
    due: "Jul 11",
    progress: 18,
    cost: "TRY 0",
  },
  {
    id: "TASK-1025",
    title: "Extract support intents",
    status: "In Progress",
    priority: "Medium",
    department: "CX",
    assignee: "Support Triage",
    type: "Agent",
    due: "Jul 12",
    progress: 64,
    cost: "TRY 2.4K",
  },
  {
    id: "TASK-1026",
    title: "Draft agent replacement scenario",
    status: "In Review",
    priority: "High",
    department: "Marketing",
    assignee: "Research Agent",
    type: "Agent",
    due: "Jul 14",
    progress: 82,
    cost: "TRY 3.1K",
  },
  {
    id: "TASK-1027",
    title: "Review payroll connector",
    status: "In Progress",
    priority: "Medium",
    department: "People",
    assignee: "Deniz Koc",
    type: "Human",
    due: "Jul 16",
    progress: 46,
    cost: "TRY 0",
  },
  {
    id: "TASK-1028",
    title: "Validate token budget alerts",
    status: "Done",
    priority: "Low",
    department: "Operations",
    assignee: "Ops Agent",
    type: "Agent",
    due: "Jul 17",
    progress: 100,
    cost: "TRY 1.2K",
  },
];

export default function Page() {
  const activeTasks = tasks.filter((task) => task.status !== "Done").length;
  const agentTasks = tasks.filter((task) => task.type === "Agent").length;
  const highPriority = tasks.filter((task) => task.priority === "High").length;

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <span>Dashboard</span>
            <span>/</span>
            <span>Tasks</span>
          </div>
          <h1 className="mt-1 text-2xl tracking-tight">Task Workspace</h1>
          <p className="mt-1 max-w-3xl text-muted-foreground text-sm">
            Track human work, agent execution, deadlines, and cost impact in one operational view.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Tabs defaultValue="list">
            <TabsList>
              <TabsTrigger value="list">List</TabsTrigger>
              <TabsTrigger value="kanban">Kanban</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button asChild size="sm" className="bg-sky-600 text-white hover:bg-sky-700">
            <Link href="/dashboard/design-library/task-create">
              <Plus /> New Task
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <Summary label="Active tasks" tone="bg-sky-50/80 dark:bg-sky-500/10" value={`${activeTasks}`} />
        <Summary label="Agent-owned" tone="bg-violet-50/80 dark:bg-violet-500/10" value={`${agentTasks}`} />
        <Summary label="High priority" tone="bg-orange-50/80 dark:bg-orange-500/10" value={`${highPriority}`} />
        <Summary label="Tracked agent cost" tone="bg-teal-50/80 dark:bg-teal-500/10" value="TRY 6.7K" />
      </div>

      <Card className="rounded-lg shadow-none">
        <CardHeader className="border-b p-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <CardTitle className="text-base">Task list</CardTitle>
              <CardDescription>Open any task to review ownership, progress, execution logs, and cost.</CardDescription>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <InputGroup className="h-9 sm:w-80">
                <InputGroupAddon>
                  <Search />
                </InputGroupAddon>
                <InputGroupInput placeholder="Search tasks, assignee, department..." />
              </InputGroup>
              <Button size="sm" variant="outline">
                <ListFilter /> Filters
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {["Assignee: All", "Type: Human + Agent", "Department: All", "Status: Active", "Priority: All"].map(
              (filter) => (
                <Button key={filter} size="sm" variant="outline" className="bg-background">
                  {filter}
                </Button>
              ),
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-28">Key</TableHead>
                <TableHead>Task</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id} className="hover:bg-muted/30">
                  <TableCell>
                    <Link href={`/dashboard/tasks/${task.id.toLowerCase()}`} className="font-medium text-primary">
                      {task.id}
                    </Link>
                  </TableCell>
                  <TableCell className="min-w-72">
                    <Link href={`/dashboard/tasks/${task.id.toLowerCase()}`} className="font-medium hover:underline">
                      {task.title}
                    </Link>
                    <div className="mt-1 text-muted-foreground text-xs">
                      {task.type === "Agent" ? "Agent execution tracked" : "Human-owned task"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={task.status} />
                  </TableCell>
                  <TableCell>
                    <PriorityBadge priority={task.priority} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar
                        className={
                          task.type === "Agent"
                            ? "size-7 bg-violet-50 text-violet-700"
                            : "size-7 bg-sky-50 text-sky-700"
                        }
                      >
                        <AvatarFallback>
                          {task.type === "Agent" ? <Bot className="size-4" /> : <UserRound className="size-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <span>{task.assignee}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{task.department}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="size-3.5 text-muted-foreground" />
                      {task.due}
                    </span>
                  </TableCell>
                  <TableCell className="min-w-32">
                    <div className="flex items-center gap-2">
                      <Progress value={task.progress} className="h-1.5" />
                      <span className="text-muted-foreground text-xs">{task.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{task.cost}</TableCell>
                  <TableCell>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/dashboard/tasks/${task.id.toLowerCase()}`}>Open</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-3">
        <Insight title="Human handoffs" value="2 reviews" detail="Finance and People tasks need owner approval." />
        <Insight
          title="Agent execution"
          value="94% success"
          detail="Last 7 days across Support Triage, Ops Agent, and Research Agent."
        />
        <Insight title="Due this week" value="5 tasks" detail="Two high priority items need review before Friday." />
      </div>
    </div>
  );
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

function Insight({ detail, title, value }: { detail: string; title: string; value: string }) {
  return (
    <Card className="rounded-lg shadow-none">
      <CardContent className="p-4">
        <div className="text-muted-foreground text-xs">{title}</div>
        <div className="mt-1 font-semibold text-xl">{value}</div>
        <p className="mt-2 text-muted-foreground text-sm">{detail}</p>
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
