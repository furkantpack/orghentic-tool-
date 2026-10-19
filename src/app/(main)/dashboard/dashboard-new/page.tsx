"use client";

import { useState, type ReactNode } from "react";

import {
  ArrowLeft,
  ArrowUp,
  Bot,
  ChevronDown,
  CheckCircle2,
  Clock3,
  EllipsisVertical,
  FileText,
  Folder,
  Info,
  Lock,
  MessageSquareText,
  MoreHorizontal,
  Plus,
  Search,
  Sparkles,
  Star,
  Target,
  Trash2,
  WandSparkles,
  X,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogClose, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Textarea } from "@/components/ui/textarea";

const recentFiles = [
  { icon: "OC", title: "Acme Org Chart - Automation Seats", type: "Org map" },
  { icon: "TS", title: "Task Distribution - July Planning", type: "Tasks" },
  { icon: "FN", title: "Finance Agent ROI Forecast.pdf", type: "Report" },
];

const tasks = [
  { title: "Design the new RevOps seat map", time: "12 pm", status: "Join now", color: "bg-orange-500", tone: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300" },
  { title: "Refine AI components based on user feedback", time: "Urgent", status: "By today", color: "bg-rose-500", tone: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300" },
  { title: "Prepare automation prototype for support intake", time: "In progress", status: "By tomorrow", color: "bg-blue-500", tone: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300" },
  { title: "Collaborate with managers on implementation detail", time: "To do", status: "By tomorrow", color: "bg-emerald-500", tone: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" },
];

const quickStats = [
  { label: "42 seats mapped", tone: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300" },
  { label: "68% automated", tone: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300" },
  { label: "7 risks open", tone: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300" },
];

const projectPrompts = [
  {
    title: "Org Chart Gap Review",
    prompt: "Find missing seats, duplicate ownership, and unclear reporting lines in the current org chart.",
    time: "1:00 PM",
  },
  {
    title: "Task Automation Plan",
    prompt: "Suggest which tasks should be Full Automation, Human Review, or Human Must Do.",
    time: "3:15 PM",
  },
  {
    title: "Department Health Summary",
    prompt: "Summarize department load, budget pressure, open roles, and automation readiness.",
    time: "4:00 PM",
  },
  {
    title: "Connected Tool Routing",
    prompt: "Draft webhook routing rules for n8n, Gumloop, and finance partner agents.",
    time: "5:30 PM",
  },
  {
    title: "Executive Scenario Brief",
    prompt: "Prepare a concise scenario brief comparing current team design with an agent-assisted structure.",
    time: "6:45 PM",
  },
];

const projectFiles = [
  {
    label: "X",
    name: "usage.xlsx",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300",
  },
  {
    label: "W",
    name: "policy.docx",
    className: "border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300",
  },
  {
    label: "P",
    name: "forecast.pdf",
    className: "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300",
  },
];

const generationSteps = [
  {
    label: "usage.xlsx",
    title: "Operations lead added",
    detail: "According to the usage document, support intake needs one clear owner before automation routing.",
    tone: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300",
  },
  {
    label: "policy.docx",
    title: "Human review task created",
    detail: "The policy document requires approval checkpoints for finance and compliance requests.",
    tone: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300",
  },
  {
    label: "forecast.pdf",
    title: "Automation agent connected",
    detail: "The forecast shows enough repeated workload to justify an agent-assisted reporting node.",
    tone: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300",
  },
  {
    label: "task brief",
    title: "RevOps handoff linked",
    detail: "The task list adds a cross-functional handoff between Sales Ops, Finance, and Support.",
    tone: "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300",
  },
];

const generatedNodes = [
  { id: "CEO", label: "Furkan", role: "Workspace Owner", x: 50, y: 6, color: "bg-sky-500", delay: "0ms" },
  { id: "OPS", label: "Ops Lead", role: "Usage owner", x: 20, y: 40, color: "bg-emerald-500", delay: "120ms" },
  { id: "FIN", label: "Finance", role: "Human review", x: 50, y: 40, color: "bg-blue-500", delay: "240ms" },
  { id: "AI", label: "Agent", role: "Reporting automation", x: 80, y: 40, color: "bg-rose-500", delay: "360ms" },
  { id: "REV", label: "RevOps", role: "Handoff task", x: 50, y: 74, color: "bg-violet-500", delay: "480ms" },
];

export default function Page() {
  return (
    <div data-content-padding="false" className="min-h-[calc(100dvh-3rem)] bg-[#f4f4f3] p-2 dark:bg-muted/40">
      <div className="relative min-h-[calc(100dvh-4rem)] overflow-hidden rounded-2xl bg-background ring-1 ring-foreground/10">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.07)_1px,transparent_1px)] bg-[length:7px_7px] opacity-20" />
        <div className="relative mx-auto grid max-w-[900px] gap-3 px-4 pb-5 pt-10 md:pt-14">
          <ProjectPromptArea />
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="grid gap-3 pb-3 pt-2 md:pt-6">
      <div>
        <h1 className="text-[2.45rem] font-medium leading-none tracking-tight md:text-[3.25rem]">
          <span className="rounded-xl bg-sky-100 px-2 text-sky-800 dark:bg-sky-500/20 dark:text-sky-200">Welcome, Furkan!</span>
        </h1>
        <p className="mt-1 text-[2rem] leading-none text-muted-foreground tracking-tight md:text-[2.85rem]">
          How can Orgentic help today?
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {quickStats.map((stat) => (
          <Badge key={stat.label} className={`rounded-full px-3 py-1 ${stat.tone}`} variant="secondary">
            {stat.label}
          </Badge>
        ))}
      </div>
    </div>
  );
}

function RecentFiles() {
  return (
    <section className="-rotate-2 rounded-xl border border-yellow-200/80 bg-[#fff8cf] p-4 shadow-[0_10px_28px_rgba(0,0,0,0.06)] transition hover:rotate-0 dark:border-yellow-500/20 dark:bg-yellow-500/10">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[13px] font-medium text-amber-900 dark:text-yellow-100">
          <FileText className="size-4" />
          Previously viewed files
        </div>
        <Button size="icon-sm" variant="ghost" aria-label="More files">
          <MoreHorizontal />
        </Button>
      </div>
      <div className="grid gap-2">
        {recentFiles.map((file) => (
          <div key={file.title} className="flex items-center gap-2 rounded-lg bg-white/60 px-2 py-1.5 text-[13px] shadow-xs dark:bg-background/50">
            <span className="flex size-6 items-center justify-center rounded-md bg-foreground text-background text-[10px] font-medium">{file.icon}</span>
            <div className="min-w-0">
              <div className="truncate font-medium">{file.title}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function MeetingSummary() {
  return (
    <section className="rounded-xl border bg-background p-4 shadow-[0_10px_28px_rgba(0,0,0,0.04)]">
      <div className="mb-4 flex items-center gap-2 text-muted-foreground text-[13px]">
        <WandSparkles className="size-4" />
        Summarize your last meeting
      </div>
      <div className="flex items-center gap-3">
        <Avatar className="size-12 rounded-lg">
          <AvatarImage src="https://github.com/shadcn.png" alt="Meeting owner" />
          <AvatarFallback>FD</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div className="flex items-center gap-2 font-medium">
            <span className="flex size-6 items-center justify-center rounded-md bg-gradient-to-br from-sky-400 to-emerald-400 text-white text-[10px]">
              AI
            </span>
            Org Strategy Sync
          </div>
          <div className="mt-1 text-muted-foreground text-sm">9 Jul 2026, 14:00 pm</div>
        </div>
      </div>
    </section>
  );
}

function SuggestedTask({ icon, label, title, detail }: { icon: ReactNode; label: string; title: string; detail: string }) {
  return (
    <section className="rounded-xl border bg-background p-4 shadow-[0_10px_28px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-2 text-muted-foreground text-[13px]">
        {icon}
        {label}
      </div>
      <div className="mt-3 font-medium">{title}</div>
      <div className="mt-1 text-muted-foreground text-[13px]">{detail}</div>
    </section>
  );
}

function TaskPanel() {
  return (
    <section className="rounded-xl border bg-background p-4 shadow-[0_10px_28px_rgba(0,0,0,0.04)]">
      <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          <CheckCircle2 className="size-4" />
          My Tasks <Badge variant="secondary">13</Badge>
        </div>
        <div className="flex gap-2">
          <InputGroup className="h-8 md:w-56">
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupInput placeholder="Search for name..." />
          </InputGroup>
          <Button size="sm" variant="outline" className="h-8 rounded-full border-violet-300 text-violet-700 dark:text-violet-300">
            <Sparkles /> Prioritize Tasks
          </Button>
        </div>
      </div>

      <div className="grid gap-1.5">
        {tasks.map((task) => (
          <div key={task.title} className="flex flex-wrap items-center gap-2 rounded-lg px-1.5 py-1 text-[13px]">
            <span className={`size-2 rounded-full ${task.color}`} />
            <span className="min-w-0 flex-1 font-medium">{task.title}</span>
            <Badge className={task.tone} variant="secondary">
              <Clock3 className="size-3" /> {task.time}
            </Badge>
            <Badge variant="outline">{task.status}</Badge>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProjectPromptArea() {
  const defaultPrompt =
    "Draft a practical org-design plan that identifies overloaded seats, tasks ready for automation, and the next three actions for this workspace.";
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [hasGenerated, setHasGenerated] = useState(false);

  function handleSubmit() {
    if (!prompt.trim()) return;
    setHasGenerated(true);
  }

  return (
    <section className="grid gap-5">
      <div className="grid gap-2 pt-2 md:pt-6">
        <h1 className="text-[2.45rem] font-medium leading-none tracking-tight md:text-[3.25rem]">
          <span className="rounded-xl bg-sky-100 px-2 text-sky-800 dark:bg-sky-500/20 dark:text-sky-200">
            Welcome, Furkan!
          </span>
        </h1>
        <p className="text-[2rem] leading-none text-muted-foreground tracking-tight md:text-[2.85rem]">
          How can Orgentic help today?
        </p>
      </div>

      <div className="grid gap-5">
        <div className="overflow-hidden rounded-3xl border bg-background shadow-[0_18px_50px_rgba(25,31,53,0.09)]">
          <div className="flex items-center gap-2 bg-gradient-to-r from-sky-50 via-violet-50 to-emerald-50 px-5 py-3 text-muted-foreground text-sm dark:from-sky-500/10 dark:via-violet-500/10 dark:to-emerald-500/10">
            <span className="flex size-6 items-center justify-center rounded-full bg-white text-sky-500 shadow-xs dark:bg-background/80">
              <Sparkles className="size-3.5" />
            </span>
            Access premium planning models & features
            <Button variant="link" className="h-auto px-1 py-0 text-foreground">
              Upgrade
            </Button>
          </div>

          <div className="grid min-h-44 gap-7 rounded-t-3xl border-t bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(241,248,255,0.68))] p-5 dark:bg-background">
            <Textarea
              className="min-h-24 resize-none border-0 bg-transparent p-0 text-xl shadow-none outline-none placeholder:text-muted-foreground focus-visible:ring-0"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="How can I help you today?"
            />
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Button size="icon-sm" variant="secondary" className="rounded-xl bg-muted/70" aria-label="Add context">
                  <Plus />
                </Button>
                <Button variant="secondary" className="h-9 rounded-xl bg-muted/70 px-3">
                  GPT-4 <ChevronDown className="size-4" />
                </Button>
              </div>
              <Button
                size="icon-sm"
                variant="secondary"
                className="rounded-xl bg-muted/70"
                aria-label="Send prompt"
                onClick={handleSubmit}
              >
                <ArrowUp />
              </Button>
            </div>
          </div>

          <div className="grid border-t bg-background/95 md:grid-cols-[0.8fr_1.2fr]">
            <div className="flex items-center justify-between gap-3 px-5 py-4">
              <div className="min-w-20">
                <div className="font-medium leading-snug">Project files</div>
                <div className="text-muted-foreground text-sm">3 files</div>
              </div>
              <div className="flex items-center gap-2">
                {projectFiles.map((file) => (
                  <span
                    key={file.name}
                    className={`flex size-9 items-center justify-center rounded-xl border text-xs font-semibold shadow-xs ${file.className}`}
                    title={file.name}
                  >
                    {file.label}
                  </span>
                ))}
                <ProjectFilesDialog />
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 border-t px-5 py-4 md:border-l md:border-t-0">
              <div className="min-w-0">
                <div className="font-medium">Instructions</div>
                <div className="truncate text-muted-foreground text-sm">Friendly, professional, concise org-design strategy voice.</div>
              </div>
              <InstructionsDialog />
            </div>
          </div>
        </div>

        {hasGenerated ? <GeneratedOrgChat prompt={prompt} /> : null}

        <div className="grid gap-3 pt-2">
          <div className="text-muted-foreground text-sm font-medium">Chats in this project</div>
          <div className="grid gap-3">
            {projectPrompts.map((item) => (
              <button
                key={item.title}
                type="button"
                className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-2xl border bg-background px-5 py-3 text-left shadow-[0_8px_24px_rgba(0,0,0,0.025)] transition hover:border-foreground/15 hover:bg-muted/20"
              >
                <span className="flex size-6 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <MessageSquareText className="size-3.5" />
                </span>
                <div className="min-w-0 truncate">
                  <span className="font-medium">{item.title}</span>
                  <span className="mx-3 text-muted-foreground">-</span>
                  <span className="text-muted-foreground">{item.prompt}</span>
                </div>
                <span className="border-l pl-4 text-muted-foreground text-sm whitespace-nowrap">{item.time}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function GeneratedOrgChat({ prompt }: { prompt: string }) {
  return (
    <section className="grid gap-5 rounded-3xl border bg-background p-5 shadow-[0_18px_50px_rgba(25,31,53,0.08)] animate-in fade-in-0 slide-in-from-bottom-3 duration-500">
      <div className="flex justify-end">
        <div className="max-w-[78%] rounded-3xl bg-muted px-5 py-3 text-[15px] leading-relaxed">
          {prompt}
        </div>
      </div>

      <div className="grid gap-4">
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-2xl bg-foreground text-background">
            <Sparkles className="size-4" />
          </span>
          <div className="grid gap-1">
            <div className="font-medium">Orgentic is building the org chart</div>
            <div className="text-muted-foreground text-sm">
              I matched uploaded files, task signals, and workspace instructions, then added the first structure below.
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative h-[360px] overflow-hidden rounded-3xl border bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.13)_1px,transparent_1px)] bg-[length:24px_24px] p-4">
            <svg className="absolute inset-0 size-full" aria-hidden="true">
              <line x1="50%" y1="18%" x2="20%" y2="44%" className="stroke-muted-foreground/30" strokeWidth="2" />
              <line x1="50%" y1="18%" x2="50%" y2="44%" className="stroke-muted-foreground/30" strokeWidth="2" />
              <line x1="50%" y1="18%" x2="80%" y2="44%" className="stroke-muted-foreground/30" strokeWidth="2" />
              <line x1="50%" y1="54%" x2="50%" y2="76%" className="stroke-muted-foreground/30" strokeWidth="2" />
            </svg>
            {generatedNodes.map((node) => (
              <div
                key={node.id}
                className="absolute w-36 -translate-x-1/2 rounded-2xl border bg-background p-3 shadow-sm animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 duration-500"
                style={{ left: `${node.x}%`, top: `${node.y}%`, animationDelay: node.delay }}
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className={`size-2.5 rounded-full ${node.color}`} />
                  <span className="font-semibold text-sm">{node.label}</span>
                </div>
                <div className="text-muted-foreground text-xs">{node.role}</div>
              </div>
            ))}
          </div>

          <div className="grid content-start gap-3">
            {generationSteps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-2xl border bg-background p-3 shadow-xs animate-in fade-in-0 slide-in-from-right-3 duration-500"
                style={{ animationDelay: `${index * 140 + 120}ms` }}
              >
                <Badge className={`mb-2 rounded-lg ${step.tone}`} variant="secondary">
                  {step.label}
                </Badge>
                <div className="font-medium text-sm">{step.title}</div>
                <div className="mt-1 text-muted-foreground text-xs leading-relaxed">{step.detail}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-muted/40 px-4 py-3 text-sm">
          Next, I can convert this generated structure into editable nodes, assign owners, and push the task handoffs
          into the org chart workspace.
        </div>
      </div>
    </section>
  );
}

function ProjectFilesDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon-sm" variant="outline" className="rounded-xl border-dashed bg-background" aria-label="Add project file">
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-3xl p-0 sm:max-w-3xl">
        <DialogHeader className="px-7 pt-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-xl">Upload project files</DialogTitle>
              <DialogDescription className="mt-2 text-base">
                Attach relevant files to help Orgentic give better org-design answers.
              </DialogDescription>
            </div>
            <DialogClose asChild>
              <Button size="icon-sm" variant="ghost" className="rounded-full" aria-label="Close upload files">
                <X />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        <div className="px-7 py-5">
          <div className="overflow-hidden rounded-3xl border bg-muted/40">
            <div className="flex items-center gap-2 px-4 py-3 text-muted-foreground text-sm">
              <Info className="size-4" />
              Responses may be lower quality if too many files are attached.
            </div>
            <div className="rounded-3xl border bg-background p-3">
              {projectFiles.map((file, index) => (
                <div
                  key={file.name}
                  className={`flex items-center justify-between gap-3 rounded-2xl p-3 ${index === 1 ? "bg-muted/60" : ""}`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`flex size-11 items-center justify-center rounded-2xl border text-sm font-semibold ${file.className}`}>
                      {file.label}
                    </span>
                    <div>
                      <div className="font-medium">{file.name.split(".")[0]}</div>
                      <div className="text-muted-foreground text-xs uppercase">{file.name.split(".").at(-1)}</div>
                    </div>
                  </div>
                  {index === 1 ? (
                    <Button size="icon-sm" variant="ghost" className="rounded-xl" aria-label={`Remove ${file.name}`}>
                      <Trash2 />
                    </Button>
                  ) : null}
                </div>
              ))}
              <div className="mt-3 rounded-2xl border border-dashed p-3">
                <Input placeholder="Paste a file URL or type a file name to attach..." />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="px-7 pb-7">
          <DialogClose asChild>
            <Button variant="outline" className="rounded-xl px-5">
              Cancel
            </Button>
          </DialogClose>
          <Button className="rounded-xl bg-emerald-500 px-5 text-white hover:bg-emerald-600">Save project files</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function InstructionsDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon-sm" variant="outline" className="rounded-xl bg-background" aria-label="Edit instructions">
          <FileText />
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-3xl p-0 sm:max-w-3xl">
        <DialogHeader className="px-7 pt-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-xl">Set project instructions</DialogTitle>
              <DialogDescription className="mt-2 text-base">
                Set clear behavioral guidelines that help your Orgentic agent respond more effectively.
              </DialogDescription>
            </div>
            <DialogClose asChild>
              <Button size="icon-sm" variant="ghost" className="rounded-full" aria-label="Close instructions">
                <X />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        <div className="px-7 py-5">
          <div className="overflow-hidden rounded-3xl border bg-muted/40">
            <div className="flex items-center gap-2 px-4 py-3 text-muted-foreground text-sm">
              <Info className="size-4" />
              These instructions shape tone, scope, and workspace context.
            </div>
            <Textarea
              className="min-h-80 resize-none rounded-3xl border bg-background p-5 text-base shadow-none focus-visible:ring-0"
              defaultValue="Respond in a friendly, professional, and concise tone. Prioritize org chart clarity, task ownership, automation readiness, and practical next actions. When useful, include examples tied to seats, departments, tools, and budget impact."
            />
          </div>
        </div>

        <DialogFooter className="px-7 pb-7">
          <DialogClose asChild>
            <Button variant="outline" className="rounded-xl px-5">
              Cancel
            </Button>
          </DialogClose>
          <Button className="rounded-xl bg-emerald-500 px-5 text-white hover:bg-emerald-600">Save instructions</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
