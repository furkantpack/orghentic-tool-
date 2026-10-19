"use client";

import { useState } from "react";

import Link from "next/link";

import {
  ArrowUp,
  Binoculars,
  CornerDownRight,
  FileUp,
  Focus,
  Monitor,
  Plus,
  Smartphone,
  Trash2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  evaluateTasksBulk,
  type TaskEvaluationInput,
  type TaskEvaluationResult,
} from "@/lib/task-transformation-engine";

type Mode = "research" | "web" | "ios";
type Category = "Popular" | "Inspiration" | "Onboarding" | "Workflows";

const suggestions: Record<Category, string[]> = {
  Popular: [
    "Roadmap boards and product planning timelines",
    "Data tables with filters",
    "Integration directory layouts",
    "AI SaaS product landing pages",
    "SaaS onboarding to first value",
    "Search results with filter sidebars",
  ],
  Inspiration: [
    "AI assistant command centers",
    "Editorial dashboards with visual hierarchy",
    "Modern finance overview cards",
    "Collaborative planning workspaces",
    "Agent marketplace experiences",
    "Interactive organization maps",
  ],
  Onboarding: [
    "Multi-step workspace setup",
    "Progressive profile completion",
    "Team invitation flows",
    "Connected tool setup journeys",
    "Role and permission onboarding",
    "Plan selection experiences",
  ],
  Workflows: [
    "Human approval workflow builders",
    "Agent task routing interfaces",
    "Automation run monitoring",
    "Scenario comparison flows",
    "Escalation and handoff patterns",
    "Recurring review workflows",
  ],
};

const categoryTones: Record<Category, { active: string; idle: string }> = {
  Popular: {
    active:
      "border-sky-300 bg-sky-100 text-sky-800 shadow-sm dark:border-sky-500/30 dark:bg-sky-500/20 dark:text-sky-200",
    idle: "border-sky-100 bg-sky-50/70 text-sky-700 hover:bg-sky-100 dark:border-sky-500/15 dark:bg-sky-500/10 dark:text-sky-300",
  },
  Inspiration: {
    active:
      "border-violet-300 bg-violet-100 text-violet-800 shadow-sm dark:border-violet-500/30 dark:bg-violet-500/20 dark:text-violet-200",
    idle: "border-violet-100 bg-violet-50/70 text-violet-700 hover:bg-violet-100 dark:border-violet-500/15 dark:bg-violet-500/10 dark:text-violet-300",
  },
  Onboarding: {
    active:
      "border-emerald-300 bg-emerald-100 text-emerald-800 shadow-sm dark:border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-200",
    idle: "border-emerald-100 bg-emerald-50/70 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500/15 dark:bg-emerald-500/10 dark:text-emerald-300",
  },
  Workflows: {
    active:
      "border-orange-300 bg-orange-100 text-orange-800 shadow-sm dark:border-orange-500/30 dark:bg-orange-500/20 dark:text-orange-200",
    idle: "border-orange-100 bg-orange-50/70 text-orange-700 hover:bg-orange-100 dark:border-orange-500/15 dark:bg-orange-500/10 dark:text-orange-300",
  },
};

