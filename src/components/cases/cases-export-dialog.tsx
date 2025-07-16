"use client";

import type React from "react";

import { useState } from "react";
import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { useModalStore } from "@/store/modal-store";
import {
  ResponsiveModal,
  ResponsiveModalWithTrigger,
} from "../responsive-modal";
import { Input } from "../ui/input";

interface CasesExportOptions {
  exportOptions: {
    [key: string]: boolean | number;
  };
  setExportOptions: React.Dispatch<
    React.SetStateAction<{ [key: string]: boolean | number }>
  >;
}

export function CasesExportDialog({
  exportOptions,
  setExportOptions,
}: CasesExportOptions) {
  const { openModal, isModalOpen, closeModal } = useModalStore();
  const [format, setFormat] = useState("print");
  // const [fileName, setFileName] = useState("export")

  const handleExport = (e: React.FormEvent) => {
    e.preventDefault();
    openModal("print")
  };

  return (
    <ResponsiveModal
      // trigger={
      //   <DialogTrigger asChild>
      //     <Button className="transition" variant="secondary">
      //       <Save className="mr-2 h-4 w-4" />
      //       Export
      //     </Button>
      //   </DialogTrigger>
      // }
      open={isModalOpen("cases-export")}
      onOpenChange={() => closeModal("cases-export")}
    >
      <div className="p-7 space-y-4">
        <DialogHeader>
          <DialogTitle>Export Options</DialogTitle>
          <DialogDescription>
            Choose your preferred export settings. Click export when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleExport}>
          <div className="grid grid-cols-4 gap-4">
            <div className="grid grid-cols-1 items-center gap-4">
              <Label>Format</Label>
              <RadioGroup
                value={format}
                onValueChange={setFormat}
                className="col-span-3 flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="print" id="print" />
                  <Label htmlFor="print">Print</Label>
                </div>
              </RadioGroup>
            </div>
            <p className="col-span-full">Options</p>
            <div className="flex items-center gap-4 col-span-full">
              <div className="flex flex-col gap-2">
                <Label htmlFor="show_client_switch" className="text-right">
                  Include Client
                </Label>
                <Switch
                  id="show_client_switch"
                  checked={!!exportOptions["showClient"]}
                  onCheckedChange={value =>
                    setExportOptions({
                      ...exportOptions,
                      showClient: value,
                    })
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="show_shade_switch" className="text-right">
                  Include Shade
                </Label>
                <Switch
                  id="show_shade_switch"
                  checked={!!exportOptions["showShade"]}
                  onCheckedChange={value =>
                    setExportOptions({
                      ...exportOptions,
                      showShade: value,
                    })
                  }
                />
              </div>
            </div>
            {/* Deduct Amount Input */}
            <div className="flex flex-col gap-2 col-span-full mt-4">
              <Label htmlFor="deduct_amount_input" className="text-left">
                Deduct Amount
              </Label>
              <Input
                id="deduct_amount_input"
                type="number"
                min="0"
                step="0.01"
                value={String(exportOptions["deductAmount"] ?? 0)}
                onChange={e => setExportOptions({
                  ...exportOptions,
                  deductAmount: Number(e.target.value)
                })}
                className="px-2 py-1 w-32"
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button type="submit">Export</Button>
          </DialogFooter>
        </form>
      </div>
    </ResponsiveModal>
  );
}
