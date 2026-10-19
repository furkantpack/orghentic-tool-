export interface TaskEvaluationInput {
  taskId: string;
  taskName: string;
  departmentId: string;
  inputOutputStructure: "free_text" | "semi_structured" | "fully_structured";
  judgmentLevel: "rule_based" | "some_discretion" | "fully_subjective";
  errorImpact: "easily_reversible" | "moderate_impact" | "severe_legal_financial";
  empathyRequired: "no" | "partial" | "yes";
  exceptionFrequency: "rare" | "sometimes" | "frequent";
  complianceApprovalRequired: boolean;
  linkedSystems: string[];
  tags: string[];
  monthlyFrequency?: number;
}

export interface TaskEvaluationContext {
  getMarketplaceMatchScore: (tags: string[]) => number;
  getSystemAccessibilityScore: (linkedSystems: string[]) => number;
  getHistoricalMonthlyFrequency?: (taskId: string) => number;
}

export type TaskRecommendation =
  | "full_agent"
  | "hybrid"
  | "augmented_human"
  | "keep_human"
  | "needs_review"
  | "custom_dev_needed";

export interface ScoreDimension {
  key: string;
  label: string;
  rawScore: number;
  weight: number;
  weightedContribution: number;
}

export interface TaskEvaluationResult {
  taskId: string;
  taskName: string;
  compositeScore: number;
  recommendation: TaskRecommendation;
  recommendationLabel: string;
  gateTriggered: boolean;
  gateReason: string | null;
  breakdown: ScoreDimension[];
  explanation: string;
}

export interface EngineConfig {
  weights: Record<
    | "structure"
    | "judgment"
    | "volume"
    | "systemAccess"
    | "risk"
    | "humanTouch"
    | "exceptionRate"
    | "tooling"
    | "oversight",
    number
  >;
  bands: { fullAgentMin: number; hybridMin: number; augmentedMin: number };
  gates: { riskGateThreshold: number };
  customDev: { minCompositeForCustomDev: number; maxToolingForCustomDev: number };
  volumeSaturationPoint: number;
}

export const DEFAULT_ENGINE_CONFIG: EngineConfig = {
  weights: {
    structure: 0.18,
    judgment: 0.15,
    volume: 0.15,
    systemAccess: 0.12,
    risk: 0.15,
    humanTouch: 0.1,
    exceptionRate: 0.08,
    tooling: 0.05,
    oversight: 0.02,
  },
  bands: { fullAgentMin: 80, hybridMin: 55, augmentedMin: 30 },
  gates: { riskGateThreshold: 80 },
  customDev: { minCompositeForCustomDev: 55, maxToolingForCustomDev: 20 },
  volumeSaturationPoint: 200,
};

const labels: Record<TaskRecommendation, string> = {
  full_agent: "Full Agent Candidate",
  hybrid: "Hybrid (Agent + Human Review)",
  augmented_human: "Augmented Human",
  keep_human: "Keep Human",
  needs_review: "Needs Review",
  custom_dev_needed: "Custom Dev Needed",
};

const round2 = (value: number) => Math.round(value * 100) / 100;
const clamp = (value: number) => Math.max(0, Math.min(100, value));

