import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import type { Department } from "../../data";
import { MiniMetric, Sparkline } from "../department-visuals";

export function TokensTab({ department }: { department: Department }) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-3 md:grid-cols-4">
        <MiniMetric label="Input tokens" value={department.tokenUsage.input} />
        <MiniMetric label="Output tokens" value={department.tokenUsage.output} />
        <MiniMetric label="TRY equivalent" value={department.tokenUsage.cost} />
        <MiniMetric label="Avg cost / task" value={department.tokenUsage.avgTaskCost} />
      </div>

      <Card className="rounded-lg shadow-none">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-base">30 / 90 day token spend</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 p-4 pt-2">
          <Sparkline values={department.tokenUsage.series30} className="bg-violet-500" />
          <div className="rounded-lg border p-3">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Monthly token budget</span>
              <span className="font-medium">{department.tokenUsage.budgetUsed}% used</span>
            </div>
            <Progress value={department.tokenUsage.budgetUsed} />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-lg shadow-none">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-base">Agent distribution</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 p-4 pt-2">
          {department.tokenUsage.agentBars.map((agent) => (
            <div key={agent.name} className="grid gap-2">
              <div className="flex items-center justify-between text-sm">
                <span>{agent.name}</span>
                <Badge variant="outline">{agent.cost}</Badge>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-violet-500" style={{ width: `${agent.value}%` }} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
