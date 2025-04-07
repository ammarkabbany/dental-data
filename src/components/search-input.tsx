"use client";

import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { motion } from "framer-motion";
import * as React from "react";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
}

export function SearchInput({
  value,
  onChange,
  onClear,
  className,
  ...props
}: SearchInputProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative w-full sm:max-w-sm"
    >
      <Input.Group>
        <Input
          variant="default"
          value={value}
          onChange={onChange}
          className="bg-background/50 border-border/50 focus:bg-background/80 transition-all duration-300"
          {...props}
        >
          <Input.LeftIcon>
            <SearchIcon className="h-4 w-4 text-muted-foreground/70" />
          </Input.LeftIcon>
          {value && (
            <Input.ClearButton
              onClick={onClear}
              className="text-muted-foreground/70 hover:text-foreground transition-colors"
            />
          )}
          <Input.Label>Search</Input.Label>
        </Input>
      </Input.Group>
    </motion.div>
  );
}