export function evaluateTask(
  input: TaskEvaluationInput,
  context: TaskEvaluationContext,
  config = DEFAULT_ENGINE_CONFIG,
): TaskEvaluationResult {
  const scores = {
    structure: { fully_structured: 100, semi_structured: 60, free_text: 20 }[input.inputOutputStructure],
    judgment: { rule_based: 100, some_discretion: 55, fully_subjective: 10 }[input.judgmentLevel],
    volume: Math.min(
      100,
      Math.round(
        ((input.monthlyFrequency ?? context.getHistoricalMonthlyFrequency?.(input.taskId) ?? 0) /
          config.volumeSaturationPoint) *
          100,
      ),
    ),
    systemAccess: clamp(context.getSystemAccessibilityScore(input.linkedSystems)),
    risk: { easily_reversible: 100, moderate_impact: 55, severe_legal_financial: 10 }[input.errorImpact],
    humanTouch: { no: 100, partial: 50, yes: 10 }[input.empathyRequired],
    exceptionRate: { rare: 100, sometimes: 55, frequent: 15 }[input.exceptionFrequency],
    tooling: clamp(context.getMarketplaceMatchScore(input.tags)),
    oversight: input.complianceApprovalRequired ? 20 : 100,
  };

  const dimensionLabels: Record<keyof typeof scores, string> = {
    structure: "Structure",
    judgment: "Decision Complexity",
    volume: "Repetition & Volume",
    systemAccess: "System Accessibility",
    risk: "Risk & Reversibility",
    humanTouch: "Human Touch",
    exceptionRate: "Exception Rate",
    tooling: "Tool Maturity",
    oversight: "Oversight Need",
  };
  const breakdown = (Object.keys(scores) as Array<keyof typeof scores>).map((key) => ({
    key,
    label: dimensionLabels[key],
    rawScore: scores[key],
    weight: config.weights[key],
    weightedContribution: round2(scores[key] * config.weights[key]),
  }));
  const compositeScore = round2(breakdown.reduce((sum, item) => sum + item.weightedContribution, 0));
  const severeGate = input.complianceApprovalRequired && input.errorImpact === "severe_legal_financial";
  let recommendation: TaskRecommendation;
  if (severeGate) recommendation = "needs_review";
  else if (
    compositeScore >= config.customDev.minCompositeForCustomDev &&
    scores.tooling < config.customDev.maxToolingForCustomDev
  )
    recommendation = "custom_dev_needed";
  else if (compositeScore >= config.bands.fullAgentMin) recommendation = "full_agent";
  else if (compositeScore >= config.bands.hybridMin) recommendation = "hybrid";
  else if (compositeScore >= config.bands.augmentedMin) recommendation = "augmented_human";
  else recommendation = "keep_human";

  const sorted = [...breakdown].sort((a, b) => b.rawScore - a.rawScore);
  return {
    taskId: input.taskId,
    taskName: input.taskName,
    compositeScore,
    recommendation,
    recommendationLabel: labels[recommendation],
    gateTriggered: severeGate,
    gateReason: severeGate
      ? "Compliance approval is required and the error risk is severe — automatic agent assignment is blocked and manual review is required."
      : null,
    breakdown,
    explanation: createExplanation(recommendation, compositeScore, sorted),
  };
}

function createExplanation(recommendation: TaskRecommendation, score: number, sorted: ScoreDimension[]) {
  const strongest = sorted
    .slice(0, 2)
    .map((item) => item.label)
    .join(" and ");
  const weakest = sorted
    .slice(-2)
    .map((item) => item.label)
    .join(" and ");
  const tails: Record<TaskRecommendation, string> = {
    full_agent: "This task is high-volume, structured, and low-risk, so it can be delegated directly to an agent.",
    hybrid: "An agent can perform this task, but human approval or review is recommended because of limiting factors.",
    augmented_human: "The task should remain human-owned, with an agent assisting in research and draft preparation.",
    keep_human:
      "The task should remain human-owned because it requires significant judgment, risk management, or empathy.",
    needs_review: "The task requires manual review because the compliance and risk gate was triggered.",
    custom_dev_needed:
      "The task is suitable for automation, but the marketplace match is low; custom development is recommended.",
  };

  return `Composite score: ${score}/100. Strongest supporting factors: ${strongest}. Most limiting factors: ${weakest}. ${tails[recommendation]}`;
}

export function evaluateTasksBulk(
  inputs: TaskEvaluationInput[],
  context: TaskEvaluationContext,
  config = DEFAULT_ENGINE_CONFIG,
) {
  return inputs.map((input) => evaluateTask(input, context, config));
}
