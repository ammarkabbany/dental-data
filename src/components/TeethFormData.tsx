"use client";
import { Material } from "@/types";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooth } from "@/types";
import ToothCheckbox from "./ToothCheckbox";

interface TeethFormDataProps {
  handleChangeToothMaterial(newValue: any): void;
  handleCheckTeeth: (event: any, label: number) => void;
  data: Tooth[];
  checkedTeeth: number[];
  materials: Material[];
  resetTeeth?: () => void; // New reset function prop
}

export default function TeethFormData({
  handleChangeToothMaterial,
  handleCheckTeeth,
  data,
  checkedTeeth,
  materials,
  resetTeeth,
}: TeethFormDataProps) {
  const [selectedTooth, setSelectedTooth] = useState<Tooth | undefined>();

  const handleSelectTooth = (value: string) => {
    const label = parseInt(value);
    const tooth = data.find((t: Tooth) => t.label === label);
    setSelectedTooth(tooth);
  };

  const doHandleSelectToothMaterial = (value: string) => {
    const choice = materials.find(
      (material: Material) => material.$id === value
    );
    handleChangeToothMaterial({ ...selectedTooth, material: choice });
    setSelectedTooth((prevTooth) => {
      const newTooth = {
        label: prevTooth !== undefined ? prevTooth?.label : 0,
        materialId: value,
      };
      return newTooth;
    });
  };
  const Upper = [
    { label: 11, reverse: true, translate: "-translate-x-1" },
    { label: 21, reverse: false, translate: "translate-x-1" },
    { label: 12, reverse: true, translate: "-translate-x-10" },
    { label: 22, reverse: false, translate: "translate-x-10" },
    { label: 13, reverse: true, translate: "-translate-x-[3.7rem]" },
    { label: 23, reverse: false, translate: "translate-x-[3.7rem]" },
    { label: 14, reverse: true, translate: "-translate-x-[4.7rem]" },
    { label: 24, reverse: false, translate: "translate-x-[4.7rem]" },
    { label: 15, reverse: true, translate: "-translate-x-[6rem]" },
    { label: 25, reverse: false, translate: "translate-x-[6rem]" },
    { label: 16, reverse: true, translate: "-translate-x-[6.7rem]" },
    { label: 26, reverse: false, translate: "translate-x-[6.7rem]" },
    { label: 17, reverse: true, translate: "-translate-x-[7.5rem]" },
    { label: 27, reverse: false, translate: "translate-x-[7.5rem]" },
    { label: 18, reverse: true, translate: "-translate-x-[8rem]" },
    { label: 28, reverse: false, translate: "translate-x-[8rem]" },
  ];
  const Lower = [
    { label: 48, reverse: true, translate: "-translate-x-[8rem]" },
    { label: 38, reverse: false, translate: "translate-x-[8rem]" },
    { label: 47, reverse: true, translate: "-translate-x-[7.5rem]" },
    { label: 37, reverse: false, translate: "translate-x-[7.5rem]" },
    { label: 46, reverse: true, translate: "-translate-x-[6.7rem]" },
    { label: 36, reverse: false, translate: "translate-x-[6.7rem]" },
    { label: 45, reverse: true, translate: "-translate-x-[6rem]" },
    { label: 35, reverse: false, translate: "translate-x-[6rem]" },
    { label: 44, reverse: true, translate: "-translate-x-[4.7rem]" },
    { label: 34, reverse: false, translate: "translate-x-[4.7rem]" },
    { label: 43, reverse: true, translate: "-translate-x-[3.7rem]" },
    { label: 33, reverse: false, translate: "translate-x-[3.7rem]" },
    { label: 42, reverse: true, translate: "-translate-x-10" },
    { label: 32, reverse: false, translate: "translate-x-10" },
    { label: 41, reverse: true, translate: "-translate-x-1" },
    { label: 31, reverse: false, translate: "translate-x-1" },
  ];

  //checked={data?.upper.left.filter(l => l.label === label).length > 0}

  const groupedUpper = Upper.reduce((result: any, _value, index, array) => {
    if (index % 2 === 0) result.push(array.slice(index, index + 2));
    return result;
  }, []);
  const groupedLower = Lower.reduce((result: any, _value, index, array) => {
    if (index % 2 === 0) result.push(array.slice(index, index + 2));
    return result;
  }, []);

  return (
    <div className="flex flex-col items-center space-y-4 lg:space-y-6">
      {/* <svg className="bg-white"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="200 0 100 500"
        width="500"
        height="500"
        preserveAspectRatio="xMinYMin meet"
        style={{ maxWidth: "100%", height: "auto" }}>
        <g xmlns="http://www.w3.org/2000/svg">
          <path
            fill="#373737"
            d="M 603.5,172.5 C 613.056,171.758 622.056,173.592 630.5,178C 637.137,183.711 639.304,190.877 637,199.5C 634.564,214.478 629.564,228.478 622,241.5C 611.389,249.645 600.889,249.478 590.5,241C 576.097,228.363 568.597,212.53 568,193.5C 573.44,181.251 582.94,174.584 596.5,173.5C 598.415,173.216 600.081,173.549 601.5,174.5C 590.384,174.812 580.884,178.812 573,186.5C 571.441,188.217 570.608,190.217 570.5,192.5C 569.484,211 576.15,226.5 590.5,239C 599.483,246.409 609.15,247.409 619.5,242C 624.663,234.862 628.496,227.029 631,218.5C 633.408,209.958 635.242,201.291 636.5,192.5C 636.547,187.945 634.881,184.278 631.5,181.5C 626.221,176.626 619.888,174.292 612.5,174.5C 609.5,173.833 606.5,173.167 603.5,172.5 Z"
          />
        </g>
      </svg> */}
      <ToothCheckbox
        // onChange={(v) => handleCheckTeeth(e, v)}
        onChange={(e, v) => handleCheckTeeth(e, v)}
        teethData={checkedTeeth}
        onReset={resetTeeth}
        showLabels
      />
      {/* <div className="relative max-w-[125px] mx-auto">
        <div className="flex flex-col gap-1">
          {groupedUpper.map((pair: any, index: any) => (
            <div
              key={index}
              className="grid grid-cols-2 gap-1 justify-items-center"
            >
              {pair.map(({ label, reverse, translate }: any) => (
                <div
                  key={label}
                  className={`flex ${reverse ? 'flex-row-reverse' : 'flex-row'} 
                    items-center justify-center transform ${translate} transition-transform
                    sm:hover:scale-110`}
                >
                  <CustomCheckbox
                    checked={checkedTeeth.includes(label)}
                    onChange={(e) => handleCheckTeeth(e, label)}
                    label={label.toString()}
                    reverse={reverse}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        {resetTeeth && (
          <div className="flex justify-center my-2">
            <Button 
              variant="outline" 
              type="reset"
              size="sm" 
              onClick={resetTeeth}
              className="text-xs px-2 py-1 h-auto hover:bg-accent/80"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Reset
            </Button>
          </div>
        )}

        <div className="h-px w-full bg-border my-2" />

        <div className="flex flex-col gap-1">
          {groupedLower.map((pair: any, index: any) => (
            <div
              key={index}
              className="grid grid-cols-2 gap-1 justify-items-center"
            >
              {pair.map(({ label, reverse, translate }: any) => (
                <div
                  key={label}
                  className={`flex ${reverse ? 'flex-row-reverse' : 'flex-row'} 
                    items-center justify-center transform ${translate} transition-transform`}
                >
                  <CustomCheckbox
                    checked={checkedTeeth.includes(label)}
                    onChange={(e) => handleCheckTeeth(e, label)}
                    label={label.toString()}
                    reverse={reverse}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div> */}
      <div className="text-center text-sm text-muted-foreground mt-4">
        <p>
          Select teeth by clicking. Use Shift+Click to select multiple teeth.
        </p>
      </div>

      {/* Controls */}
      <div className="grid sm:grid-cols-2 gap-4 w-full max-w-[400px]">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Select Tooth</Label>
          <Select
            value={String(selectedTooth?.label)}
            onValueChange={handleSelectTooth}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a tooth" />
            </SelectTrigger>
            <SelectContent>
              {data
                ?.sort((a, b) => a?.label - b?.label)
                .map((t, i) => (
                  <SelectItem key={i} value={String(t.label)}>
                    Tooth {t.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Select Material</Label>
          <Select
            value={selectedTooth?.materialId}
            disabled={!selectedTooth}
            onValueChange={doHandleSelectToothMaterial}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select material" />
            </SelectTrigger>
            <SelectContent>
              {materials
                // .filter((_material) => _material?.$id !== selectedTooth?.materialId)
                .map((_material, index) => (
                  <SelectItem key={index} value={_material?.$id}>
                    {_material.name} ({_material.price})
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
