import { Bot, GitBranch, History, Network, Sparkles, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { OrgNode } from "../data";

export function NodeInspectorDrawer({ nodes, node }: { nodes: OrgNode[]; node: OrgNode }) {
  const reports = nodes.filter((item) => item.parentId === node.id);
  const parent = nodes.find((item) => item.id === node.parentId);
  const branchCost = reports.length * 42 + Number.parseInt(node.cost.replace(/\D/g, "") || "0", 10);
  let HeaderIcon = UserRound;

  if (node.type === "Agent") {
    HeaderIcon = Bot;
  }

  if (node.type === "Hybrid") {
    HeaderIcon = Network;
  }

  return (
    <SheetContent className="!w-[min(96vw,820px)] !max-w-[min(96vw,820px)] overflow-y-auto p-0">
      <SheetHeader className="border-b p-5">
        <div className="flex items-start gap-3">
          <div className="flex size-11 items-center justify-center rounded-full bg-sky-50 text-sky-700">
            <HeaderIcon className="size-5" />
          </div>
          <div>
            <SheetTitle>{node.name}</SheetTitle>
            <SheetDescription>
              {node.role} - {node.department}
            </SheetDescription>
          </div>
          <Badge className="ml-auto" variant={node.isGhost ? "outline" : "secondary"}>
            {node.isGhost ? "Projected" : node.type}
          </Badge>
        </div>
      </SheetHeader>

      <Tabs defaultValue="overview">
        <div className="sticky top-0 z-10 overflow-x-auto border-b bg-background px-5 py-3">
          <TabsList className="grid min-w-[620px] grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="chain">Reports & Chain</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="impact">Projection Impact</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>
        </div>
        <div className="p-5">
          <TabsContent value="overview" className="m-0 grid gap-4">
            <div className="grid gap-3 md:grid-cols-3">
              <Info label="Monthly cost" value={node.cost} />
              <Info label="Token cost" value={node.tokenCost} />
              <Info label="Direct reports" value={`${reports.length}`} />
            </div>
            <div className="rounded-lg border p-4">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span>Agent suitability score</span>
                <span>{node.suitability}%</span>
              </div>
              <Progress value={node.suitability} />
              <p className="mt-3 text-muted-foreground text-sm">{node.suitabilityReason}</p>
            </div>
            <Info label="Reports to" value={parent ? `${parent.name} - ${parent.role}` : "Root node"} />
          </TabsContent>

          <TabsContent value="chain" className="m-0 grid gap-4">
            <div className="grid gap-3 md:grid-cols-3">
              <Info label="Chain depth" value={reports.length ? "2 levels" : "0 levels"} />
              <Info label="Branch members" value={`${reports.length + 1}`} />
              <Info label="Branch cost" value={`TRY ${branchCost}K`} />
            </div>
            <div className="rounded-lg border p-4">
              <div className="mb-3 flex items-center gap-2 font-medium">
                <GitBranch className="size-4" />
                Branch preview
              </div>
              <div className="grid gap-2">
                <Badge variant="secondary">{node.name}</Badge>
                {reports.map((report) => (
                  <div key={report.id} className="ml-5 rounded-lg border p-3 text-sm">
                    {report.name} - {report.role}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="m-0 grid gap-3">
            {node.history.map((item) => (
              <div key={item} className="flex gap-3 rounded-lg border p-3 text-sm">
                <History className="mt-0.5 size-4 text-muted-foreground" />
                <span>{item}</span>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="impact" className="m-0 grid gap-4">
            {Object.entries(node.projectedChanges).map(([stage, change]) => (
              <Info key={stage} label={stage} value={change} />
            ))}
            <div className="rounded-lg border bg-orange-50/70 p-4 dark:bg-orange-500/10">
              <div className="font-medium">Cost comparison</div>
              <p className="mt-1 text-muted-foreground text-sm">
                Current {node.cost}; projected 6 month impact +TRY 34K/mo.
              </p>
            </div>
            {node.isGhost ? (
              <Button className="w-fit bg-sky-600 text-white hover:bg-sky-700">
                <Sparkles /> Apply this projection now
              </Button>
            ) : null}
          </TabsContent>

          <TabsContent value="actions" className="m-0 flex flex-wrap gap-2">
            <Button>Add child node</Button>
            <Button variant="outline">Convert to Agent</Button>
            <Button variant="outline">Convert to Human</Button>
            <Button variant="outline">Edit details</Button>
            <Button variant="outline">Open full profile</Button>
            <Button variant="destructive">Remove node</Button>
          </TabsContent>
        </div>
      </Tabs>
    </SheetContent>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border p-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
