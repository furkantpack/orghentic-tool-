"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  ExternalLink,
  LoaderCircle,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  TriangleAlert,
  UserCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { evaluateTask, type TaskEvaluationInput, type TaskEvaluationResult } from "@/lib/task-transformation-engine";

const exampleTask: TaskEvaluationInput = {
  taskId: "task_991",
  taskName: "Categorize support requests",
  departmentId: "operations",
  inputOutputStructure: "semi_structured",
  judgmentLevel: "some_discretion",
  errorImpact: "easily_reversible",
  empathyRequired: "partial",
  exceptionFrequency: "sometimes",
  complianceApprovalRequired: false,
  linkedSystems: ["Zendesk"],
  tags: ["ticket-triage", "email-classification"],
  monthlyFrequency: 450,
};

type N8nMatch = {
  score: number;
  candidates: Array<{ templateId: number; templateName: string; matchScore: number; templateUrl: string }>;
};

export default function Page() {
  const [input, setInput] = useState<TaskEvaluationInput>(exampleTask);
  const [systems, setSystems] = useState("Zendesk");
  const [tags, setTags] = useState("ticket-triage, email-classification");
  const [marketplaceScore, setMarketplaceScore] = useState(82);
  const [accessScore, setAccessScore] = useState(90);
  const [result, setResult] = useState<TaskEvaluationResult | null>(null);
  const [n8nMatch, setN8nMatch] = useState<N8nMatch>({ score: 0, candidates: [] });
  const [n8nStatus, setN8nStatus] = useState<"idle" | "syncing" | "ready" | "fallback">("idle");

  useEffect(() => {
    const parsedTags = tags
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const linkedSystems = systems
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    if (!parsedTags.length) {
      setN8nMatch({ score: 0, candidates: [] });
      setN8nStatus("idle");
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setN8nStatus("syncing");
      try {
        const response = await fetch("/api/marketplace/n8n-match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tags: parsedTags, linkedSystems }),
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("n8n match unavailable");
        const match = (await response.json()) as N8nMatch;
        setN8nMatch(match);
        setN8nStatus(match.score > 0 ? "ready" : "fallback");
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setN8nMatch({ score: 0, candidates: [] });
        setN8nStatus("fallback");
      }
    }, 600);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [systems, tags]);

  function update<K extends keyof TaskEvaluationInput>(key: K, value: TaskEvaluationInput[K]) {
    setInput((current) => ({ ...current, [key]: value }));
    setResult(null);
  }

  function evaluate() {
    const evaluationInput = {
      ...input,
      linkedSystems: systems
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      tags: tags
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };
    setInput(evaluationInput);
    setResult(
      evaluateTask(evaluationInput, {
        getMarketplaceMatchScore: () => Math.max(marketplaceScore, n8nMatch.score),
        getSystemAccessibilityScore: () => accessScore,
      }),
    );
  }

  function loadExample() {
    setInput(exampleTask);
    setSystems("Zendesk");
    setTags("ticket-triage, email-classification");
    setMarketplaceScore(82);
    setAccessScore(90);
    setN8nMatch({ score: 0, candidates: [] });
    setResult(null);
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Button asChild variant="ghost" size="sm" className="-ml-3 mb-2">
            <Link href="/dashboard/design-library">
              <ArrowLeft /> Design Library
            </Link>
          </Button>
          <h1 className="text-3xl tracking-tight">Create Task Transformation</h1>
          <p className="mt-1 max-w-2xl text-muted-foreground text-sm">
            Score a task across structure, judgment, volume, access, risk, human touch, exceptions, tooling, and
            oversight.
          </p>
        </div>
        <Button variant="outline" onClick={loadExample}>
          <Sparkles /> Load support example
        </Button>
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Task inputs</CardTitle>
            <CardDescription>All fields map directly to the Task Transformation Engine.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 md:grid-cols-2">
            <Field label="Task name" className="md:col-span-2">
              <Input value={input.taskName} onChange={(event) => update("taskName", event.target.value)} />
            </Field>
            <Field label="Task ID">
              <Input value={input.taskId} onChange={(event) => update("taskId", event.target.value)} />
            </Field>
            <Field label="Department">
              <Select value={input.departmentId} onValueChange={(value) => update("departmentId", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operations">Operations</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="people">People</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <EnumField
              label="Input / output structure"
              value={input.inputOutputStructure}
              onChange={(value) => update("inputOutputStructure", value as TaskEvaluationInput["inputOutputStructure"])}
              options={[
                ["free_text", "Free text"],
                ["semi_structured", "Semi-structured"],
                ["fully_structured", "Fully structured"],
              ]}
            />
            <EnumField
              label="Judgment level"
              value={input.judgmentLevel}
              onChange={(value) => update("judgmentLevel", value as TaskEvaluationInput["judgmentLevel"])}
              options={[
                ["rule_based", "Rule based"],
                ["some_discretion", "Some discretion"],
                ["fully_subjective", "Fully subjective"],
              ]}
            />
            <EnumField
              label="Error impact"
              value={input.errorImpact}
              onChange={(value) => update("errorImpact", value as TaskEvaluationInput["errorImpact"])}
              options={[
                ["easily_reversible", "Easily reversible"],
                ["moderate_impact", "Moderate impact"],
                ["severe_legal_financial", "Severe legal / financial"],
              ]}
            />
            <EnumField
              label="Empathy required"
              value={input.empathyRequired}
              onChange={(value) => update("empathyRequired", value as TaskEvaluationInput["empathyRequired"])}
              options={[
                ["no", "No"],
                ["partial", "Partial"],
                ["yes", "Yes"],
              ]}
            />
            <EnumField
              label="Exception frequency"
              value={input.exceptionFrequency}
              onChange={(value) => update("exceptionFrequency", value as TaskEvaluationInput["exceptionFrequency"])}
              options={[
                ["rare", "Rare"],
                ["sometimes", "Sometimes"],
                ["frequent", "Frequent"],
              ]}
            />
            <Field label="Monthly frequency">
              <Input
                type="number"
                min="0"
                value={input.monthlyFrequency ?? 0}
                onChange={(event) => update("monthlyFrequency", Number(event.target.value))}
              />
            </Field>
            <Field label="Linked systems">
              <Input
                value={systems}
                onChange={(event) => {
                  setSystems(event.target.value);
                  setResult(null);
                }}
                placeholder="Zendesk, Email"
              />
            </Field>
            <Field label="Tags">
              <Input
                value={tags}
                onChange={(event) => {
                  setTags(event.target.value);
                  setResult(null);
                }}
                placeholder="ticket-triage, classification"
              />
            </Field>
            <Field label="Internal marketplace score">
              <Input
                type="number"
                min="0"
                max="100"
                value={marketplaceScore}
                onChange={(event) => {
                  setMarketplaceScore(Number(event.target.value));
                  setResult(null);
                }}
              />
            </Field>
            <Field label="System accessibility score">
              <Input
                type="number"
                min="0"
                max="100"
                value={accessScore}
                onChange={(event) => {
                  setAccessScore(Number(event.target.value));
                  setResult(null);
                }}
              />
            </Field>
            <div className="grid gap-3 rounded-xl border border-sky-200 bg-sky-50/60 p-4 md:col-span-2 dark:border-sky-500/20 dark:bg-sky-500/10">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="font-medium text-sm">n8n marketplace precompute</div>
                  <div className="mt-1 text-muted-foreground text-xs">
                    Server-side lookup saved in task state; the synchronous engine reads this precomputed score.
                  </div>
                </div>
                <Badge variant="secondary">
                  {n8nStatus === "syncing" ? (
                    <>
                      <LoaderCircle className="mr-1 size-3 animate-spin" /> Syncing
                    </>
                  ) : (
                    `n8n score: ${n8nMatch.score}`
                  )}
                </Badge>
              </div>
              {n8nStatus === "fallback" ? (
                <p className="text-amber-700 text-xs dark:text-amber-300">
                  n8n is unavailable or returned no match. The engine safely continues with a score of 0.
                </p>
              ) : null}
              {n8nMatch.candidates.length ? (
                <div className="grid gap-2 sm:grid-cols-2">
                  {n8nMatch.candidates.slice(0, 4).map((candidate) => (
                    <a
                      key={candidate.templateId}
                      href={candidate.templateUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between gap-3 rounded-lg border bg-background p-3 text-sm hover:border-sky-400"
                    >
                      <span className="line-clamp-1">{candidate.templateName}</span>
                      <span className="flex shrink-0 items-center gap-1 text-muted-foreground text-xs">
                        {candidate.matchScore} <ExternalLink className="size-3" />
                      </span>
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="flex items-center gap-3 rounded-xl border p-4 md:col-span-2">
              <Checkbox
                checked={input.complianceApprovalRequired}
                onCheckedChange={(checked) => update("complianceApprovalRequired", Boolean(checked))}
              />
              <div>
                <div className="font-medium text-sm">Compliance approval required</div>
                <div className="text-muted-foreground text-xs">
                  Combined with severe risk, this triggers the manual review gate.
                </div>
              </div>
            </div>
            <Button
              className="h-11 bg-violet-600 hover:bg-violet-700 md:col-span-2"
              onClick={evaluate}
              disabled={!input.taskName.trim()}
            >
              <Bot /> Run Transformation Engine
            </Button>
          </CardContent>
        </Card>

        <ResultPanel result={result} />
      </div>
    </div>
  );
}

function ResultPanel({ result }: { result: TaskEvaluationResult | null }) {
  if (!result) {
    return (
      <Card className="rounded-2xl border-dashed shadow-sm xl:sticky xl:top-20">
        <CardContent className="flex min-h-72 flex-col items-center justify-center p-8 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
            <Bot />
          </div>
          <CardTitle className="mt-4">Ready to evaluate</CardTitle>
          <CardDescription className="mt-2">
            Complete the inputs and run the engine to see the recommendation and score breakdown.
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden rounded-2xl pt-0 shadow-sm xl:sticky xl:top-20">
      <div
        className={
          result.gateTriggered
            ? "h-20 bg-gradient-to-r from-rose-500 to-orange-400"
            : "h-20 bg-gradient-to-r from-violet-500 via-fuchsia-400 to-sky-400"
        }
      />
      <CardContent className="grid gap-5 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardDescription>Engine recommendation</CardDescription>
            <CardTitle className="mt-1 text-xl">{result.recommendationLabel}</CardTitle>
          </div>
          <Badge className="text-sm" variant="secondary">
            {result.compositeScore}/100
          </Badge>
        </div>
        {result.gateTriggered ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-800 text-sm dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">
            <div className="flex items-center gap-2 font-medium">
              <ShieldAlert className="size-4" /> Gate triggered
            </div>
            <p className="mt-1">{result.gateReason}</p>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-emerald-700 text-sm dark:text-emerald-300">
            <CheckCircle2 className="size-4" /> No hard gate triggered
          </div>
        )}
        <div className="grid gap-3">
          {result.breakdown.map((item) => (
            <div key={item.key}>
              <div className="mb-1 flex items-center justify-between gap-2 text-xs">
                <span>{item.label}</span>
                <span className="text-muted-foreground">
                  {item.rawScore} × {item.weight} = {item.weightedContribution}
                </span>
              </div>
              <Progress value={item.rawScore} />
            </div>
          ))}
        </div>
        <RecommendationInsights result={result} />
      </CardContent>
    </Card>
  );
}

function RecommendationInsights({ result }: { result: TaskEvaluationResult }) {
  const ranked = [...result.breakdown].sort((a, b) => b.rawScore - a.rawScore);
  const strongest = ranked.slice(0, 2);
  const limiting = ranked.slice(-2).reverse();
  const recommendationCopy: Record<TaskEvaluationResult["recommendation"], string> = {
    full_agent: "The task is structured, repeatable, and low-risk enough for direct agent ownership.",
    hybrid: "An agent can perform the task, while a human should review exceptions and tone-sensitive decisions.",
    augmented_human:
      "Human ownership should remain, with an agent supporting research, preparation, and repetitive steps.",
    keep_human: "The task depends heavily on judgment, empathy, or risk management and should remain human-owned.",
    needs_review:
      "Compliance and severe risk triggered a hard gate, so the task requires manual review before assignment.",
    custom_dev_needed:
      "The task is automation-ready, but the current marketplace does not provide a strong enough agent match.",
  };

  return (
    <div className="grid gap-3 border-t pt-5">
      <div>
        <div className="font-semibold">Why this recommendation?</div>
        <p className="mt-1 text-muted-foreground text-sm">
          The engine combines nine weighted dimensions into a {result.compositeScore}/100 composite score.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/10">
          <div className="flex items-center gap-2 font-medium text-emerald-800 text-sm dark:text-emerald-200">
            <TrendingUp className="size-4" /> Strongest factors
          </div>
          <div className="mt-3 grid gap-2">
            {strongest.map((item) => (
              <div key={item.key} className="flex items-center justify-between gap-3 text-sm">
                <span>{item.label}</span>
                <Badge variant="secondary">{item.rawScore}/100</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-500/20 dark:bg-amber-500/10">
          <div className="flex items-center gap-2 font-medium text-amber-800 text-sm dark:text-amber-200">
            <TriangleAlert className="size-4" /> Limiting factors
          </div>
          <div className="mt-3 grid gap-2">
            {limiting.map((item) => (
              <div key={item.key} className="flex items-center justify-between gap-3 text-sm">
                <span>{item.label}</span>
                <Badge variant="secondary">{item.rawScore}/100</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-violet-200 bg-violet-50/70 p-4 dark:border-violet-500/20 dark:bg-violet-500/10">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-200">
            <UserCheck className="size-4" />
          </div>
          <div>
            <div className="font-medium text-violet-900 text-sm dark:text-violet-100">Recommended operating model</div>
            <p className="mt-1 text-muted-foreground text-sm leading-6">{recommendationCopy[result.recommendation]}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ children, className = "", label }: { children: React.ReactNode; className?: string; label: string }) {
  return (
    <div className={`grid gap-2 ${className}`}>
      <span className="font-medium text-sm">{label}</span>
      {children}
    </div>
  );
}

function EnumField({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  options: [string, string][];
  value: string;
}) {
  return (
    <Field label={label}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map(([optionValue, optionLabel]) => (
            <SelectItem key={optionValue} value={optionValue}>
              {optionLabel}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}
