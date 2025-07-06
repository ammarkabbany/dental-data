"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Case } from "@/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Download, Trash2, X } from "lucide-react";
import { usePermission } from "@/hooks/use-permissions";
import useTeamStore from "@/store/team-store";
import { useModalStore } from "@/store/modal-store";
import { Badge } from "../ui/badge";

interface FloatingDockProps {
  selectedCases: number;
  onClearSelection: () => void;
}

export function FloatingDock({
  selectedCases,
  onClearSelection,
}: FloatingDockProps) {
  const {openModal} = useModalStore();
  const { userRole } = useTeamStore();
  const permissions = usePermission(userRole);

  const canDelete = permissions.checkPermission("cases", "delete");
  const canExport = permissions.checkPermission("export", "has");

  return (
    <AnimatePresence>
      {selectedCases > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50"
          data-floating-dock="true"
        >
          <div className="flex items-center gap-2 bg-sidebar border rounded-xl shadow-lg px-4 py-3 relative backdrop-blur-sm">
            {/* <div className="bg-sidebar-accent text-primary-foreground text-xs p-2 rounded-full">
              {selectedCases} selected
            </div> */}
            <Badge variant={"destructive"} className="rounded-sm absolute w-max -top-3.5 py-0.5 px-1 left-1/2 transform -translate-x-1/2">
              {selectedCases} selected
            </Badge>

            <TooltipProvider delayDuration={100}>
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full hover:bg-sidebar-accent"
                      onClick={onClearSelection}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Clear selection</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Cancel</TooltipContent>
                </Tooltip>

                {canExport && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full hover:bg-emerald-500/25 text-emerald-500"
                        onClick={() => {
                          openModal("cases-export");
                        }}
                      >
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Export cases</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Export</TooltipContent>
                  </Tooltip>
                )}

                {canDelete && selectedCases > 0 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full hover:bg-red-500/25 text-red-500"
                        onClick={() => {
                          openModal("delete-case");
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete cases</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete</TooltipContent>
                  </Tooltip>
                )}
              </div>
            </TooltipProvider>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
