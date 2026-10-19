export interface N8nTemplateWorkflow {
  id: number;
  name: string;
  totalViews: number;
  nodes: { name: string }[];
}

export interface N8nMatchCandidate {
  templateId: number;
  templateName: string;
  matchScore: number;
  matchedSystems: string[];
  popularity: number;
  templateUrl: string;
}

export interface N8nMatchResult {
  score: number;
  candidates: N8nMatchCandidate[];
}

const N8N_API_BASE = "https://api.n8n.io";

async function searchN8nTemplates(query: string, rows = 10): Promise<N8nTemplateWorkflow[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const url = `${N8N_API_BASE}/templates/search?search=${encodeURIComponent(query)}&rows=${rows}`;
    const response = await fetch(url, {
      headers: { Accept: "application/json", "User-Agent": "Orgentic-Task-Transformation/1.0" },
      signal: controller.signal,
      next: { revalidate: 3600 },
    });
    if (!response.ok) throw new Error(`n8n template search failed: ${response.status}`);
    const data = (await response.json()) as { workflows?: N8nTemplateWorkflow[] };
    return data.workflows ?? [];
  } finally {
    clearTimeout(timeout);
  }
}

export async function getN8nMarketplaceMatchScore(
  taskTags: string[],
  linkedSystems: string[],
): Promise<N8nMatchResult> {
  if (!taskTags.length) return { score: 0, candidates: [] };

  try {
    const workflows = await searchN8nTemplates(taskTags.join(" "));
    const linkedSystemsLower = linkedSystems.map((system) => system.toLowerCase());
    const candidates = workflows.map((workflow) => {
      const nodeNames = workflow.nodes.map((node) => node.name.toLowerCase());
      const matchedSystems = linkedSystemsLower.filter((system) =>
        nodeNames.some((node) => node.includes(system) || system.includes(node)),
      );
      const systemOverlapRatio = linkedSystems.length ? matchedSystems.length / linkedSystems.length : 0.5;
      const popularityConfidence = Math.min(1, Math.log10(workflow.totalViews + 1) / Math.log10(5000));
      const matchScore = Math.round((systemOverlapRatio * 0.7 + popularityConfidence * 0.3) * 100);
      return {
        templateId: workflow.id,
        templateName: workflow.name,
        matchScore,
        matchedSystems,
        popularity: workflow.totalViews,
        templateUrl: `https://n8n.io/workflows/${workflow.id}`,
      };
    });
    candidates.sort((a, b) => b.matchScore - a.matchScore);
    return { score: candidates[0]?.matchScore ?? 0, candidates };
  } catch {
    return { score: 0, candidates: [] };
  }
}
