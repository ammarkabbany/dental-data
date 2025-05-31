import {
  BalanceScaleIcon,
  Chart02Icon,
  CreditCardIcon,
  DentalToothIcon,
  Layout01Icon,
  SchemeIcon,
  Settings01Icon,
  TagIcon,
  UserGroup02Icon,
} from "@hugeicons/core-free-icons";
import { CubeIcon } from "@radix-ui/react-icons";
import { BarChart3Icon, ClipboardListIcon, CreditCard, FilePlus, FileText, Handshake, Home, Layers, LayoutDashboardIcon, Settings, Settings2, Users, UsersRound } from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: any;
  color?: string;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export enum RouteGroup {
  HOME = "home",
  DASHBOARD = "dashboard",
  UTILITIES = "utilities",
  TEAM = "team",
  ACCOUNT = "account",
}

export enum Routes {
  HOME = "/",
  DASHBOARD = "/dashboard",
  CASES = "/dashboard/cases",
  CASES_NEW = "/dashboard/cases/new",
  TEMPLATES = "/dashboard/templates",
  DOCTORS = "/dashboard/doctors",
  MATERIALS = "/dashboard/materials",
  ANALYTICS = "/dashboard/analytics",
  LOGS = "/dashboard/logs",
  TEAM = "/team",
  TEAM_SETTINGS = "/team/settings",
  ACCOUNT = "/account",
  // BILLING = "/team/billing",
}

export const RouteConfig: Record<
  Routes,
  {
    displayName: string;
    icon?: any;
    group: RouteGroup;
  }
> = {
  [Routes.HOME]: { displayName: "Home", icon: Home, group: RouteGroup.HOME },
  [Routes.DASHBOARD]: {
    displayName: "Overview",
    icon: LayoutDashboardIcon,
    group: RouteGroup.DASHBOARD,
  },
  [Routes.CASES]: {
    displayName: "Cases",
    icon: FileText,
    group: RouteGroup.DASHBOARD,
  },
  [Routes.CASES_NEW]: { displayName: "Create Case", icon: FilePlus, group: RouteGroup.DASHBOARD },
  [Routes.TEMPLATES]: {
    displayName: "Templates",
    icon: Layers,
    group: RouteGroup.UTILITIES,
  },
  [Routes.DOCTORS]: {
    displayName: "Doctors",
    icon: Users,
    group: RouteGroup.DASHBOARD,
  },
  [Routes.MATERIALS]: {
    displayName: "Materials",
    icon: CubeIcon,
    group: RouteGroup.DASHBOARD,
  },
  [Routes.ANALYTICS]: {
    displayName: "Analytics",
    icon: BarChart3Icon,
    group: RouteGroup.DASHBOARD,
  },
  [Routes.LOGS]: { displayName: "Logs", icon: ClipboardListIcon, group: RouteGroup.UTILITIES },
  [Routes.TEAM]: {
    displayName: "Team",
    icon: Handshake,
    group: RouteGroup.TEAM,
  },
  [Routes.TEAM_SETTINGS]: {
    displayName: "Team Settings",
    icon: Settings2,
    group: RouteGroup.TEAM,
  },
  [Routes.ACCOUNT]: {
    displayName: "Account",
    icon: Settings,
    group: RouteGroup.ACCOUNT,
  },
  // [Routes.BILLING]: {
  //   displayName: "Team Billing",
  //   icon: CreditCard,
  //   group: RouteGroup.TEAM,
  // },
};

export function getGroupRoutes(
  group: RouteGroup
): { href: string, displayName: string; icon?: any; group: RouteGroup }[] {
  return Object.entries(RouteConfig)
    .filter(([_, config]) => config.group === group)
    .map(([route, config]) => ({
      href: route,
      displayName: config.displayName,
      icon: config.icon,
      group: config.group,
    }));
}

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          icon: Layout01Icon,
          color: "text-blue-500",
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Contents",
      menus: [
        // {
        //   href: "",
        //   label: "Posts",
        //   icon: SquarePen,
        //   submenus: [
        //     {
        //       href: "/posts",
        //       label: "All Posts"
        //     },
        //     {
        //       href: "/posts/new",
        //       label: "New Post"
        //     }
        //   ]
        // },
        {
          href: "/dashboard/cases",
          label: "Cases",
          icon: DentalToothIcon,
          color: "text-cyan-500",
        },
        {
          href: "/dashboard/templates",
          label: "Templates",
          icon: SchemeIcon,
          color: "text-green-500",
        },
        {
          href: "/doctor-management",
          label: "Doctor Management",
          icon: BalanceScaleIcon,
          color: "text-yellow-500",
        },
        {
          href: "/analytics",
          label: "Analytics",
          icon: Chart02Icon,
          color: "text-blue-500",
        },
      ],
    },
    {
      groupLabel: "Settings",
      menus: [
        {
          href: "/billing",
          label: "Plans & billing",
          icon: CreditCardIcon,
        },
        {
          href: "/account",
          label: "Account",
          icon: Settings01Icon,
        },
      ],
    },
  ];
}
