"use client";

import { ChevronDown, FileText, Settings, SquareUserRound, UsersRoundIcon } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/providers/auth-provider";
import { UserAvatar } from "../user-avatar";
import { shortenString } from "@/lib/format-utils";
import Link from "next/link";
import useTeamStore from "@/store/team-store";

export function UserNav({side = "bottom", includeDetails = true}: {side?: "left" | "right" | "top" | "bottom", includeDetails?: boolean}) {
  const { logOut, user } = useAuth();
  const {userRole} = useTeamStore();

  return (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger className="w-full transition p-1 hover:bg-sidebar-accent hover:opacity-75 duration-300 rounded-sm focus-within:outline-none flex items-center justify-between gap-x-2">
              <div className="flex items-center gap-2">
                <UserAvatar className="size-10 ring-0 rounded" name={user?.name || ""} image={user?.avatar} />
                {includeDetails && <div className="flex flex-col items-start">
                  <span className="">{user?.name}</span>
                  {userRole && <span className="text-xs text-muted-foreground capitalize">Team {userRole}</span>}
                </div>}
              </div>
              {includeDetails && <ChevronDown className="h-4 w-4 ml-2" />}
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">Profile</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent
        className="w-64 p-2 shadow-xl dark:from-background dark:to-accent bg-gradient-to-t"
        align="center"
        side={side}
        forceMount
      >
        <div className="flex items-center gap-3 p-2">
          <UserAvatar className="bg-white size-9 ring-2 ring-offset-2 ring-offset-background ring-secondary" name={user?.name || ""} image={user?.avatar} />
          <div className="flex flex-col space-y-0.5">
            <p className="text-sm font-medium leading-none text-white">{user?.name}</p>
            <p className="text-xs leading-none">{shortenString(user?.email, 25)}</p>
            {/* <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    <p className="text-xs">Online</p>
                  </div> */}
          </div>
        </div>
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuItem disabled className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition">
          <SquareUserRound className="h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition" asChild>
          <Link href={'/dashboard/cases'}>
            <FileText className="h-4 w-4" />
            Cases
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition" asChild>
          <Link href={'/account'}>
            <Settings className="h-4 w-4" />
            Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuItem className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition" asChild>
          <Link href={'/team'}>
            <UsersRoundIcon className="h-4 w-4" />
            Team</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuItem onClick={logOut} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
