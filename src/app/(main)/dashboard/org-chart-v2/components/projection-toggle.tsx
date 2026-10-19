import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type ProjectionView = "now" | "3m" | "6m" | "12m";

const projectionOptions: {
  accent: string;
  label: string;
  value: ProjectionView;
}[] = [
  { accent: "bg-slate-400", label: "Now", value: "now" },
  { accent: "bg-teal-500", label: "3 mo", value: "3m" },
  { accent: "bg-violet-500", label: "6 mo", value: "6m" },
  { accent: "bg-rose-500", label: "1 yr", value: "12m" },
];

export function ProjectionToggle({
  onChange,
  value,
}: {
  onChange: (value: ProjectionView) => void;
  value: ProjectionView;
}) {
  return (
    <Tabs value={value} onValueChange={(next) => onChange(next as ProjectionView)} className="w-full lg:w-auto">
      <TabsList className="grid h-11 w-full grid-cols-4 gap-1 rounded-lg border bg-sky-50/70 p-1 lg:w-[520px] dark:bg-sky-500/10">
        {projectionOptions.map((option) => (
          <TabsTrigger
            key={option.value}
            value={option.value}
            className="h-9 justify-center rounded-md px-3 text-center data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <span className="flex items-center gap-2 font-semibold text-sm">
              <span className={`size-2 rounded-full ${option.accent}`} />
              {option.label}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
