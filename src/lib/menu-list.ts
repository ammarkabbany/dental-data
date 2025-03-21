import {BalanceScaleIcon, Chart02Icon, CreditCardIcon, DentalToothIcon, Layout01Icon, SchemeIcon, Settings01Icon, TagIcon, UserGroup02Icon} from "@hugeicons/core-free-icons";

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

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          icon: Layout01Icon,
          color: 'text-blue-500',
          submenus: []
        }
      ]
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
          color: 'text-cyan-500'
        },
        {
          href: "/dashboard/templates",
          label: "Templates",
          icon: SchemeIcon,
          color: 'text-green-500'
        },
        {
          href: "/doctor-management",
          label: "Doctor Management",
          icon: BalanceScaleIcon,
          color: 'text-yellow-500'
        },
        {
          href: "/analytics",
          label: "Analytics",
          icon: Chart02Icon,
          color: 'text-blue-500'
        }
      ]
    },
    {
      groupLabel: "Settings",
      menus: [
        {
          href: "/billing",
          label: "Plans & billing",
          icon: CreditCardIcon
        },
        {
          href: "/account",
          label: "Account",
          icon: Settings01Icon
        }
      ]
    }
  ];
}
