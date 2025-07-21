"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";

type ComboBoxProps = {
  // data: Models.Document[] | undefined;
  label: string;
  value: string | undefined;
  // label: string;
  previewValue?: string;
  action: (newValue: any) => void;
  values: { [key: string]: any; }[];
  property?: string; // Property to display in the dropdown (default: "name")
  variant?:
  | "ghost"
  | "link"
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | null
  | undefined;
  className?: string;
  CustomComponent?: React.JSX.Element;
  id?: string;
};

export function CustomComboBox({
  label,
  value,
  previewValue,
  action,
  values,
  property = "name",
  variant = "ghost",
  className,
  CustomComponent,
  id,
}: ComboBoxProps) {
  // const { doctors } = useDoctorsStore();
  const [open, setOpen] = React.useState(false);

  const handleOnSelect = (currentValue: string) => {
    // setValue(currentValue === value ? "" : currentValue);
    action(currentValue === value ? undefined : currentValue);
    setOpen(false);
  };

  const shortenName = (name: string) => {
    return name.length > 15 ? name.substring(0, 15) + "..." : name
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {CustomComponent ?? (
          <Button
            id={id ?? `combobox-custom`}
            variant={variant}
            role="combobox"
            aria-expanded={open}
            className={cn(`justify-between`, className)}
          >
            {value
              ? shortenName(previewValue ?? value)
              : `Select ${label}`}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent showArrow className="w-[250px] p-1 pointer-events-auto z-[9999]">
        <Command>
          <CommandInput placeholder={`Search a ${label}...`} className={`h-9`} />
          <CommandList className="z-[9999]">
            <CommandEmpty>No {label} Found.</CommandEmpty>
            <CommandGroup>
              {values?.map((entry) => (
                <CommandItem
                  key={entry.$id}
                  value={entry[property]}
                  onSelect={(currentValue: any) => handleOnSelect(currentValue)}
                >
                  {entry.name} {label === "material" && " ("+ entry.price + ")"}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === entry[property] ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
