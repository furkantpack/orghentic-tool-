import { Bot, Plus, Settings2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { Department } from "../../data";

export function ActionsTab({ department }: { department: Department }) {
  return (
    <div className="grid gap-4">
      <Card className="rounded-lg shadow-none">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-base">Recommended actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2 p-4 pt-2">
          {department.actions.map((action) => (
            <Badge key={action} variant="secondary">
              {action}
            </Badge>
          ))}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Button size="sm">
          <Settings2 /> Edit Department
        </Button>
        <Button size="sm" variant="outline">
          <Bot /> Add Agent
        </Button>
        <Button size="sm" variant="outline">
          <Plus /> Open Role
        </Button>
        <Button size="sm" variant="outline">
          Create Scenario
        </Button>
      </div>
    </div>
  );
}
