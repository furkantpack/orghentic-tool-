"use client";

import { useEffect, useMemo, useState } from "react";

import { Download, Maximize2, Minus, Network, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { CanvasToolbar } from "./components/canvas-toolbar";
import { NodeInspectorDrawer } from "./components/node-inspector-drawer";
import { OrgChartCanvas } from "./components/org-chart-canvas";
import { ProjectionSettingsModal } from "./components/projection-settings-modal";
import type { ProjectionView } from "./components/projection-toggle";
import { ProjectionToggle } from "./components/projection-toggle";
import { initialNodes, type OrgNode, projectionSummary } from "./data";

const STORAGE_KEY = "org-chart-v2-state-20260710";

export default function Page() {
  const [nodes, setNodes] = useState<OrgNode[]>(initialNodes);
  const [selectedId, setSelectedId] = useState("ceo");
  const [projection, setProjection] = useState<ProjectionView>("now");
  const [zoom, setZoom] = useState(0.86);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as {
        nodes?: OrgNode[];
        projection?: ProjectionView;
        selectedId?: string;
        zoom?: number;
      };
      if (Array.isArray(parsed.nodes)) setNodes(parsed.nodes);
      if (parsed.selectedId) setSelectedId(parsed.selectedId);
      if (parsed.projection) setProjection(parsed.projection);
      if (parsed.zoom) setZoom(parsed.zoom);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ nodes, selectedId, projection, zoom }));
  }, [nodes, selectedId, projection, zoom]);

  const selectedNode = nodes.find((node) => node.id === selectedId) ?? nodes[0];
  const visibleNodes = useMemo(
    () =>
      nodes.filter(
        (node) =>
          node.projectionStage === null ||
          projection === "12m" ||
          node.projectionStage === projection ||
          (projection === "6m" && node.projectionStage === "3m"),
      ),
    [nodes, projection],
  );

  function addChild(parent: OrgNode) {
    const next: OrgNode = {
      ...parent,
      id: `planned-${Date.now().toString(36)}`,
      parentId: parent.id,
      name: "New planned node",
      role: "Pending role",
      cost: "TRY 42K",
      tokenCost: "TRY 0",
      type: "Vacant",
      color: "orange",
      childCount: 0,
      isPlanned: true,
      isGhost: false,
      projectionStage: null,
      position: { x: parent.position.x + 440, y: parent.position.y + 330 },
      history: ["Created from canvas"],
      projectedChanges: { "3m": "Review", "6m": "Approve or convert", "12m": "Stabilize role" },
    };
    setNodes((current) => [...current, next]);
    setSelectedId(next.id);
    setDrawerOpen(true);
  }

  function moveNode(nodeId: string, position: { x: number; y: number }) {
    setNodes((current) => current.map((node) => (node.id === nodeId ? { ...node, position } : node)));
  }

  function selectNode(node: OrgNode) {
    setSelectedId(node.id);
    setDrawerOpen(true);
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <span>Dashboard</span>
            <span>/</span>
            <span>Org Chart v2</span>
          </div>
          <h1 className="mt-1 text-2xl tracking-tight">Org Chart Workspace v2</h1>
          <p className="mt-1 max-w-3xl text-muted-foreground text-sm">
            Pan, zoom, project, and inspect a live organization canvas for people, agents, hybrid seats, and future
            roles.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ProjectionSettingsModal />
          <Button size="sm" variant="outline">
            <Download /> Export
          </Button>
          <Button size="sm" className="bg-sky-600 text-white hover:bg-sky-700">
            <Plus /> Add node
          </Button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <Summary
          label="Active nodes"
          value={`${nodes.filter((node) => !node.isGhost).length}`}
          tone="bg-sky-50/80 dark:bg-sky-500/10"
        />
        <Summary
          label="Projected nodes"
          value={`${nodes.filter((node) => node.isGhost).length}`}
          tone="bg-slate-50 dark:bg-slate-500/10"
        />
        <Summary
          label="Agent seats"
          value={`${nodes.filter((node) => node.type === "Agent").length}`}
          tone="bg-violet-50/80 dark:bg-violet-500/10"
        />
        <Summary label="Monthly tracked" value="TRY 615K" tone="bg-orange-50/80 dark:bg-orange-500/10" />
      </div>

      <CanvasToolbar />

      <Tabs defaultValue="workspace" className="gap-3">
        <div className="flex items-center justify-end">
          <TabsList className="w-fit">
            <TabsTrigger value="workspace">
              <Network /> Workspace
            </TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="workspace" className="m-0">
          <Card className="rounded-lg shadow-none">
            <CardHeader className="p-4 pb-2">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0">
                  <CardTitle className="text-base">Live canvas</CardTitle>
                  <CardDescription className="mt-1 max-w-2xl">
                    Drag the canvas to pan, drag nodes to reposition, scroll over the workspace to zoom, and click any
                    node for details.
                  </CardDescription>
                  <Badge variant="outline" className="mt-3 px-3 py-1">
                    {projectionSummary[projection]}
                  </Badge>
                </div>
                <div className="flex flex-col gap-3 xl:items-end">
                  <div className="grid gap-1">
                    <div className="font-medium text-muted-foreground text-xs">Projection timeline</div>
                    <ProjectionToggle value={projection} onChange={setProjection} />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
                <div className="relative">
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
                    <div className="flex items-center gap-1 rounded-md border bg-background/95 p-1 shadow-sm backdrop-blur">
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        aria-label="Zoom out"
                        onClick={() => setZoom((current) => Math.max(current - 0.1, 0.55))}
                      >
                        <Minus />
                      </Button>
                      <Button size="sm" variant="ghost" className="w-16">
                        {Math.round(zoom * 100)}%
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        aria-label="Zoom in"
                        onClick={() => setZoom((current) => Math.min(current + 0.1, 1.4))}
                      >
                        <Plus />
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-background/95 shadow-sm backdrop-blur"
                      onClick={() => setZoom(0.86)}
                    >
                      <Maximize2 /> Fit
                    </Button>
                  </div>
                  <OrgChartCanvas
                    nodes={nodes}
                    onAddChild={addChild}
                    onMoveNode={moveNode}
                    onSelect={selectNode}
                    onWheelZoom={(direction) =>
                      setZoom((current) =>
                        direction === "in" ? Math.min(current + 0.06, 1.4) : Math.max(current - 0.06, 0.55),
                      )
                    }
                    projection={projection}
                    selectedId={selectedId}
                    zoom={zoom}
                  />
                </div>
                <SheetTrigger asChild>
                  <Button className="mt-3" variant="outline" onClick={() => setDrawerOpen(true)}>
                    Open selected node drawer
                  </Button>
                </SheetTrigger>
                <NodeInspectorDrawer node={selectedNode} nodes={visibleNodes} />
              </Sheet>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="list" className="m-0">
          <Card className="rounded-lg shadow-none">
            <CardContent className="divide-y p-0">
              {visibleNodes.map((node) => (
                <button
                  key={node.id}
                  type="button"
                  className="grid w-full gap-3 p-4 text-left text-sm hover:bg-muted/30 md:grid-cols-[1.2fr_1fr_1fr_1fr_1fr]"
                  onClick={() => setSelectedId(node.id)}
                >
                  <div>
                    <div className="font-medium">{node.name}</div>
                    <div className="text-muted-foreground">{node.role}</div>
                  </div>
                  <span>{node.department}</span>
                  <Badge variant={node.isGhost ? "outline" : "secondary"}>
                    {node.isGhost ? "Projected" : node.type}
                  </Badge>
                  <span>{node.cost}</span>
                  <span>{node.parentId ?? "Root"}</span>
                </button>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Summary({ label, tone, value }: { label: string; tone: string; value: string }) {
  return (
    <Card className="rounded-lg shadow-none">
      <CardContent className={`rounded-lg p-4 ${tone}`}>
        <div className="text-muted-foreground text-xs">{label}</div>
        <div className="mt-1 font-semibold text-2xl">{value}</div>
      </CardContent>
    </Card>
  );
}
