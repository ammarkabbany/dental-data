"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Case } from "@/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Edit, Download, Trash2, MoreVertical, FileEdit, Copy, CheckSquare, X } from "lucide-react";
import { usePermission } from "@/hooks/use-permissions";
import useTeamStore from "@/store/team-store";
import { DeleteCaseModal } from "./delete-case-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface FloatingDockProps {
  selectedCases: Case[];
  onClearSelection: () => void;
  onDuplicate?: (cases: Case[]) => void;
  onExport?: (cases: Case[]) => void;
  onEdit?: (caseItem: Case) => void;
}

export function FloatingDock({
  selectedCases,
  onClearSelection,
  onDuplicate,
  onExport,
  onEdit,
}: FloatingDockProps) {
  const { userRole } = useTeamStore();
  const permissions = usePermission(userRole);

  const canDelete = permissions.checkPermission("cases", "delete");
  const canExport = permissions.checkPermission("export", "has");
  const canEdit = permissions.checkPermission("cases", "update");
  
  const singleCaseSelected = selectedCases.length === 1;

  return (
    <AnimatePresence>
      {selectedCases.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50"
          data-floating-dock="true"
        >
          <div className="flex items-center gap-2 bg-background border rounded-xl shadow-lg p-3 relative backdrop-blur-sm">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-xs py-1 px-3 rounded-full">
              {selectedCases.length} {selectedCases.length === 1 ? "case" : "cases"} selected
            </div>
            
            <TooltipProvider delayDuration={100}>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="rounded-full hover:bg-muted"
                  onClick={onClearSelection}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Clear selection</span>
                </Button>

                {canEdit && singleCaseSelected && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full hover:bg-blue-500/10 text-blue-500"
                        onClick={() => onEdit && onEdit(selectedCases[0])}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit case</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Edit case</TooltipContent>
                  </Tooltip>
                )}

                {canExport && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full hover:bg-green-500/10 text-green-500"
                        onClick={() => onExport && onExport(selectedCases)}
                      >
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Export cases</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Export</TooltipContent>
                  </Tooltip>
                )}

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full hover:bg-purple-500/10 text-purple-500"
                      onClick={() => onDuplicate && onDuplicate(selectedCases)}
                    >
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Duplicate cases</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Duplicate</TooltipContent>
                </Tooltip>

                {canDelete && (
                  <DeleteCaseModal
                    cases={selectedCases}
                    component={
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full hover:bg-red-500/10 text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete cases</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">Delete</TooltipContent>
                      </Tooltip>
                    }
                  />
                )}

                <DropdownMenu>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full hover:bg-muted"
                        >
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">More options</span>
                        </Button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="top">More options</TooltipContent>
                  </Tooltip>
                  <DropdownMenuContent align="end" className="w-[180px]">
                    <DropdownMenuItem
                      onClick={() => onClearSelection()}
                      className="cursor-pointer flex items-center gap-2"
                    >
                      <CheckSquare className="h-4 w-4" />
                      <span>Deselect all</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {/* Add more actions as needed */}
                    {singleCaseSelected && canEdit && (
                      <DropdownMenuItem
                        onClick={() => onEdit && onEdit(selectedCases[0])}
                        className="cursor-pointer flex items-center gap-2"
                      >
                        <FileEdit className="h-4 w-4" />
                        <span>View details</span>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TooltipProvider>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
