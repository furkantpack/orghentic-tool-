import { Bot, ChartNoAxesColumnIncreasing, Plus, Search, UserRound, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { DepartmentCard } from "./components/department-card";
import { MiniMetric } from "./components/department-visuals";
import { departments, departmentTotals } from "./data";

export default function Page() {
  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <span>Dashboard</span>
            <span>/</span>
            <span>Departments v2</span>
          </div>
          <h1 className="mt-1 text-2xl tracking-tight">Departments v2</h1>
          <p className="mt-1 max-w-3xl text-muted-foreground text-sm">
            Expanded department intelligence across people, agents, tokens, tasks, budgets, and transformation progress.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline">
            <ChartNoAxesColumnIncreasing /> Budget View
          </Button>
          <Button size="sm">
            <Plus /> Add Department
          </Button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Summary
          title="People"
          value={`${departmentTotals.people}`}
          detail="Human employees"
          icon={Users}
          tone="bg-sky-50/80 dark:bg-sky-500/10"
        />
        <Summary
          title="Agents"
          value={`${departmentTotals.agents}`}
          detail="Active department agents"
          icon={Bot}
          tone="bg-violet-50/80 dark:bg-violet-500/10"
        />
        <Summary
          title="Open Roles"
          value={`${departmentTotals.openRoles}`}
          detail="Hiring or agent decision"
          icon={UserRound}
          tone="bg-orange-50/80 dark:bg-orange-500/10"
        />
        <Summary
          title="Health"
          value={`${departmentTotals.averageHealth}%`}
          detail="Average department score"
          icon={ChartNoAxesColumnIncreasing}
          tone="bg-teal-50/80 dark:bg-teal-500/10"
        />
      </div>

      <Card className="rounded-lg shadow-none">
        <CardHeader className="border-b p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-base">Department portfolio</CardTitle>
              <CardDescription>
                Open a department for people, agent, token, task, and blended cost details.
              </CardDescription>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Tabs defaultValue="departments">
                <TabsList>
                  <TabsTrigger value="users">Users</TabsTrigger>
                  <TabsTrigger value="departments">Departments</TabsTrigger>
                  <TabsTrigger value="budgets">Budgets</TabsTrigger>
                </TabsList>
              </Tabs>
              <InputGroup className="h-8 lg:w-80">
                <InputGroupAddon>
                  <Search />
                </InputGroupAddon>
                <InputGroupInput placeholder="Search departments..." />
              </InputGroup>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {["All departments", "Budget overrun", "High transformation", "Agent health", "Needs review"].map(
              (filter) => (
                <Button key={filter} size="sm" variant="outline">
                  {filter}
                </Button>
              ),
            )}
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 p-4 lg:grid-cols-2 2xl:grid-cols-3">
          {departments.map((department) => (
            <DepartmentCard key={department.name} department={department} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function Summary({
  title,
  value,
  detail,
  icon: Icon,
  tone,
}: {
  title: string;
  value: string;
  detail: string;
  icon: typeof Users;
  tone: string;
}) {
  return (
    <Card className="rounded-lg shadow-none">
      <CardContent className="flex items-start justify-between gap-3 p-4">
        <MiniMetric className={tone} label={title} value={value} detail={detail} />
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Icon className="size-4" />
        </div>
      </CardContent>
    </Card>
  );
}
