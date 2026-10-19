import { Search, WandSparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

export function CanvasToolbar() {
  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-background p-3 lg:flex-row lg:items-center lg:justify-between">
      <InputGroup className="h-9 lg:w-96">
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput placeholder="Search people, agents, roles, departments..." />
      </InputGroup>
      <div className="flex flex-wrap items-center gap-2 lg:justify-end">
        {["All departments", "Human", "Agent", "Hybrid", "Vacant", "Suggestions"].map((filter) => (
          <Button key={filter} size="sm" variant="outline">
            {filter}
          </Button>
        ))}
        <Button size="sm" className="bg-sky-600 text-white hover:bg-sky-700">
          <WandSparkles /> Apply changes
        </Button>
      </div>
    </div>
  );
}
