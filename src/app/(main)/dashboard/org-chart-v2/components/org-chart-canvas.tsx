"use client";

import { useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";

import { type OrgNode, projectionStageStyles } from "../data";
import { OrgChartEdge } from "./org-chart-edge";
import { OrgChartNode } from "./org-chart-node";
import type { ProjectionView } from "./projection-toggle";

export function OrgChartCanvas({
  nodes,
  onAddChild,
  onMoveNode,
  onSelect,
  onWheelZoom,
  projection,
  selectedId,
  zoom,
}: {
  nodes: OrgNode[];
  onAddChild: (node: OrgNode) => void;
  onMoveNode: (nodeId: string, position: { x: number; y: number }) => void;
  onSelect: (node: OrgNode) => void;
  onWheelZoom: (direction: "in" | "out") => void;
  projection: ProjectionView;
  selectedId: string;
  zoom: number;
}) {
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const draggingNode = useRef<{
    id: string;
    moved: boolean;
    nodeX: number;
    nodeY: number;
    startX: number;
    startY: number;
  } | null>(null);
  const visibleNodes = nodes.filter(
    (node) =>
      node.projectionStage === null ||
      projection === "12m" ||
      node.projectionStage === projection ||
      (projection === "6m" && node.projectionStage === "3m"),
  );
  const edges = visibleNodes
    .filter((node) => node.parentId)
    .map((node) => ({ to: node, from: visibleNodes.find((item) => item.id === node.parentId) }))
    .filter((edge): edge is { to: OrgNode; from: OrgNode } => Boolean(edge.from));

  return (
    <div
      className="relative h-[760px] overflow-hidden rounded-lg border bg-background dark:bg-muted/20"
      onPointerDown={(event) => {
        lastPoint.current = { x: event.clientX, y: event.clientY };
      }}
      onPointerMove={(event) => {
        if (draggingNode.current) return;
        if (!lastPoint.current || event.buttons !== 1) return;
        const dx = event.clientX - lastPoint.current.x;
        const dy = event.clientY - lastPoint.current.y;
        lastPoint.current = { x: event.clientX, y: event.clientY };
        setPan((current) => ({ x: current.x + dx, y: current.y + dy }));
      }}
      onPointerUp={() => {
        lastPoint.current = null;
      }}
      onWheel={(event) => {
        event.preventDefault();
        onWheelZoom(event.deltaY < 0 ? "in" : "out");
      }}
    >
      <div className="absolute inset-0 bg-[length:22px_22px] bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.12)_1px,transparent_1px)]" />
      <div
        className="absolute origin-top-left transition-transform"
        style={{
          transform: `translate(${pan.x + 40}px, ${pan.y + 30}px) scale(${zoom})`,
          width: 2300,
          height: 1100,
        }}
      >
        <svg className="absolute inset-0 size-full" aria-hidden="true">
          {edges.map((edge) => (
            <OrgChartEdge key={`${edge.from.id}-${edge.to.id}`} from={edge.from} to={edge.to} />
          ))}
        </svg>
        {visibleNodes.map((node) => (
          <div
            key={node.id}
            className="absolute cursor-grab active:cursor-grabbing"
            style={{ left: node.position.x, top: node.position.y }}
            onPointerDown={(event) => {
              if ((event.target as HTMLElement).closest("[data-node-control]")) return;
              event.stopPropagation();
              lastPoint.current = null;
              draggingNode.current = {
                id: node.id,
                moved: false,
                nodeX: node.position.x,
                nodeY: node.position.y,
                startX: event.clientX,
                startY: event.clientY,
              };
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerMove={(event) => {
              if (!draggingNode.current || draggingNode.current.id !== node.id) return;
              const dx = (event.clientX - draggingNode.current.startX) / zoom;
              const dy = (event.clientY - draggingNode.current.startY) / zoom;

              if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
                draggingNode.current.moved = true;
              }

              onMoveNode(node.id, {
                x: Math.max(0, Math.round(draggingNode.current.nodeX + dx)),
                y: Math.max(0, Math.round(draggingNode.current.nodeY + dy)),
              });
            }}
            onPointerUp={(event) => {
              event.stopPropagation();
              const dragState = draggingNode.current;
              draggingNode.current = null;

              if (dragState && !dragState.moved) {
                onSelect(node);
              }
            }}
          >
            <OrgChartNode
              childCount={visibleNodes.filter((item) => item.parentId === node.id).length}
              node={node}
              onAddChild={() => onAddChild(node)}
              selected={node.id === selectedId}
            />
          </div>
        ))}
      </div>

      <div className="absolute right-4 bottom-4 h-32 w-44 rounded-lg border bg-background/90 p-2 shadow-sm backdrop-blur">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-medium text-xs">Minimap</span>
          <Badge variant="outline">{visibleNodes.length} nodes</Badge>
        </div>
        <div className="relative h-20 rounded bg-muted/50">
          {visibleNodes.map((node) => (
            <span
              key={node.id}
              className={`absolute size-2 rounded-full ${
                node.projectionStage ? projectionStageStyles[node.projectionStage].minimap : "bg-sky-500"
              }`}
              style={{ left: `${node.position.x / 23}%`, top: `${node.position.y / 11}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
