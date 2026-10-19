"use client";

import { Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ProjectionSettingsModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Settings2 /> Projection settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Projection settings</DialogTitle>
          <DialogDescription>
            Tune growth, budget, agent preference, department focus, and automation targets.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-5">
          <div className="grid gap-2">
            <div className="font-medium text-sm">Growth speed</div>
            <Tabs defaultValue="medium">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="slow">Slow</TabsTrigger>
                <TabsTrigger value="medium">Medium</TabsTrigger>
                <TabsTrigger value="fast">Fast</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-2">
              <div className="font-medium text-sm">Max added budget</div>
              <Input className="h-11" defaultValue="TRY 340K" />
            </div>
            <div className="grid gap-2">
              <div className="font-medium text-sm">Attrition assumption</div>
              <Input className="h-11" defaultValue="8% yearly" />
            </div>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Agent preference</span>
              <span className="text-muted-foreground">Human first to Agent first</span>
            </div>
            <Slider defaultValue={[68]} max={100} step={1} />
          </div>
          <div className="grid gap-2">
            <div className="font-medium text-sm">Department focus</div>
            <div className="flex flex-wrap gap-2">
              {["Engineering", "Operations", "Finance", "Marketing"].map((item) => (
                <Button
                  key={item}
                  size="sm"
                  variant={item === "Engineering" || item === "Operations" ? "default" : "outline"}
                >
                  {item}
                </Button>
              ))}
            </div>
          </div>
          <div className="grid gap-2">
            <div className="font-medium text-sm">Automation target</div>
            <Slider defaultValue={[70]} max={100} step={1} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Preview</Button>
          <Button>Apply projection</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
