import type { ReactNode } from "react";
import DashboardLayout from "../dashboard/layout";

export default function FounderLayout({ children }: { children: ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
