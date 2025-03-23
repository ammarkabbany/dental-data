"use client";

import { Badge, Bell, FileText, FlaskConical, Settings, Users } from "lucide-react";

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
import { useUser } from "@clerk/nextjs";

export function UserNav() {
  const {logOut} = useAuth();
  const {user} = useUser();

  return (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger className="hover:opacity-80 transition bg-white rounded-full">
              <UserAvatar className="size-9" name={user?.username || ""} image={user?.imageUrl} />
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">Profile</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent
        className="w-64 rounded-xl bg-sidebar p-2 shadow-xl"
        align="end"
        forceMount
      >
        <div className="flex items-center gap-3 p-2">
          <UserAvatar className="bg-white size-9" name={user?.username || ""} image={user?.imageUrl} />
          <div className="flex flex-col space-y-0.5">
            <p className="text-sm font-medium leading-none text-white">{user?.fullName}</p>
            <p className="text-xs leading-none">{shortenString(user?.primaryEmailAddress?.emailAddress, 25)}</p>
            {/* <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    <p className="text-xs">Online</p>
                  </div> */}
          </div>
        </div>
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuItem className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-sidebar-accent">
          <Users className="h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-sidebar-accent" asChild>
          <Link href={'/dashboard/cases'}>
            <FileText className="h-4 w-4" />
            Cases
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-sidebar-accent">
          <Settings className="h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuItem disabled className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-sidebar-accent">
          <FlaskConical className="h-4 w-4" />
          Lab Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuItem onClick={logOut} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-sidebar-accent">
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
