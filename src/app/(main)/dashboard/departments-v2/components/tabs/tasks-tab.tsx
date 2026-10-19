import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import type { Department } from "../../data";
import { Donut, MiniMetric } from "../department-visuals";

export function TasksTab({ department }: { department: Department }) {
  const portableCount = department.tasks.filter((task) => task.portable).length;

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        <Donut {...department.taskDistribution} />
        <div className="grid gap-3 md:grid-cols-3">
          <MiniMetric label="Completion rate" value="86%" detail="This month" />
          <MiniMetric label="Human avg time" value="42m" detail="Per task" />
          <MiniMetric label="Agent avg time" value="9m" detail="Per task" />
        </div>
      </div>

      <Card className="rounded-lg shadow-none">
        <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
          <CardTitle className="text-base">Task list</CardTitle>
          <Badge variant="secondary">{portableCount} portable to agents</Badge>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Assigned to</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>SLA</TableHead>
                <TableHead>Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {department.tasks.map((task) => (
                <TableRow key={task.name}>
                  <TableCell className="font-medium">
                    {task.name}
                    {task.portable ? (
                      <Badge className="ml-2" variant="outline">
                        Agent portable
                      </Badge>
                    ) : null}
                  </TableCell>
                  <TableCell>
                    <div>{task.assignee}</div>
                    <div className="text-muted-foreground text-xs">{task.mode}</div>
                  </TableCell>
                  <TableCell>{task.status}</TableCell>
                  <TableCell>{task.sla}</TableCell>
                  <TableCell>{task.cost}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
