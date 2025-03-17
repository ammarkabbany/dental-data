"use client";

import * as React from "react";
import {
  FilterX,
  ListFilter,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "../ui/badge";

export function CasesFiltersPopover({clearFilters, children, indicator = 0}: {clearFilters: () => void, children: React.ReactNode, indicator: any}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant={"outline"} className="gap-2 transition">
          <ListFilter className="size-4" />
          Filters
          <Badge variant={"default"}>{indicator}</Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Filters</h4>
            <p className="text-sm text-muted-foreground">
              Adjust the following filters to refine your search.
            </p>
          </div>
          {children}
          <Button variant={"destructive"} className="gap-2" onClick={clearFilters}>
            <FilterX className="size-4" />
            Clear Filters
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
