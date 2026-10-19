import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import type { TrendDirection } from "../data";

export function MiniMetric({
  label,
  value,
  detail,
  className = "",
}: {
  label: string;
  value: string;
  detail?: string;
  className?: string;
}) {
  return (
    <div className={`rounded-lg border p-3 ${className}`}>
      <div className="text-muted-foreground text-xs">{label}</div>
      <div className="mt-1 font-semibold text-base">{value}</div>
      {detail ? <div className="mt-1 text-muted-foreground text-xs">{detail}</div> : null}
    </div>
  );
}

export function Trend({ direction, label }: { direction: TrendDirection; label: string }) {
  let className = "text-muted-foreground";
  let Icon = ArrowRight;

  if (direction === "up") {
    className = "text-emerald-600";
    Icon = ArrowUp;
  }

  if (direction === "down") {
    className = "text-red-600";
    Icon = ArrowDown;
  }

  return (
    <span className={`inline-flex items-center gap-1 text-xs ${className}`}>
      <Icon className="size-3" />
      {label}
    </span>
  );
}

export function DistributionBar({ human, agent, hybrid }: { human: number; agent: number; hybrid: number }) {
  return (
    <div className="space-y-2">
      <div className="flex h-2 overflow-hidden rounded-full bg-muted">
        <div className="bg-sky-500" style={{ width: `${human}%` }} />
        <div className="bg-violet-500" style={{ width: `${agent}%` }} />
        <div className="bg-teal-500" style={{ width: `${hybrid}%` }} />
      </div>
      <div className="flex flex-wrap gap-2 text-muted-foreground text-xs">
        <span>Human {human}%</span>
        <span>Agent {agent}%</span>
        <span>Hybrid {hybrid}%</span>
      </div>
    </div>
  );
}

export function Sparkline({ values, className = "bg-sky-500" }: { values: number[]; className?: string }) {
  return (
    <div className="flex h-12 items-end gap-1">
      {values.map((value) => (
        <div key={value} className={`flex-1 rounded-t-sm ${className}`} style={{ height: `${value}%` }} />
      ))}
    </div>
  );
}

export function Gauge({ value, label }: { value: number; label: string }) {
  return (
    <div className="grid place-items-center rounded-lg border p-4">
      <div
        className="grid size-28 place-items-center rounded-full"
        style={{ background: `conic-gradient(rgb(14 165 233) ${value * 3.6}deg, hsl(var(--muted)) 0deg)` }}
      >
        <div className="grid size-20 place-items-center rounded-full bg-background">
          <div className="text-center">
            <div className="font-semibold text-2xl">{value}%</div>
            <div className="text-muted-foreground text-xs">{label}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Donut({ human, agent, hybrid }: { human: number; agent: number; hybrid: number }) {
  const agentStart = human * 3.6;
  const hybridStart = (human + agent) * 3.6;
  const hybridLabel = `${hybrid}% hybrid`;

  return (
    <div className="grid place-items-center rounded-lg border p-4">
      <div
        className="grid size-32 place-items-center rounded-full"
        style={{
          background: `conic-gradient(rgb(14 165 233) 0deg ${agentStart}deg, rgb(139 92 246) ${agentStart}deg ${hybridStart}deg, rgb(20 184 166) ${hybridStart}deg 360deg)`,
        }}
      >
        <div className="grid size-20 place-items-center rounded-full bg-background">
          <div className="text-center text-xs">
            <div className="font-semibold">Tasks</div>
            <div className="text-muted-foreground">{agent}% agent</div>
            <div className="text-muted-foreground">{hybridLabel}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BudgetStack({
  human,
  agentToken,
  dev,
  consulting,
}: {
  human: number;
  agentToken: number;
  dev: number;
  consulting: number;
}) {
  return (
    <div className="space-y-2">
      <div className="flex h-3 overflow-hidden rounded-full bg-muted">
        <div className="bg-sky-500" style={{ width: `${human}%` }} />
        <div className="bg-violet-500" style={{ width: `${agentToken}%` }} />
        <div className="bg-orange-500" style={{ width: `${dev}%` }} />
        <div className="bg-red-500" style={{ width: `${consulting}%` }} />
      </div>
      <div className="grid gap-2 text-xs sm:grid-cols-4">
        <Badge variant="secondary">Human {human}%</Badge>
        <Badge variant="secondary">Agent {agentToken}%</Badge>
        <Badge variant="secondary">Dev {dev}%</Badge>
        <Badge variant="secondary">Consulting {consulting}%</Badge>
      </div>
    </div>
  );
}

export function ProgressMetric({ label, value, detail }: { label: string; value: number; detail: string }) {
  return (
    <div className="space-y-2 rounded-lg border p-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{detail}</span>
      </div>
      <Progress value={Math.min(value, 100)} />
    </div>
  );
}
