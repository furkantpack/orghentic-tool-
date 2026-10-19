import {
  Banknote,
  Building2,
  ChartBar,
  CheckSquare,
  CreditCard,
  Fingerprint,
  LayoutDashboard,
  LibraryBig,
  Lock,
  type LucideIcon,
  Network,
  Rocket,
  SquareArrowUpRight,
  Users,
  Wrench,
} from "lucide-react";

export type NavBadge = "new" | "soon";

export interface NavSubItem {
  id: string;
  title: string;
  url: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}

interface NavItemBase {
  id: string;
  title: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}

export interface NavMainLinkItem extends NavItemBase {
  url: string;
  subItems?: never;
}

export interface NavMainParentItem extends NavItemBase {
  subItems: NavSubItem[];
}

export type NavMainItem = NavMainLinkItem | NavMainParentItem;

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "OrgFlow",
    items: [
      {
        id: "dashboard",
        title: "Dashboard",
        url: "/dashboard/crm",
        icon: LayoutDashboard,
      },
      {
        id: "dashboard-new",
        title: "Dashboard New",
        url: "/dashboard/dashboard-new",
        icon: LayoutDashboard,
        badge: "new",
      },
      {
        id: "design-library",
        title: "Design Library",
        url: "/dashboard/design-library",
        icon: LibraryBig,
        badge: "new",
      },
      {
        id: "org-chart-v2",
        title: "Org Chart v2",
        url: "/dashboard/org-chart-v2",
        icon: Network,
        badge: "new",
      },
      {
        id: "scenarios",
        title: "Scenarios",
        url: "/dashboard/scenarios",
        icon: ChartBar,
        badge: "new",
      },
      {
        id: "finance-v2",
        title: "Finance v2",
        url: "/dashboard/finance-v2",
        icon: Banknote,
        badge: "new",
      },
    ],
  },
  {
    id: 2,
    label: "Workspace",
    items: [
      {
        id: "tasks",
        title: "Tasks",
        url: "/dashboard/tasks",
        icon: CheckSquare,
        badge: "new",
      },
      {
        id: "users",
        title: "Users",
        url: "/dashboard/users",
        icon: Users,
      },
      {
        id: "departments-v2",
        title: "Departments v2",
        url: "/dashboard/departments-v2",
        icon: Building2,
        badge: "new",
      },
      {
        id: "connected-tools",
        title: "Connected Tools",
        url: "/dashboard/connected-tools",
        icon: Wrench,
        badge: "new",
      },
      {
        id: "billing-usage",
        title: "Billing / Usage",
        url: "/dashboard/billing-usage",
        icon: CreditCard,
        badge: "new",
      },
    ],
  },
  {
    id: 3,
    label: "Access",
    items: [
      {
        id: "authentication",
        title: "Authentication",
        icon: Fingerprint,
        subItems: [
          { id: "auth-new-login", title: "New Login", url: "/auth/new-login", badge: "new", newTab: true },
          { id: "auth-login-v1", title: "Login v1", url: "/auth/v1/login", newTab: true },
          { id: "auth-login-v2", title: "Login v2", url: "/auth/v2/login", newTab: true },
          { id: "auth-register-v1", title: "Register v1", url: "/auth/v1/register", newTab: true },
          { id: "auth-register-v2", title: "Register v2", url: "/auth/v2/register", newTab: true },
        ],
      },
      {
        id: "roles",
        title: "Roles",
        url: "/dashboard/roles",
        icon: Lock,
      },
      {
        id: "onboarding",
        title: "Onboarding",
        url: "/onboarding",
        icon: Rocket,
        badge: "new",
        newTab: true,
      },
    ],
  },
  {
    id: 5,
    label: "Misc",
    items: [
      {
        id: "others",
        title: "Others",
        url: "/dashboard/coming-soon",
        icon: SquareArrowUpRight,
        badge: "soon",
        disabled: true,
      },
    ],
  },
];
