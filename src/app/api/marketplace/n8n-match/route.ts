import { NextResponse } from "next/server";

import { getN8nMarketplaceMatchScore } from "@/server/n8n-template-connector";

const requests = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 20;

export async function POST(request: Request) {
  const clientId = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const now = Date.now();
  const current = requests.get(clientId);
  if (current && current.resetAt > now && current.count >= MAX_REQUESTS) {
    return NextResponse.json({ score: 0, candidates: [], error: "Rate limit exceeded" }, { status: 429 });
  }
  requests.set(
    clientId,
    current && current.resetAt > now
      ? { ...current, count: current.count + 1 }
      : { count: 1, resetAt: now + WINDOW_MS },
  );

  try {
    const body = (await request.json()) as { tags?: unknown; linkedSystems?: unknown };
    if (!Array.isArray(body.tags) || !Array.isArray(body.linkedSystems)) {
      return NextResponse.json({ score: 0, candidates: [], error: "Invalid request" }, { status: 400 });
    }
    const tags = body.tags.filter((item): item is string => typeof item === "string").slice(0, 20);
    const linkedSystems = body.linkedSystems.filter((item): item is string => typeof item === "string").slice(0, 20);
    const result = await getN8nMarketplaceMatchScore(tags, linkedSystems);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ score: 0, candidates: [], error: "n8n lookup unavailable" });
  }
}
