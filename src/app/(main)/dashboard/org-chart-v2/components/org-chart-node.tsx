"use client";

import { Bot, MoreHorizontal, Network, Plus, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { colorMap, type OrgNode, projectionStageStyles } from "../data";

export function OrgChartNode({
  childCount,
  node,
  onAddChild,
  selected,
}: {
  childCount: number;
  node: OrgNode;
  onAddChild: () => void;
  selected: boolean;
}) {
  const color = colorMap[node.color];
  const projectionStyle = node.projectionStage ? projectionStageStyles[node.projectionStage] : null;
  let Icon = UserRound;
  let nodeStateClass = "border-border";

  if (node.type === "Agent") {
    Icon = Bot;
  }

  if (node.type === "Hybrid") {
    Icon = Network;
  }

  if (node.type === "Vacant") {
    Icon = Plus;
  }

  if (node.isGhost) {
    nodeStateClass = projectionStyle
      ? `${projectionStyle.border} border-dashed shadow-sm`
      : "border-slate-300 border-dashed opacity-70";
  } else if (node.isPlanned) {
    nodeStateClass = "border-orange-400 shadow-orange-500/10 ring-2 ring-orange-500/10";
  }

  return (
    <div>
      <div
        className={`group flex min-h-56 w-80 flex-col rounded-lg border bg-background p-4 text-left shadow-xs transition hover:-translate-y-0.5 hover:shadow-sm ${nodeStateClass} ${selected ? "ring-3 ring-sky-500/25" : ""}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className={`flex size-10 shrink-0 items-center justify-center rounded-full ${
                node.isGhost && projectionStyle ? projectionStyle.soft : color.soft
              }`}
            >
              <Icon className="size-5" />
            </div>
            <div className="min-w-0">
              <div className="truncate font-semibold">{node.name}</div>
              <div className="truncate text-muted-foreground text-sm">{node.role}</div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon-sm"
                variant="ghost"
                aria-label={`${node.name} menu`}
                data-node-control="true"
                onClick={(event) => event.stopPropagation()}
              >
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Open details</DropdownMenuItem>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>{node.type === "Agent" ? "Convert to Human" : "Convert to Agent"}</DropdownMenuItem>
              <DropdownMenuItem>Clone</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant={node.type === "Vacant" ? "outline" : "secondary"}>{node.type}</Badge>
          {node.isPlanned ? <Badge className="bg-orange-100 text-orange-700">Planned</Badge> : null}
          {node.isGhost && projectionStyle ? (
            <Badge variant="outline" className={projectionStyle.badge}>
              {projectionStyle.label}
            </Badge>
          ) : null}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div>
            <div className="text-muted-foreground">Department</div>
            <div className="truncate font-medium">{node.department}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Cost</div>
            <div className="truncate font-medium">{node.cost}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Children</div>
            <div className="font-medium">{childCount}</div>
          </div>
          <div>
            <div className="text-muted-foreground">{node.type === "Agent" ? "Token" : "Tracking"}</div>
            <div className="truncate font-medium">{node.type === "Agent" ? node.tokenCost : "Cost tracked"}</div>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between border-t pt-3 text-xs">
          <span className="text-muted-foreground">Manage reports</span>
          <Button
            type="button"
            size="sm"
            variant="outline"
            aria-label={`Add child to ${node.name}`}
            data-node-control="true"
            onClick={(event) => {
              event.stopPropagation();
              onAddChild();
            }}
          >
            <Plus /> Add child
          </Button>
        </div>
      </div>
    </div>
  );
}
