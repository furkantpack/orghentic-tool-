"use client";

import { useState } from "react";

import Link from "next/link";

import {
  Building2,
  CalendarClock,
  Check,
  ChevronRight,
  FileUp,
  Network,
  Plus,
  Sparkles,
  UploadCloud,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const providers = ["BambooHR", "Workday", "Personio", "CSV Upload"];

export default function Page() {
  const [step, setStep] = useState(1);
  const [setupMode, setSetupMode] = useState<"import" | "manual">("import");
  const [provider, setProvider] = useState("BambooHR");
  const [connected, setConnected] = useState(false);
  const [departments, setDepartments] = useState([
    { id: "engineering", name: "Engineering", lead: "mert@roster.app" },
    { id: "operations", name: "Operations", lead: "deniz@roster.app" },
  ]);

  function addDepartment() {
    setDepartments((items) => [...items, { id: `department-${items.length + 1}`, name: "", lead: "" }]);
  }

  return (
    <main>
      <div className="grid min-h-dvh justify-center bg-background p-2 lg:grid-cols-2">
        <aside className="relative order-2 hidden h-full overflow-hidden rounded-3xl border bg-[radial-gradient(circle_at_20%_15%,rgba(14,165,233,0.20),transparent_32%),radial-gradient(circle_at_82%_20%,rgba(139,92,246,0.20),transparent_30%),linear-gradient(135deg,#f8fbff_0%,#eef8ff_48%,#f7f3ff_100%)] lg:flex">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-[length:9px_9px] bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.12)_1px,transparent_1px)] opacity-30" />
          <div className="relative flex w-full flex-col justify-between p-10">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl border bg-background/80 text-sky-700 shadow-xs backdrop-blur">
                  <Network className="size-5" />
                </div>
                <div>
                  <h1 className="font-semibold text-2xl tracking-tight">Orgentic</h1>
                  <p className="text-muted-foreground text-sm">Organization intelligence for humans and agents.</p>
                </div>
              </div>
              <Badge className="bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
                Workspace ready in minutes
              </Badge>
            </div>

            <div className="grid gap-5 md:grid-cols-[1fr_auto_1fr]">
              <div className="space-y-1">
                <h2 className="font-medium">Set up your company</h2>
                <p className="text-muted-foreground text-sm">
                  Add your workspace details and bring your organization structure together in one place.
                </p>
              </div>
              <Separator orientation="vertical" className="hidden h-auto md:block" />
              <div className="space-y-1">
                <h2 className="font-medium">Import or build</h2>
                <p className="text-muted-foreground text-sm">
                  Connect your HR system or create departments manually, then choose the plan that fits.
                </p>
              </div>
            </div>
          </div>
        </aside>

        <section className="relative order-1 flex min-h-[calc(100dvh-1rem)] overflow-hidden">
          <StepMarker step={step} />
          <div className="mx-auto flex w-full max-w-5xl items-center justify-center px-5 py-24 sm:px-8 lg:px-10">
            {step === 1 ? (
              <div className="grid w-full max-w-xl gap-10">
                <div className="space-y-3 text-center">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-sky-200 bg-sky-50 text-sky-700 shadow-xs dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-300">
                    <Network className="size-6" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl tracking-tight">Create your workspace</CardTitle>
                    <CardDescription className="mt-2 text-base">
                      Add the core company details before continuing.
                    </CardDescription>
                  </div>
                </div>

                <div className="grid gap-7">
                  <Field label="Company name" required>
                    <div className="relative">
                      <Building2 className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        className="h-13 rounded-xl border-border/70 bg-muted/30 pr-4 pl-11 text-base shadow-none transition-colors hover:bg-muted/45 focus-visible:bg-background"
                        placeholder="Acme Holding"
                      />
                    </div>
                  </Field>

                  <Field label="Industry" required>
                    <Select defaultValue="Technology">
                      <SelectTrigger className="h-13 w-full rounded-xl border-border/70 bg-muted/30 px-4 text-base shadow-none transition-colors hover:bg-muted/45 focus:bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {["Technology", "E-commerce", "Finance", "Healthcare", "Manufacturing", "Other"].map(
                            (item) => (
                              <SelectItem key={item} value={item}>
                                {item}
                              </SelectItem>
                            ),
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field label="Employee count" required>
                    <Tabs defaultValue="11-50">
                      <TabsList className="grid h-13 w-full grid-cols-4 rounded-xl border border-border/70 bg-muted/30 p-1 shadow-none">
                        <TabsTrigger
                          className="h-10 rounded-lg text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm"
                          value="1-10"
                        >
                          1-10
                        </TabsTrigger>
                        <TabsTrigger
                          className="h-10 rounded-lg text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm"
                          value="11-50"
                        >
                          11-50
                        </TabsTrigger>
                        <TabsTrigger
                          className="h-10 rounded-lg text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm"
                          value="51-200"
                        >
                          51-200
                        </TabsTrigger>
                        <TabsTrigger
                          className="h-10 rounded-lg text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm"
                          value="200+"
                        >
                          200+
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </Field>
                </div>

                <div className="flex justify-end border-border/60 border-t pt-6">
                  <Button
                    className="h-12 min-w-40 rounded-xl bg-sky-600 px-7 text-base shadow-sm hover:bg-sky-700"
                    onClick={() => setStep(2)}
                  >
                    Continue <ChevronRight />
                  </Button>
                </div>
              </div>
            ) : step === 2 ? (
              <div className="grid w-full max-w-5xl gap-7">
                <div className="space-y-3 text-center">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-violet-200 bg-violet-50 text-violet-700 shadow-xs dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300">
                    <Building2 className="size-6" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl tracking-tight">Build your org chart</CardTitle>
                    <CardDescription className="mt-2 text-base">
                      Import from an HRIS or create departments manually.
                    </CardDescription>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <button
                    type="button"
                    className={`rounded-2xl border p-6 text-left shadow-sm transition hover:border-sky-400 ${
                      setupMode === "import" ? "border-sky-400 bg-sky-50/90 dark:bg-sky-500/10" : "bg-background"
                    }`}
                    onClick={() => setSetupMode("import")}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex size-12 items-center justify-center rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300">
                        <UploadCloud className="size-6" />
                      </div>
                      <div>
                        <div className="font-semibold text-base">Import from HRIS</div>
                        <p className="mt-2 text-muted-foreground text-sm leading-6">
                          Connect BambooHR, Workday, Personio, or upload a CSV file.
                        </p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`rounded-2xl border p-6 text-left shadow-sm transition hover:border-violet-400 ${
                      setupMode === "manual"
                        ? "border-violet-400 bg-violet-50/90 dark:bg-violet-500/10"
                        : "bg-background"
                    }`}
                    onClick={() => setSetupMode("manual")}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex size-12 items-center justify-center rounded-lg bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
                        <Building2 className="size-6" />
                      </div>
                      <div>
                        <div className="font-semibold text-base">Create from scratch</div>
                        <p className="mt-2 text-muted-foreground text-sm leading-6">
                          Add departments line by line and assign a lead name or email.
                        </p>
                      </div>
                    </div>
                  </button>
                </div>

                {setupMode === "import" ? (
                  <div className="grid gap-5 rounded-2xl border bg-background p-7 shadow-sm">
                    <div>
                      <CardTitle className="text-lg">Select provider</CardTitle>
                      <CardDescription className="mt-1">
                        After OAuth succeeds, review the detected org data before confirming.
                      </CardDescription>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-4">
                      {providers.map((item) => (
                        <Button
                          key={item}
                          className={provider === item ? "h-12 bg-sky-600 hover:bg-sky-700" : "h-12 bg-background"}
                          variant={provider === item ? "default" : "outline"}
                          onClick={() => setProvider(item)}
                        >
                          {item === "CSV Upload" ? <FileUp /> : <Users />}
                          {item}
                        </Button>
                      ))}
                    </div>
                    <div className="rounded-xl border bg-teal-50/60 p-5 dark:bg-teal-500/10">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="font-medium">{provider} connection</div>
                          <p className="text-muted-foreground text-sm">
                            Start OAuth, then confirm the preview before writing data.
                          </p>
                        </div>
                        <Button
                          className="h-11 rounded-full bg-teal-600 px-7 hover:bg-teal-700"
                          onClick={() => setConnected(true)}
                        >
                          {connected ? "Reconnect" : "Connect"}
                        </Button>
                      </div>
                    </div>
                    {connected ? (
                      <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-5 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                        <div className="flex items-center gap-2 font-medium">
                          <Check className="size-4 text-emerald-500" />
                          Connection successful
                        </div>
                        <p className="mt-1 text-muted-foreground text-sm">42 people and 6 departments found.</p>
                        <Button className="mt-4 h-11 rounded-full px-7">Confirm import</Button>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="grid gap-5 rounded-2xl border bg-background p-7 shadow-sm">
                    <div>
                      <CardTitle className="text-lg">Add departments</CardTitle>
                      <CardDescription className="mt-1">
                        Assign a lead name or email to each department.
                      </CardDescription>
                    </div>
                    <div className="space-y-3">
                      {departments.map((department, index) => (
                        <div
                          key={department.id}
                          className="grid gap-3 rounded-xl border bg-violet-50/40 p-4 md:grid-cols-2 dark:bg-violet-500/10"
                        >
                          <Input
                            className="h-12 text-base"
                            value={department.name}
                            placeholder="Department name"
                            onChange={(event) =>
                              setDepartments((items) =>
                                items.map((item, itemIndex) =>
                                  itemIndex === index ? { ...item, name: event.target.value } : item,
                                ),
                              )
                            }
                          />
                          <Input
                            className="h-12 text-base"
                            value={department.lead}
                            placeholder="Lead name or email"
                            onChange={(event) =>
                              setDepartments((items) =>
                                items.map((item, itemIndex) =>
                                  itemIndex === index ? { ...item, lead: event.target.value } : item,
                                ),
                              )
                            }
                          />
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="h-11 w-fit rounded-full px-6" onClick={addDepartment}>
                      <Plus /> Add department
                    </Button>
                  </div>
                )}

                <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                  <Button variant="ghost" className="h-11 rounded-full px-7" onClick={() => setStep(3)}>
                    Skip for now
                  </Button>
                  <Button
                    className="h-11 rounded-full bg-violet-600 px-7 hover:bg-violet-700"
                    onClick={() => setStep(3)}
                  >
                    Complete setup
                  </Button>
                </div>
              </div>
            ) : (
              <Paywall />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function StepMarker({ step }: { step: number }) {
  const labels = ["Company details", "Build org chart", "Choose plan"];

  return (
    <div className="absolute top-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3 rounded-full border bg-background/90 px-3 py-2 text-xs shadow-xs backdrop-blur sm:left-8 sm:translate-x-0 md:top-8">
      <div className="flex items-center gap-1.5">
        {[1, 2, 3].map((item) => (
          <span
            key={item}
            className={`flex size-5 items-center justify-center rounded-full border text-[10px] ${
              step === item
                ? "border-foreground bg-foreground text-background"
                : step > item
                  ? "border-emerald-500 text-emerald-600"
                  : "text-muted-foreground"
            }`}
          >
            {step > item ? <Check className="size-3" /> : item}
          </span>
        ))}
      </div>
      <span className="hidden font-medium text-muted-foreground sm:block">
        Step {step} of 3 - {labels[step - 1]}
      </span>
    </div>
  );
}

function Paywall() {
  return (
    <div className="mx-auto flex min-h-[620px] max-w-4xl flex-col items-center justify-center gap-8 py-6">
      <div className="space-y-3 text-center">
        <div className="mx-auto flex size-10 items-center justify-center rounded-full border bg-background shadow-xs">
          <Sparkles className="size-5" />
        </div>
        <div>
          <CardTitle className="text-xl">Start free, no demo required</CardTitle>
          <CardDescription className="mt-1">
            You are set to start on your own. Book a demo if you would prefer a walkthrough.
          </CardDescription>
        </div>
      </div>

      <div className="grid w-full max-w-2xl gap-5 md:grid-cols-2">
        <PlanCard
          artwork="starter"
          badge="Free"
          buttonLabel="Create Account"
          buttonVariant="dark"
          description="Hands-on with a free workspace. Upgrade when your team outgrows it."
          features={[
            "Free for up to 10 seats",
            "Build one org chart workspace",
            "Connect 1 external tool",
            "Live in under 10 minutes",
          ]}
          href="/dashboard/dashboard-new"
          title="Starter"
        />
        <PlanCard
          artwork="pro"
          badge="$650/month"
          buttonLabel="Book a Demo"
          buttonVariant="blue"
          description="Get a 30-min walkthrough with our team if you would rather see it first."
          features={[
            "Live screen-share session",
            "Tailored to your use case",
            "Automation mapping review",
            "You can still sign up after",
          ]}
          href="/dashboard/dashboard-new"
          title="Pro"
        />
      </div>
    </div>
  );
}

function PlanCard({
  artwork,
  badge,
  buttonLabel,
  buttonVariant,
  description,
  features,
  href,
  title,
}: {
  artwork: "starter" | "pro";
  badge: string;
  buttonLabel: string;
  buttonVariant: "dark" | "blue";
  description: string;
  features: string[];
  href: string;
  title: string;
}) {
  return (
    <Card className="overflow-hidden rounded-2xl pt-0 shadow-sm">
      <div
        className={
          artwork === "starter"
            ? "h-20 bg-[linear-gradient(135deg,#7c83ff_0%,#d9b4ff_30%,#f8fbff_58%,#5cc8ff_100%)]"
            : "h-20 bg-[radial-gradient(circle_at_60%_40%,#ff9f1c_0%,#ffcf5f_20%,#ff8bc3_38%,#70c7ff_65%,#7aa7ff_100%)]"
        }
      />
      <CardContent className="flex min-h-[340px] flex-col gap-6 p-5">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <CardTitle>{title}</CardTitle>
            <Badge
              variant="secondary"
              className={artwork === "pro" ? "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300" : ""}
            >
              {badge}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm leading-6">{description}</p>
        </div>

        <div className="space-y-3">
          <div className="font-medium text-xs">What you get:</div>
          <div className="grid gap-2">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-muted-foreground text-sm">
                <Check className="size-4 text-emerald-500" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto">
          <Button
            asChild
            className={
              buttonVariant === "dark"
                ? "h-10 w-full rounded-full bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
                : "h-10 w-full rounded-full bg-sky-500 text-white hover:bg-sky-600"
            }
          >
            <Link href={href}>
              {buttonVariant === "blue" ? <CalendarClock /> : null}
              {buttonLabel}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="grid gap-2.5">
      <div className="font-medium text-foreground/85 text-sm">
        {label}
        {required ? <span className="ml-0.5 text-sky-600">*</span> : null}
      </div>
      {children}
    </div>
  );
}
