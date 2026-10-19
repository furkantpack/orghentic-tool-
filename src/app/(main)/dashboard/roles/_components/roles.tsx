"use client";
"use no memo";

import { useState } from "react";

import {
  type ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import { AlertTriangle, ChevronRight, FileUp, Search } from "lucide-react";

import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { rolesColumns } from "./roles-table/columns";
import type { Role } from "./roles-table/data";
import { RolesTable } from "./roles-table/table";

function getRoleTypeFilter(groupFilter: string) {
  if (groupFilter === "System roles") {
    return "System";
  }

  if (groupFilter === "Custom roles") {
    return "Custom";
  }

  return "All";
}

function getRoleGroupFilterValue(typeFilter: string) {
  if (typeFilter === "System") {
    return "System roles";
  }

  if (typeFilter === "Custom") {
    return "Custom roles";
  }

  return undefined;
}

export function Roles({ roles }: { roles: Role[] }) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 12,
  });

  const table = useReactTable({
    data: roles,
    columns: rolesColumns,
    defaultColumn: {
      size: 140,
      minSize: 80,
      maxSize: 420,
    },
    state: { columnFilters, pagination },
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: false,
    initialState: {
      columnVisibility: { group: false, search: false },
    },
  });

  const search = (table.getColumn("search")?.getFilterValue() as string) ?? "";
  const groupFilter = (table.getColumn("group")?.getFilterValue() as string) ?? "";
  const typeFilter = getRoleTypeFilter(groupFilter);
  const ownerFilter = (table.getColumn("owner")?.getFilterValue() as string) ?? "All";
  const statusFilter = (table.getColumn("status")?.getFilterValue() as string) ?? "All";

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="bg-gradient-to-r from-sky-700 to-violet-600 bg-clip-text text-3xl text-transparent tracking-tight dark:from-sky-300 dark:to-violet-300">
            Roles & Permissions
          </h1>
          <p className="text-muted-foreground text-sm">
            Control how people and agents access org charts, departments, financial data, and automations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            <FileUp data-icon="inline-start" />
            Import JSON
          </Button>
          <Button size="sm" className="bg-sky-600 hover:bg-sky-700">
            Create role
          </Button>
        </div>
      </div>

      <Tabs className="h-full gap-4" defaultValue="roles">
        <TabsList
          variant="line"
          className="w-full justify-start gap-2 border-b ps-0 *:data-[slot=tabs-trigger]:flex-none"
        >
          <TabsTrigger className="data-[state=active]:text-sky-700 dark:data-[state=active]:text-sky-300" value="roles">
            Roles
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:text-violet-700 dark:data-[state=active]:text-violet-300"
            value="permission-sets"
          >
            Permission sets
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:text-emerald-700 dark:data-[state=active]:text-emerald-300"
            value="access-reviews"
          >
            Access reviews
          </TabsTrigger>
        </TabsList>

        <TabsContent value="roles">
          <div className="flex flex-col gap-4">
            <Alert className="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
              <AlertTriangle className="size-4" />
              <AlertTitle>Access review required</AlertTitle>
              <AlertDescription>3 roles include changes to finance, agent, or workspace permissions.</AlertDescription>
              <AlertAction>
                <Button size="sm" variant="link">
                  Review changes
                  <ChevronRight data-icon="inline-end" />
                </Button>
              </AlertAction>
            </Alert>

            <div className="overflow-hidden rounded-xl border border-sky-100 bg-background dark:border-sky-500/15">
              <div className="flex flex-col items-stretch gap-4 bg-gradient-to-r from-sky-50/70 via-background to-violet-50/50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 dark:from-sky-500/5 dark:to-violet-500/5">
                <InputGroup className="h-7 w-full rounded-md sm:w-82">
                  <InputGroupAddon>
                    <Search />
                  </InputGroupAddon>
                  <InputGroupInput
                    className="h-7"
                    placeholder="Search roles..."
                    value={search}
                    onChange={(e) => {
                      table.getColumn("search")?.setFilterValue(e.target.value || undefined);
                      table.setPageIndex(0);
                    }}
                  />
                </InputGroup>

                <div className="flex flex-wrap items-center gap-2">
                  <Select
                    value={typeFilter}
                    onValueChange={(v) => {
                      table.getColumn("group")?.setFilterValue(getRoleGroupFilterValue(v));
                      table.setPageIndex(0);
                    }}
                  >
                    <SelectTrigger size="sm">
                      <span className="text-muted-foreground">Type:</span>
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent position="popper" align="start">
                      <SelectGroup>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="System">System</SelectItem>
                        <SelectItem value="Custom">Custom</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  <Select
                    value={ownerFilter}
                    onValueChange={(v) => {
                      table.getColumn("owner")?.setFilterValue(v === "All" ? undefined : v);
                      table.setPageIndex(0);
                    }}
                  >
                    <SelectTrigger size="sm">
                      <span className="text-muted-foreground">Owner:</span>
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent position="popper" align="start">
                      <SelectGroup>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="System">System</SelectItem>
                        <SelectItem value="Mert Aydin">Mert Aydin</SelectItem>
                        <SelectItem value="Deniz Kaya">Deniz Kaya</SelectItem>
                        <SelectItem value="Selin Yilmaz">Selin Yilmaz</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  <Select
                    value={statusFilter}
                    onValueChange={(v) => {
                      table.getColumn("status")?.setFilterValue(v === "All" ? undefined : v);
                      table.setPageIndex(0);
                    }}
                  >
                    <SelectTrigger size="sm">
                      <span className="text-muted-foreground">Status:</span>
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent position="popper" align="start">
                      <SelectGroup>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Needs review">Needs review</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <RolesTable table={table} />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="permission-sets">
          <div className="flex h-full items-center justify-center rounded-md border border-dashed text-muted-foreground text-sm">
            Agent and workspace permission bundles will appear here.
          </div>
        </TabsContent>
        <TabsContent value="access-reviews">
          <div className="flex h-full items-center justify-center rounded-md border border-dashed text-muted-foreground text-sm">
            Scheduled access reviews will appear here.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
