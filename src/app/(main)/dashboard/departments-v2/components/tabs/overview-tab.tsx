import { AlertTriangle, CircleDollarSign } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { Department } from "../../data";
import { Gauge, MiniMetric, ProgressMetric, Sparkline, Trend } from "../department-visuals";

export function OverviewTab({ department }: { department: Department }) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-3 md:grid-cols-3">
        <MiniMetric label="Health score" value={`${department.health}%`} detail={department.status} />
        <MiniMetric label="Agent health" value={`${department.agentHealth}%`} detail="Success / uptime average" />
        <MiniMetric label="Open roles" value={`${department.openRoles}`} detail="Hiring or agent decision" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        <Gauge value={department.transformationScore} label="transformed" />
        <Card className="rounded-lg shadow-none">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base">Transformation trend</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-4 pt-2">
            <Sparkline values={department.transformationSparkline} className="bg-violet-500" />
            <div className="flex items-center justify-between rounded-lg border p-3">
              <span className="text-muted-foreground text-sm">Human to agent work shift</span>
              <Trend direction={department.transformationTrend} label={department.transformationTrendLabel} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-lg shadow-none">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="size-4" />
              Risk & Status
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 p-4 pt-2">
            <div className="flex items-center justify-between rounded-lg border p-3 text-sm">
              <span className="text-muted-foreground">Risk</span>
              <span className="font-medium">{department.risk}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3 text-sm">
              <span className="text-muted-foreground">Status</span>
              <Badge variant="outline">{department.status}</Badge>
            </div>
            <ProgressMetric
              label="Automation fit"
              value={department.automationFit}
              detail={`${department.automationFit}%`}
            />
          </CardContent>
        </Card>

        <Card className="rounded-lg shadow-none">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <CircleDollarSign className="size-4" />
              Period summary
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 p-4 pt-2">
            <MiniMetric
              label="Total blended cost"
              value={department.periodSummary.totalCost}
              detail="Human + agent + token"
            />
            <div className="flex items-center justify-between rounded-lg border p-3 text-sm">
              <span className="text-muted-foreground">Change vs last month</span>
              <Trend direction={department.periodSummary.trend} label={department.periodSummary.change} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