export default function Page() {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<Mode>("research");
  const [category, setCategory] = useState<Category>("Popular");
  const [showIntro, setShowIntro] = useState(true);
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [taskModalOpen, setTaskModalOpen] = useState(false);

  function submitResearch() {
    const value = query.trim();
    if (!value) return;
    setSubmittedQuery(value);
  }

  return (
    <div className="min-h-[calc(100dvh-7rem)] bg-background">
      <div className="mx-auto flex w-full max-w-5xl flex-col px-2 py-8 md:py-14">
        <div className="text-center">
          <h1 className="font-serif text-5xl leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
            The{" "}
            <span className="bg-gradient-to-r from-violet-700 via-fuchsia-500 to-rose-500 bg-clip-text text-transparent">
              design library you
            </span>{" "}
            <span className="bg-gradient-to-r from-orange-600 to-amber-300 bg-clip-text text-transparent">
              can talk to
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground leading-7">
            Real product screens, flows, and patterns to help designers, builders and AI make better design decisions.
          </p>
        </div>

        <div className="mt-8 overflow-hidden rounded-[30px] border border-slate-200 bg-background shadow-[0_18px_55px_rgba(15,23,42,0.05)] dark:border-border">
          {showIntro ? (
            <div className="flex items-start justify-between gap-5 px-5 pt-5 pb-4">
              <div>
                <div className="font-semibold text-lg">Meet new research mode</div>
                <p className="mt-1 text-muted-foreground text-sm">
                  Describe your task, get analysis, references, and reasoning back.
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setShowIntro(false)}
                aria-label="Close introduction"
              >
                <X />
              </Button>
            </div>
          ) : null}

          <div className="rounded-[28px] border border-slate-200 bg-slate-50/80 p-4 dark:border-border dark:bg-muted/40">
            <textarea
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if ((event.metaKey || event.ctrlKey) && event.key === "Enter") submitResearch();
              }}
              className="min-h-24 w-full resize-none bg-transparent px-1 text-lg outline-none placeholder:text-slate-400"
              placeholder="Describe a task or ask a question"
              aria-label="Research question"
            />

            <div className="flex flex-wrap items-center gap-2">
              <Button size="icon" variant="outline" className="rounded-full bg-background" aria-label="Focus search">
                <Focus />
              </Button>
              <ModeButton active={mode === "research"} onClick={() => setMode("research")} icon={<Binoculars />}>
                Organization Planning
              </ModeButton>
              <ModeButton
                active={mode === "web"}
                onClick={() => {
                  setMode("web");
                  setTaskModalOpen(true);
                }}
                icon={<Monitor />}
              >
                Task Transformation
              </ModeButton>
              <ModeButton active={mode === "ios"} onClick={() => setMode("ios")} icon={<Smartphone />}>
                Financial Plan
              </ModeButton>
              <Button
                size="icon"
                className="ml-auto rounded-full"
                disabled={!query.trim()}
                onClick={submitResearch}
                aria-label="Submit research"
              >
                <ArrowUp />
              </Button>
            </div>
          </div>
        </div>

        {submittedQuery ? (
          <div className="mt-4 rounded-2xl border border-violet-200 bg-violet-50/60 px-4 py-3 text-sm dark:border-violet-500/20 dark:bg-violet-500/10">
            Researching <span className="font-medium">“{submittedQuery}”</span> in {getModeLabel(mode)}.
          </div>
        ) : null}

        <div className="mt-10">
          <div className="flex flex-wrap gap-2">
            {(Object.keys(suggestions) as Category[]).map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => setCategory(item)}
                className={`rounded-2xl border px-6 py-3 text-sm font-medium transition ${
                  category === item ? categoryTones[item].active : categoryTones[item].idle
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="mt-5 grid gap-x-16 gap-y-5 md:grid-cols-2">
            {suggestions[category].map((suggestion) => (
              <button
                type="button"
                key={suggestion}
                className="group flex items-center gap-3 text-left text-base hover:text-violet-700 dark:hover:text-violet-300"
                onClick={() => {
                  setQuery(suggestion);
                  setSubmittedQuery(suggestion);
                }}
              >
                <CornerDownRight className="size-5 shrink-0 text-slate-400 transition group-hover:text-violet-500" />
                <span>{suggestion}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <TaskTransformationDialog open={taskModalOpen} onOpenChange={setTaskModalOpen} />
    </div>
  );
}

function getModeLabel(mode: Mode) {
  if (mode === "research") return "Organization Planning";
  if (mode === "web") return "Task Transformation";
  return "Financial Plan";
}

function TaskTransformationDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [taskName, setTaskName] = useState("");
  const [department, setDepartment] = useState("operations");
  const [frequency, setFrequency] = useState("40");
  const [structure, setStructure] = useState<TaskEvaluationInput["inputOutputStructure"]>("semi_structured");
  const [tasks, setTasks] = useState<TaskEvaluationInput[]>([]);
  const [results, setResults] = useState<TaskEvaluationResult[]>([]);

  function makeTask(name: string, index: number): TaskEvaluationInput {
    return {
      taskId: `task-${Date.now()}-${index}`,
      taskName: name,
      departmentId: department,
      inputOutputStructure: structure,
      judgmentLevel: "some_discretion",
      errorImpact: "moderate_impact",
      empathyRequired: "partial",
      exceptionFrequency: "sometimes",
      complianceApprovalRequired: false,
      linkedSystems: ["Email", "Workspace"],
      tags: name.toLowerCase().split(/\s+/).filter(Boolean),
      monthlyFrequency: Number(frequency) || 0,
    };
  }

  function addTask() {
    const name = taskName.trim();
    if (!name) return;
    setTasks((items) => [...items, makeTask(name, items.length)]);
    setTaskName("");
    setResults([]);
  }

  async function importTasks(file: File) {
    const content = await file.text();
    let names: string[] = [];
    if (file.name.endsWith(".json")) {
      try {
        const parsed = JSON.parse(content) as Array<string | { name?: string; taskName?: string }>;
        names = parsed.map((item) => (typeof item === "string" ? item : (item.taskName ?? item.name ?? "")));
      } catch {
        names = [];
      }
    } else {
      names = content
        .split(/\r?\n/)
        .map((line) => line.split(",")[0]?.trim() ?? "")
        .filter((line, index) => line && !(index === 0 && /^(task|name)$/i.test(line)));
    }
    const imported = names.filter(Boolean).map((name, index) => makeTask(name, index));
    setTasks((items) => [...items, ...imported]);
    setResults([]);
  }

  function runEngine() {
    setResults(
      evaluateTasksBulk(tasks, {
        getMarketplaceMatchScore: (tags) => Math.min(92, 45 + tags.length * 8),
        getSystemAccessibilityScore: (systems) => (systems.length ? 80 : 15),
      }),
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88dvh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Task Transformation</DialogTitle>
          <DialogDescription>
            Import tasks or add them manually, then evaluate their human-to-agent transformation fit.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5">
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed p-5 text-sm transition hover:border-violet-400 hover:bg-violet-50/50 dark:hover:bg-violet-500/10">
            <FileUp className="size-4" /> Import CSV, JSON, or TXT
            <input
              className="sr-only"
              type="file"
              accept=".csv,.json,.txt"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void importTasks(file);
                event.target.value = "";
              }}
            />
          </label>

          <Button asChild className="h-11 bg-violet-600 hover:bg-violet-700">
            <Link href="/dashboard/design-library/task-create">
              <Plus /> Create a new task
            </Link>
          </Button>

          <div className="grid gap-3 rounded-2xl border p-4 md:grid-cols-2">
            <div className="grid gap-2 md:col-span-2">
              <span className="font-medium text-sm">Task name</span>
              <Input
                value={taskName}
                onChange={(event) => setTaskName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") addTask();
                }}
                placeholder="e.g. Review incoming support tickets"
              />
            </div>
            <div className="grid gap-2">
              <span className="font-medium text-sm">Department</span>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operations">Operations</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <span className="font-medium text-sm">Monthly frequency</span>
              <Input type="number" min="0" value={frequency} onChange={(event) => setFrequency(event.target.value)} />
            </div>
            <div className="grid gap-2 md:col-span-2">
              <span className="font-medium text-sm">Input/output structure</span>
              <Select
                value={structure}
                onValueChange={(value) => setStructure(value as TaskEvaluationInput["inputOutputStructure"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fully_structured">Fully structured</SelectItem>
                  <SelectItem value="semi_structured">Semi-structured</SelectItem>
                  <SelectItem value="free_text">Free text</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="md:col-span-2" variant="outline" onClick={addTask} disabled={!taskName.trim()}>
              <Plus /> Add task
            </Button>
          </div>

          {tasks.length ? (
            <div className="grid gap-2">
              {tasks.map((task) => (
                <div key={task.taskId} className="flex items-center gap-3 rounded-xl border p-3">
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium text-sm">{task.taskName}</div>
                    <div className="text-muted-foreground text-xs">
                      {task.departmentId} · {task.monthlyFrequency} times/month
                    </div>
                  </div>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => setTasks((items) => items.filter((item) => item.taskId !== task.taskId))}
                  >
                    <Trash2 />
                  </Button>
                </div>
              ))}
              <Button onClick={runEngine}>
                Evaluate {tasks.length} task{tasks.length === 1 ? "" : "s"}
              </Button>
            </div>
          ) : null}

          {results.length ? (
            <div className="grid gap-3 border-t pt-5">
              {results.map((result) => (
                <div key={result.taskId} className="rounded-2xl border bg-muted/20 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="font-medium">{result.taskName}</div>
                    <div className="rounded-full bg-violet-100 px-3 py-1 font-medium text-violet-700 text-xs dark:bg-violet-500/15 dark:text-violet-300">
                      {result.recommendationLabel} · {result.compositeScore}/100
                    </div>
                  </div>
                  <p className="mt-2 text-muted-foreground text-sm">{result.explanation}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ModeButton({
  active,
  children,
  icon,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      className={`rounded-full bg-background px-5 ${active ? "border-slate-300 text-foreground shadow-sm" : "text-muted-foreground"}`}
      onClick={onClick}
    >
      {icon}
      {children}
    </Button>
  );
}
