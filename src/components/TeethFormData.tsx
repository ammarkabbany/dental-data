"use client"
import { Material } from "@/types";
import CustomCheckbox from "./CustomCheckbox";
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

interface TeethFormDataProps {
  handleChangeToothMaterial(newValue: any): void;
  handleCheckTeeth: (event: any, label: number) => void;
  data: Tooth[];
  checkedTeeth: number[];
  materials: Material[];
}

export default function TeethFormData({
  handleChangeToothMaterial,
  handleCheckTeeth,
  data,
  checkedTeeth,
  materials,
}: TeethFormDataProps) {
  const [selectedTooth, setSelectedTooth] = useState<Tooth | undefined>();

  const handleSelectTooth = (value: string) => {
    const label = parseInt(value);
    const tooth = data.find((t: Tooth) => t.label === label);
    setSelectedTooth(tooth);
  };

  const doHandleSelectToothMaterial = (value: string) => {
    const choice = materials.find(
      (material: Material) => material.$id === value,
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
    <div className="flex flex-col gap-2 items-center">
      <div className="flex flex-col gap-1 max-w-32">
        {groupedUpper.map(
          (
            pair: { label: any; reverse: any; translate: any }[],
            index: number | null | undefined,
          ) => (
            <div
              key={index}
              className={`grid grid-flow-col ${index === 0 ? "gap-4" : ""}`} // Correct conditional classname rendering
            >
              {pair.map(({ label, reverse, translate }) => (
                <div
                  key={label}
                  className={`flex flex-row${
                    reverse ? "-reverse" : ""
                  } items-center gap-2 justify-center ${translate}`}
                >
                  <CustomCheckbox
                    checked={checkedTeeth.includes(label)}
                    onChange={(e) => handleCheckTeeth(e, label)} // Pass event and label to handler
                    label={label}
                    reverse={reverse}
                  />
                </div>
              ))}
            </div>
          ),
        )}

        <div className="h-2" />

        {groupedLower.map(
          (
            pair: { label: any; reverse: any; translate: any }[],
            index: number | null | undefined,
          ) => (
            <div
              key={index}
              className={`grid grid-flow-col ${index === 15 ? "gap-4" : ""}`} // Correct conditional classname rendering
            >
              {pair.map(({ label, reverse, translate }) => (
                <div
                  key={label}
                  className={`flex flex-row${
                    reverse ? "-reverse" : ""
                  } items-center gap-1 justify-center ${translate}`}
                >
                  <CustomCheckbox
                    checked={checkedTeeth.includes(label)}
                    onChange={(e) => handleCheckTeeth(e, label)} // Pass event and label to handler
                    label={label}
                    reverse={reverse}
                  />
                </div>
              ))}
            </div>
          ),
        )}
      </div>

      <div className="flex gap-8 py-2">
        <div>
          <Label id="toothSelect-label">Tooth</Label>
          <Select
            name="toothSelect"
            value={String(selectedTooth?.label)}
            onValueChange={handleSelectTooth}
            // onChange={handleSelectTooth}
            // className="rounded-md w-24 text-gray-200"
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select a tooth" />
            </SelectTrigger>{" "}
            <SelectContent className="">
              {data &&
                data
                  .sort((a, b) => a?.label - b?.label)
                  .map((t, i) => {
                    return (
                      <SelectItem key={i} value={String(t.label)}>
                        {t.label}
                      </SelectItem>
                    );
                  })}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label id="materialSelectTooth-label">Material</Label>
          <Select
            name="material"
            value={selectedTooth?.materialId}
            disabled={!selectedTooth}
            onValueChange={doHandleSelectToothMaterial}
            // onChange={doHandleSelectToothMaterial}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a material" />
            </SelectTrigger>{" "}
            <SelectContent className="">
              {materials
                .filter(
                  (_material: Material) =>
                    _material?.$id !== selectedTooth?.materialId,
                ) // Exclude the selected material from the rest
                .map((_material: Material, index: number) => (
                  <SelectItem className="" key={index} value={_material?.$id}>
                    {_material.name} {_material.price}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
