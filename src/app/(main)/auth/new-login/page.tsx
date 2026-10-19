import Link from "next/link";

import { Eye, Globe, LockKeyhole, Mail, Network } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { GoogleButton } from "../_components/social-auth/google-button";

export default function NewLogin() {
  return (
    <main className="grid min-h-dvh justify-center bg-background p-2 lg:grid-cols-2">
      <section className="relative order-1 flex min-h-[calc(100dvh-1rem)] items-center justify-center">
        <div className="w-full max-w-md space-y-8 px-6">
          <div className="space-y-3 text-center">
            <div className="mx-auto flex size-11 items-center justify-center rounded-xl border bg-sky-50 text-sky-700 shadow-xs">
              <Network className="size-5" />
            </div>
            <div>
              <div className="font-semibold text-lg">Orgentic</div>
              <h1 className="mt-3 font-medium text-3xl tracking-tight">Welcome back</h1>
              <p className="mt-2 text-muted-foreground text-sm">
                Sign in to manage your org chart, agents, tasks, and scenarios.
              </p>
            </div>
          </div>

          <Card className="rounded-lg shadow-none">
            <CardContent className="space-y-4 p-5">
              <GoogleButton className="w-full" />
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:border-t">
                <span className="relative z-10 bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>

              <FieldGroup className="gap-4">
                <Field className="gap-1.5">
                  <FieldLabel htmlFor="login-email">Email</FieldLabel>
                  <div className="relative">
                    <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="login-email" className="h-11 ps-9" type="email" placeholder="you@company.com" />
                  </div>
                </Field>
                <Field className="gap-1.5">
                  <FieldLabel htmlFor="login-password">Password</FieldLabel>
                  <div className="relative">
                    <LockKeyhole className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="login-password" className="h-11 px-9" type="password" placeholder="Your password" />
                    <Eye className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </Field>
                <Field orientation="horizontal">
                  <Checkbox id="remember-workspace" />
                  <FieldContent className="flex-row items-center justify-between">
                    <FieldLabel htmlFor="remember-workspace" className="font-normal">
                      Remember me
                    </FieldLabel>
                    <Link href="/auth/v2/login" className="text-primary text-sm">
                      Forgot password?
                    </Link>
                  </FieldContent>
                </Field>
              </FieldGroup>

              <Button className="h-11 w-full bg-[linear-gradient(135deg,#38bdf8_0%,#2563eb_48%,#fb923c_100%)] text-white shadow-sm hover:opacity-95">
                Sign In
              </Button>
            </CardContent>
          </Card>

          <p className="text-center text-muted-foreground text-sm">
            New to Orgentic?{" "}
            <Link href="/auth/v2/register" className="font-medium text-foreground">
              Create workspace
            </Link>
          </p>
        </div>
      </section>

      <section className="relative order-2 hidden h-full min-h-[calc(100dvh-1rem)] overflow-hidden rounded-3xl border bg-[radial-gradient(circle_at_20%_15%,rgba(14,165,233,0.20),transparent_32%),radial-gradient(circle_at_82%_20%,rgba(139,92,246,0.20),transparent_30%),linear-gradient(135deg,#f8fbff_0%,#eef8ff_48%,#f7f3ff_100%)] lg:flex">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-[length:9px_9px] bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.12)_1px,transparent_1px)] opacity-30" />
        <div className="relative flex w-full flex-col justify-between p-10">
          <div className="flex items-start justify-between gap-3">
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
                Secure workspace login
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <Globe className="size-4" /> ENG
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-[1fr_auto_1fr]">
            <div className="space-y-1">
              <h2 className="font-medium">Built for transformation</h2>
              <p className="text-muted-foreground text-sm">
                Track people, agents, workflows, and cost impact from one operational workspace.
              </p>
            </div>
            <Separator orientation="vertical" className="hidden h-auto md:block" />
            <div className="space-y-1">
              <h2 className="font-medium">Need guidance?</h2>
              <p className="text-muted-foreground text-sm">
                Start from org, finance, task, user, and marketplace templates tuned for your team.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
