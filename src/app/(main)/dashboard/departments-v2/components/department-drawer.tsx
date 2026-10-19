import { Bot, CircleDollarSign, ClipboardList, Settings2, UserRound, WalletCards } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { Department } from "../data";
import { ActionsTab } from "./tabs/actions-tab";
import { AgentsTab } from "./tabs/agents-tab";
import { BudgetTab } from "./tabs/budget-tab";
import { OverviewTab } from "./tabs/overview-tab";
import { PeopleTab } from "./tabs/people-tab";
import { TasksTab } from "./tabs/tasks-tab";
import { TokensTab } from "./tabs/tokens-tab";

export function DepartmentDrawer({ department }: { department: Department }) {
  return (
    <SheetContent className="!w-[min(96vw,900px)] !max-w-[min(96vw,900px)] 2xl:!w-[52vw] 2xl:!max-w-[52vw] overflow-y-auto p-0">
      <SheetHeader className="border-b p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <SheetTitle>{department.name}</SheetTitle>
            <SheetDescription className="mt-1 max-w-2xl">{department.description}</SheetDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline">
              <Bot /> Add Agent
            </Button>
            <Button size="sm">
              <Settings2 /> Edit Department
            </Button>
          </div>
        </div>
      </SheetHeader>

      <Tabs defaultValue="overview" className="grid gap-0">
        <div className="sticky top-0 z-10 overflow-x-auto border-b bg-background px-5 py-3">
          <TabsList className="grid h-auto min-w-[680px] grid-cols-7 gap-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="people">
              <UserRound /> People
            </TabsTrigger>
            <TabsTrigger value="agents">
              <Bot /> Agents
            </TabsTrigger>
            <TabsTrigger value="tokens">
              <WalletCards /> Tokens
            </TabsTrigger>
            <TabsTrigger value="tasks">
              <ClipboardList /> Tasks
            </TabsTrigger>
            <TabsTrigger value="budget">
              <CircleDollarSign /> Budget
            </TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>
        </div>

        <div className="p-5">
          <TabsContent value="overview" className="m-0">
            <OverviewTab department={department} />
          </TabsContent>
          <TabsContent value="people" className="m-0">
            <PeopleTab department={department} />
          </TabsContent>
          <TabsContent value="agents" className="m-0">
            <AgentsTab department={department} />
          </TabsContent>
          <TabsContent value="tokens" className="m-0">
            <TokensTab department={department} />
          </TabsContent>
          <TabsContent value="tasks" className="m-0">
            <TasksTab department={department} />
          </TabsContent>
          <TabsContent value="budget" className="m-0">
            <BudgetTab department={department} />
          </TabsContent>
          <TabsContent value="actions" className="m-0">
            <ActionsTab department={department} />
          </TabsContent>
        </div>
      </Tabs>
    </SheetContent>
  );
}
