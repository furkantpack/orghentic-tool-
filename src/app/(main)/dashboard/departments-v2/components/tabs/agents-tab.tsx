import { ChevronDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import type { Department } from "../../data";
import { MiniMetric } from "../department-visuals";

export function AgentsTab({ department }: { department: Department }) {
  const totalCost = department.tokenUsage.cost;
  const avgSuccess = Math.round(
    department.agents.reduce((sum, agent) => sum + agent.successRate, 0) / department.agents.length,
  );

  return (
    <div className="grid gap-4">
      <div className="grid gap-3 md:grid-cols-3">
        <MiniMetric label="Total agents" value={`${department.agents.length}`} />
        <MiniMetric label="Monthly agent cost" value={totalCost} />
        <MiniMetric label="Average success" value={`${avgSuccess}%`} />
      </div>

      <Card className="rounded-lg shadow-none">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Role / task</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Token cost</TableHead>
                <TableHead>Success</TableHead>
                <TableHead>Uptime</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {department.agents.map((agent) => (
                <TableRow key={agent.name}>
                  <TableCell>
                    <div className="flex items-center gap-2 font-medium">
                      <ChevronDown className="size-3 text-muted-foreground" />
                      {agent.name}
                    </div>
                    <div className="mt-1 text-muted-foreground text-xs">
                      Supports {agent.replaces} - live since {agent.launched}
                    </div>
                  </TableCell>
                  <TableCell>{agent.role}</TableCell>
                  <TableCell>{agent.model}</TableCell>
                  <TableCell>
                    <Badge variant={agent.status === "Active" ? "secondary" : "outline"}>{agent.status}</Badge>
                  </TableCell>
                  <TableCell>{agent.monthlyTokenCost}</TableCell>
                  <TableCell>{agent.successRate}%</TableCell>
                  <TableCell>{agent.uptime}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
