"use client";

import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DayPickerProps } from "react-day-picker";

type DatePickerProps = {
  date: any;
  setDate: any;
  mode?: DayPickerProps['mode'];
  id?: string;
  customFormat?: string;
  className?: string;
  children?: React.ReactNode;
};

export function DatePicker({
  date,
  setDate,
  mode = "single",
  id = "custom-date-picker",
  customFormat = "y/M/d",
  className,
  children,
}: DatePickerProps) {
  const dateView = date ? (
    mode === "single" ? (
      format(date, customFormat)
    ) : (
      <div className="flex sm:flex-row gap-1">
        <span>{date.from && format(date.from, customFormat)}</span>
        <span>{date.to && format(date.to, customFormat)}</span>
      </div>
    )
  ) : (
    <span>
      Select Date
    </span>
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        {children ?? (
          <Button
            id={id}
            variant={"secondary"}
            className={cn(
              "text-sm justify-start font-normal gap-2",
              !date && "text-muted-foreground",
              className,
            )}
          >
            <CalendarIcon className="h-4 w-4" />
            {dateView}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="start" side="bottom">
        <Calendar 
          mode={mode}
          selected={date}
          onSelect={setDate}
          required={false}
        />
      </PopoverContent>
    </Popover>
  );
}
