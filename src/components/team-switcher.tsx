"use client";

import * as React from "react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useTeam } from "@/providers/team-provider";
import { UserAvatar } from "./user-avatar";
import { avatars } from "@/lib/appwrite/client";

export function TeamSwitcher() {
  const {currentTeam: team} = useTeam();
  return (
    <DropdownMenu open={false}>
      <DropdownMenuTrigger asChild>
        <Button
          size="lg"
          variant={"secondary"}
          className="w-full transition-all justify-start text-start pl-3"
        // onClick={() => role === "owner" && router.push('/dashboard/team')}
        >
          <div className="flex size-7 items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            {/* {team?.logo && <team.logo className="size-5" />} */}
            <UserAvatar className="size-full" image={avatars.getInitials(team?.name)} name={team?.name ?? ""} />
          </div>
          <div className="grid flex-1 text-sm leading-tight">
            <span className="truncate font-semibold">{team?.name}</span>
            <span className={`truncate capitalize text-xs text-muted-foreground`}>
              {team?.planId}
            </span>
          </div>
          {/* <ChevronsUpDown className="ml-auto" /> */}
        </Button>
      </DropdownMenuTrigger>
      {/* <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        align="start"
        side={"top"}
        sideOffset={4}
      >
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Teams
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 p-2">
          <div className="flex size-6 items-center justify-center rounded-md border bg-background">
            <Plus className="size-4" />
          </div>
          <div className="font-medium text-muted-foreground">Add team</div>
        </DropdownMenuItem>
      </DropdownMenuContent> */}
    </DropdownMenu>
  );
}

{/* {teams.map((team, index) => (
              <DropdownMenuItem
                key={team.name}
                onClick={() => setActiveTeam(team)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <team.logo className="size-4 shrink-0" />
                </div>
                {team.name}
              </DropdownMenuItem>
            ))} */}