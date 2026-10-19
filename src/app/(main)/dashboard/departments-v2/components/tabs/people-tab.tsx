import { ArrowDownAZ } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import type { Department } from "../../data";

export function PeopleTab({ department }: { department: Department }) {
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline">
          Role: All
        </Button>
        <Button size="sm" variant="outline">
          <ArrowDownAZ /> Sort by cost
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Monthly cost</TableHead>
              <TableHead>Agents</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {department.peopleList.map((person) => (
              <TableRow key={person.name}>
                <TableCell className="font-medium">{person.name}</TableCell>
                <TableCell>{person.role}</TableCell>
                <TableCell>{person.level}</TableCell>
                <TableCell>{person.monthlyCost}</TableCell>
                <TableCell>{person.assignedAgents}</TableCell>
                <TableCell>{person.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
