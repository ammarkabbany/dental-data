"use client";

import * as React from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useTeam } from "@/providers/team-provider"
import { ChevronsUpDown, PlusIcon, Users2 } from "lucide-react";

export function TeamSwitcher() {
  const { currentTeam: team } = useTeam();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="lg"
          className="bg-sidebar h-12 hover:bg-sidebar-accent w-full text-sidebar-accent-foreground focus-visible:ring-0 gap-3 [&>svg]:size-auto"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-md overflow-hidden bg-sidebar-primary text-sidebar-primary-foreground">
            {team && (
              // <Image
              //   src={activeTeam.logo}
              //   width={36}
              //   height={36}
              //   alt={activeTeam.name}
              // />
              <Users2 className="size-5" />
            )}
          </div>
          <div className="grid flex-1 text-left text-base leading-tight">
            <span className="truncate font-medium">
              {team?.name ?? "Select a Team"}
            </span>
          </div>
          <ChevronsUpDown
            className="ms-auto text-muted-foreground/60"
            size={20}
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-md"
        align="start"
        side="bottom"
        sideOffset={4}
      >
        <DropdownMenuLabel className="uppercase text-muted-foreground/60 text-xs">
          Teams
        </DropdownMenuLabel>
          {team && (
              <DropdownMenuItem
                key={team.$id}
                // onClick={() => setActiveTeam(team)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md overflow-hidden">
                  {team && (
                    <Users2 className="size-5" />
                  )}
                </div>
                {team.name}
              </DropdownMenuItem>
            )}
        {/* <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 p-2">
          <PlusIcon className="opacity-60" size={16} aria-hidden="true" />
          <div className="font-medium">Add team</div>
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

{
  /* {teams.map((team, index) => (
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
            ))} */
}
