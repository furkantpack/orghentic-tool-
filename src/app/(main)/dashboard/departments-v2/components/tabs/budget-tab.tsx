import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { Department } from "../../data";
import { BudgetStack, MiniMetric, ProgressMetric } from "../department-visuals";

export function BudgetTab({ department }: { department: Department }) {
  const breakdown = department.budgetBreakdown;

  return (
    <div className="grid gap-4">
      <div className="grid gap-3 md:grid-cols-2">
        <ProgressMetric
          label="Human budget"
          value={department.budgetUse}
          detail={`${department.monthlyCost} / ${department.budget}`}
        />
        <MiniMetric label="Blended cost" value={breakdown.blended} detail={`${breakdown.change} vs last period`} />
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <MiniMetric label="Agent / token cost" value={department.tokenSpend} />
        <MiniMetric label="Dev integration" value="TRY 84K" />
        <MiniMetric label="Consulting" value="TRY 42K" />
        <MiniMetric label="Total" value={breakdown.blended} />
      </div>

      <Card className="rounded-lg shadow-none">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-base">Cost breakdown</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <BudgetStack
            agentToken={breakdown.agentToken}
            consulting={breakdown.consulting}
            dev={breakdown.dev}
            human={breakdown.human}
          />
        </CardContent>
      </Card>
    </div>
  );
}
