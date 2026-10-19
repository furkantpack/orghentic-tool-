import { siGoogle } from "simple-icons";

import { SimpleIcon } from "@/components/simple-icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function GoogleButton({ className, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button
      variant="outline"
      className={cn(
        "h-11 justify-center gap-3 rounded-lg border bg-background font-medium shadow-xs hover:bg-muted/50",
        className,
      )}
      {...props}
    >
      <span className="flex size-6 items-center justify-center rounded-full bg-white shadow-xs">
        <SimpleIcon icon={siGoogle} className="size-4" />
      </span>
      Continue with Google
    </Button>
  );
}
