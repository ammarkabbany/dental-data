"use client";

import React, { useState, useEffect } from "react";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ResponsiveModal } from "../responsive-modal";
import { useModalStore } from "@/store/modal-store";
import { Case } from "@/types";
import { formatCurrency, formatNumbers } from "@/lib/format-utils";
import { calculateUnits } from "@/lib/case-utils";
import { useDoctorsStore } from "@/store/doctors-store";
import useTeamStore from "@/store/team-store";
import { useCreateCaseInvoice } from "@/features/cases/hooks/use-create-case-invoice";

interface SaveCaseExportPromptProps {
  selectedCases: Case[];
  exportOptions: { [key: string]: boolean | number };
}

export function SaveCaseExportPrompt({
  selectedCases,
  exportOptions,
}: SaveCaseExportPromptProps) {
  const { isModalOpen, closeModal } = useModalStore();
  const { getDoctorById } = useDoctorsStore();
  const { currentAppwriteTeam } = useTeamStore();
  const { mutate: createCaseInvoice, isPending } = useCreateCaseInvoice();

  const [invoiceName, setInvoiceName] = useState("");

  useEffect(() => {
    if (selectedCases.length > 0) {
      const firstCase = selectedCases[0];
      const doctorName = getDoctorById(firstCase.doctorId)?.name || "";
      const date = new Date();
      const month = date.toLocaleString("default", { month: "long" });
      const year = date.getFullYear();
      setInvoiceName(`${doctorName} - ${month} ${year}`);
    }
  }, [selectedCases, getDoctorById]);

  const totalCases = selectedCases.length;
  const totalUnits = selectedCases.reduce(
    (total, caseItem) =>
      total + (calculateUnits(JSON.parse(String(caseItem.data))) || 0),
    0,
  );
  const totalDue = selectedCases.reduce(
    (total, caseItem) => total + caseItem.due,
    0,
  );
  const deductAmount = Number(exportOptions["deductAmount"] || 0);
  const adjustedTotal = totalDue - deductAmount;

  const handleSave = () => {
    const doctorId = selectedCases[0]?.doctorId;
    if (!doctorId) {
      console.error("Doctor ID not found for selected cases.");
      return;
    }

    createCaseInvoice({
      data: {
        name: invoiceName,
        doctorId,
        cases: selectedCases,
        totalAmount: totalDue,
        deducted: deductAmount,
        finalAmount: adjustedTotal,
      },
    });
    closeModal("save-case-export-prompt");
  };

  return (
    <ResponsiveModal
      open={isModalOpen("save-case-export-prompt")}
      onOpenChange={() => closeModal("save-case-export-prompt")}
    >
      <div className="p-7 space-y-4">
        <DialogHeader>
          <DialogTitle><span className="text-muted-foreground">Optional: </span>Save Export</DialogTitle>
          <DialogDescription>
            Enter a name for the export and review the summary.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="items-center gap-4">
            <Label htmlFor="invoice-name" className="">
              Invoice Name
            </Label>
            <Input
              id="invoice-name"
              value={invoiceName}
              onChange={(e) => setInvoiceName(e.target.value)}
              className=""
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Summary</h3>
            <p>Number of Cases: {totalCases}</p>
            <p>Total Units: {totalUnits}</p>
            <p>
              Total Due:{" "}
              {formatCurrency(totalDue, currentAppwriteTeam?.prefs?.currency)}
            </p>
            {deductAmount > 0 && (
              <p>
                Deduction:{" "}
                {formatNumbers(deductAmount)}
              </p>
            )}
            <p>
              Adjusted Total:{" "}
              {formatCurrency(
                adjustedTotal,
                currentAppwriteTeam?.prefs?.currency,
              )}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => closeModal("save-case-export-prompt")}>
            No Thanks
          </Button>
          <Button type="button" onClick={handleSave} disabled={isPending}>
            Save
          </Button>
        </DialogFooter>
      </div>
    </ResponsiveModal>
  );
}