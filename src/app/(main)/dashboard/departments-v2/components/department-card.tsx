import { AlertTriangle, Building2, MoreHorizontal, Users } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";

import type { Department } from "../data";
import { DepartmentDrawer } from "./department-drawer";
import { DistributionBar, MiniMetric, ProgressMetric, Trend } from "./department-visuals";

export function DepartmentCard({ department }: { department: Department }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="relative flex min-h-[460px] flex-col rounded-lg border bg-background p-4 text-left transition hover:-translate-y-0.5 hover:shadow-sm"
          type="button"
        >
          <div className={`absolute inset-x-0 top-0 h-0.5 rounded-t-lg ${department.accent}`} />
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <div className={`flex size-8 items-center justify-center rounded-lg ${department.soft}`}>
                  <Building2 className="size-4" />
                </div>
                <div className="truncate font-semibold">{department.name}</div>
              </div>
              <div className="mt-2 line-clamp-2 text-muted-foreground text-sm">{department.description}</div>
            </div>
            <MoreHorizontal className="size-4 shrink-0 text-muted-foreground" />
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <Avatar className="size-8">
                <AvatarFallback>{department.manager.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="truncate font-medium text-sm">{department.manager}</div>
                <div className="truncate text-muted-foreground text-xs">{department.managerRole}</div>
              </div>
            </div>
            <Badge variant={department.status === "Healthy" ? "secondary" : "outline"}>{department.status}</Badge>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2">
            <MiniMetric className="bg-sky-50/80 dark:bg-sky-500/10" label="People" value={`${department.people}`} />
            <MiniMetric
              className="bg-violet-50/80 dark:bg-violet-500/10"
              label="Agents"
              value={`${department.agentsCount}`}
            />
            <MiniMetric
              className="bg-orange-50/80 dark:bg-orange-500/10"
              label="Open"
              value={`${department.openRoles}`}
            />
          </div>

          <div className="mt-4 space-y-3">
            <ProgressMetric
              label="Budget"
              value={department.budgetUse}
              detail={`${department.monthlyCost} / ${department.budget}`}
            />
            <ProgressMetric label="Health" value={department.health} detail={`${department.health}%`} />
            <ProgressMetric
              label="Automation fit"
              value={department.automationFit}
              detail={`${department.automationFit}%`}
            />
          </div>

          <div className="mt-4 grid gap-3">
            <div className="grid gap-2 rounded-lg border bg-teal-50/70 p-3 dark:bg-teal-500/10">
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground text-xs">Transformation score</span>
                <Trend direction={department.transformationTrend} label={department.transformationTrendLabel} />
              </div>
              <div className="font-semibold text-lg">{department.transformationScore}%</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <MiniMetric
                className="bg-orange-50/80 dark:bg-orange-500/10"
                label="Token spend"
                value={department.tokenSpend}
                detail="Monthly"
              />
              <MiniMetric
                className="bg-violet-50/80 dark:bg-violet-500/10"
                label="Agent health"
                value={`${department.agentHealth}%`}
                detail="Avg success"
              />
            </div>
            <DistributionBar {...department.taskDistribution} />
          </div>

          <div className="mt-auto pt-4">
            <div className="mb-2 flex items-center justify-between rounded-lg border bg-muted/20 p-3 text-sm">
              <span className="flex items-center gap-2 text-muted-foreground">
                <AlertTriangle className="size-4" />
                Risk
              </span>
              <span className="font-medium">{department.risk}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={department.soft} variant="secondary">
                This month: {department.recommendation}
              </Badge>
              <Button className="ml-auto" size="sm" variant="outline">
                <Users /> Open
              </Button>
            </div>
          </div>
        </button>
      </SheetTrigger>

      <DepartmentDrawer department={department} />
    </Sheet>
  );
}
