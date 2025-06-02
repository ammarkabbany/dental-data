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
            <DropdownMenuTrigger className="w-full transition p-1 hover:bg-muted/60 dark:hover:bg-neutral-700/60 duration-200 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring flex items-center justify-between gap-x-2">
              <div className="flex items-center gap-2">
                <UserAvatar className="size-8 md:size-9 ring-1 ring-border dark:ring-neutral-700 rounded-full" name={user?.name || ""} image={user?.avatar} />
                {includeDetails && <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-foreground dark:text-gray-200">{user?.name}</span>
                  {userRole && <span className="text-xs text-muted-foreground dark:text-gray-400 capitalize">Team {userRole}</span>}
                </div>}
              </div>
              {includeDetails && <ChevronDown className="h-4 w-4 ml-2 text-muted-foreground dark:text-gray-400" />}
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="bg-background text-foreground border-border dark:bg-neutral-800 dark:text-gray-200 dark:border-neutral-700">Profile</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent
        className="w-64 p-2 shadow-xl bg-background dark:bg-neutral-800 border border-border dark:border-neutral-700"
        align="center"
        side={side}
        forceMount
      >
        <div className="flex items-center gap-3 p-2 mb-1">
          <UserAvatar className="size-9 rounded-full ring-2 ring-offset-2 ring-offset-background dark:ring-offset-neutral-800 ring-primary dark:ring-primary-foreground/80" name={user?.name || ""} image={user?.avatar} />
          <div className="flex flex-col space-y-0.5">
            <p className="text-sm font-medium leading-none text-foreground dark:text-gray-100">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground dark:text-gray-400">{shortenString(user?.email, 25)}</p>
          </div>
        </div>
        <DropdownMenuSeparator className="my-1 bg-border dark:bg-neutral-700" />
        <DropdownMenuItem disabled className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground dark:text-gray-400 transition-colors hover:bg-muted focus:bg-muted dark:hover:bg-neutral-700 dark:focus:bg-neutral-700">
          <SquareUserRound className="h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground dark:text-gray-200 transition-colors hover:bg-muted focus:bg-muted dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" asChild>
          <Link href={'/dashboard/cases'}>
            <FileText className="h-4 w-4" />
            Cases
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground dark:text-gray-200 transition-colors hover:bg-muted focus:bg-muted dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" asChild>
          <Link href={'/account'}>
            <Settings className="h-4 w-4" />
            Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-1 bg-border dark:bg-neutral-700" />
        <DropdownMenuItem className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground dark:text-gray-200 transition-colors hover:bg-muted focus:bg-muted dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" asChild>
          <Link href={'/team'}>
            <UsersRoundIcon className="h-4 w-4" />
            Team</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-1 bg-border dark:bg-neutral-700" />
        <DropdownMenuItem onClick={logOut} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground dark:text-red-400 dark:hover:bg-red-500/10 transition-colors hover:bg-destructive/10 focus:bg-destructive/10 hover:text-destructive focus:text-destructive dark:hover:text-red-400 dark:focus:text-red-400">
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
