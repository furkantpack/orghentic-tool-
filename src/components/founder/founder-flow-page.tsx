"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function FounderFlowPage({ title, description, action = "Continue", kind = "form" }: { title: string; description: string; action?: string; kind?: "form" | "cards" | "voice" }) {
  const [submitted, setSubmitted] = useState(false);
  return <main className="mx-auto w-full max-w-5xl p-6 md:p-10"><div className="mb-8"><p className="text-sm font-medium text-muted-foreground">SCOUTER FOUNDER</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1><p className="mt-2 max-w-2xl text-muted-foreground">{description}</p></div>
    {kind === "voice" ? <Card><CardContent className="flex min-h-[360px] flex-col items-center justify-center gap-6 text-center"><div className="flex size-24 items-center justify-center rounded-full bg-primary/10 text-3xl">◉</div><p className="text-lg font-medium">Listening for your story…</p><p className="text-sm text-muted-foreground">Mock conversation mode · microphone ready</p><div className="flex gap-3"><Button variant="outline" onClick={() => setSubmitted(true)}>Mute</Button><Button onClick={() => setSubmitted(true)}>End conversation</Button></div>{submitted && <p className="text-sm text-emerald-600">Conversation saved. Your Founder Brief is being updated.</p>}</CardContent></Card> : kind === "cards" ? <div className="grid gap-4 md:grid-cols-2">{["Northzone · 94% fit","XYZ Ventures · 88% fit","Northstar Capital · 82% fit","Atlas Seed · 79% fit"].map((item) => <Card key={item}><CardHeader><CardTitle className="text-lg">{item}</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Stage and thesis align with your company. Scouter sees a relevant timing signal.</p><Button className="mt-4" variant="outline">View details</Button></CardContent></Card>)}</div> : <Card><CardHeader><CardTitle className="text-lg">{title}</CardTitle></CardHeader><CardContent className="space-y-4"><Input placeholder="First name" /><Input placeholder="Last name" /><Input placeholder="Work email" type="email" /><Input placeholder="Company or LinkedIn URL" /><Textarea placeholder="Tell Scouter what has changed (optional)" /><Button onClick={() => setSubmitted(true)}>{action}</Button>{submitted && <p className="text-sm text-emerald-600">Saved. You can continue when ready.</p>}</CardContent></Card>}
  </main>;
}
