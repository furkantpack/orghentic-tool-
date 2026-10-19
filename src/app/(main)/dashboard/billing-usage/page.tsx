import { ArrowUpRight, Check, CreditCard, Download, Gauge, Sparkles, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const usage = [
  { label: "Seats", value: 8, total: 10, detail: "2 seats remaining" },
  { label: "Org chart nodes", value: 148, total: 200, detail: "52 nodes remaining" },
  { label: "Connected tools", value: 3, total: 5, detail: "2 tool slots remaining" },
  { label: "Automation runs", value: 1840, total: 2500, detail: "660 runs remaining" },
];

const invoices = [
  { date: "Jul 1, 2026", description: "Starter workspace", amount: "$0.00", status: "Paid" },
  { date: "Jun 1, 2026", description: "Starter workspace", amount: "$0.00", status: "Paid" },
  { date: "May 1, 2026", description: "Starter workspace", amount: "$0.00", status: "Paid" },
];

const planFeatures = ["Up to 10 seats", "1 active workspace", "5 connected tools", "2,500 automation runs / month"];

export default function Page() {
  return (
    <div className="relative min-h-[calc(100dvh-6rem)] overflow-hidden rounded-2xl bg-background ring-1 ring-foreground/10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.08)_1px,transparent_1px)] bg-[length:8px_8px] opacity-20" />
      <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-8 md:px-8 md:py-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="flex size-10 items-center justify-center rounded-full border bg-background shadow-xs">
              <CreditCard className="size-5" />
            </div>
            <div>
              <h1 className="text-3xl tracking-tight">Billing & Usage</h1>
              <p className="mt-1 max-w-2xl text-muted-foreground text-sm">
                Track your workspace plan, usage limits, invoices, and upgrade options from one place.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="rounded-full px-5">
              <Download /> Export invoices
            </Button>
            <Button className="rounded-full px-5">
              Upgrade plan <ArrowUpRight />
            </Button>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
          <Card className="overflow-hidden rounded-2xl pt-0 shadow-sm">
            <div className="h-24 bg-[linear-gradient(135deg,#7c83ff_0%,#d9b4ff_30%,#f8fbff_58%,#5cc8ff_100%)]" />
            <CardContent className="grid gap-6 p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl">Starter</CardTitle>
                    <Badge variant="secondary">Current plan</Badge>
                  </div>
                  <CardDescription className="mt-2">
                    Free workspace for validating your first org chart, task routing, and automation map.
                  </CardDescription>
                </div>
                <div className="text-left md:text-right">
                  <div className="text-3xl tracking-tight">$0</div>
                  <div className="text-muted-foreground text-sm">per month</div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {planFeatures.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 rounded-xl border p-3 text-sm">
                    <Check className="size-4 text-emerald-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-2xl pt-0 shadow-sm">
            <div className="h-24 bg-[radial-gradient(circle_at_60%_40%,#ff9f1c_0%,#ffcf5f_20%,#ff8bc3_38%,#70c7ff_65%,#7aa7ff_100%)]" />
            <CardContent className="flex min-h-[265px] flex-col gap-5 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-xl">Pro</CardTitle>
                  <CardDescription className="mt-2">For teams ready to scale seats, agents, and automation volume.</CardDescription>
                </div>
                <Badge className="bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300" variant="secondary">
                  $650/month
                </Badge>
              </div>
              <div className="grid gap-2 text-muted-foreground text-sm">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4" /> Unlimited org chart scenarios
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="size-4" /> Higher automation run limits
                </div>
                <div className="flex items-center gap-2">
                  <Gauge className="size-4" /> Dedicated usage reviews
                </div>
              </div>
              <Button className="mt-auto rounded-full bg-sky-500 text-white hover:bg-sky-600">Book a Demo</Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-5 lg:grid-cols-4">
          {usage.map((item) => (
            <UsageCard key={item.label} {...item} />
          ))}
        </div>

        <Card className="rounded-2xl shadow-sm">
          <CardContent className="grid gap-5 p-5">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Billing history</CardTitle>
                <CardDescription className="mt-1">Recent invoices and workspace billing events.</CardDescription>
              </div>
              <Badge variant="outline">Next renewal: Aug 1, 2026</Badge>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-16" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={`${invoice.date}-${invoice.description}`}>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell className="font-medium">{invoice.description}</TableCell>
                    <TableCell>{invoice.amount}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{invoice.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="icon-sm" variant="ghost" aria-label={`Download invoice for ${invoice.date}`}>
                        <Download />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function UsageCard({ label, value, total, detail }: { label: string; value: number; total: number; detail: string }) {
  const percent = Math.round((value / total) * 100);

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="grid gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardDescription>{label}</CardDescription>
            <CardTitle className="mt-1 text-2xl">
              {value.toLocaleString()} / {total.toLocaleString()}
            </CardTitle>
          </div>
          <Badge variant={percent > 80 ? "destructive" : "secondary"}>{percent}%</Badge>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-foreground" style={{ width: `${percent}%` }} />
        </div>
        <div className="text-muted-foreground text-sm">{detail}</div>
      </CardContent>
    </Card>
  );
}
