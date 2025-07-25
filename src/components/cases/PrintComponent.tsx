// Add the following CSS to your global stylesheet to ensure proper page breaks when printing:
// @media print {
//   .print-page-break {
//     break-before: page;
//     page-break-before: always;
//   }
// }
import { Doctor, Material, Case, Tooth, ToothCollection } from "@/types";
import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useModalStore } from "@/store/modal-store";
import { calculateUnits } from "@/lib/case-utils";
import { formatCurrency, formatNumbers } from "@/lib/format-utils";
import { Separator } from "@/components/ui/separator";
import { useDoctorsStore } from "@/store/doctors-store";
import { useMaterialsStore } from "@/store/material-store";
import { Models } from "appwrite";
import useTeamStore from "@/store/team-store";
// import { formatCurrency } from "~/lib/utils";

// Define prop types for PrintableTable
type PrintableTableProps = {
  cases: Case[] | null;
  teamPrefs: Models.Preferences | undefined;
  getDoctorById: (id: string) => Doctor | undefined;
  getMaterialById: (id: string) => Material | undefined;
  options: {
    [key: string]: boolean;
  };
};

// Define PrintableTable component with forwardRef
const PrintableTable = React.forwardRef<HTMLDivElement, PrintableTableProps>(
  ({ cases, options, getDoctorById, getMaterialById, teamPrefs }: PrintableTableProps, ref) => {
    // const { team } = useAuth();

    const loadTeethData = (array: Tooth[] | undefined) => {
      if (!array) return [];
      if (array.length === 0) return [];
      const teethData = array.map((tooth) => {
        const th = tooth.label;
        if (th < 20) return th - 10;
        if (th < 30 && th > 20) return th - 20;
        if (th < 40 && th > 30) return th - 30;
        if (th < 50 && th > 40) return th - 40;
      });
      return teethData.sort((a, b) => {
        if (a === undefined || b === undefined) {
          return 0; // Handle undefined values by treating them as equal, or use custom logic
        }
        return a - b; // Normal sorting for defined values
      });
    };

    function chunkArray<T>(array: T[], chunkSize: number): T[][] {
      const results: T[][] = [];
      for (let i = 0; i < array.length; i += chunkSize) {
        results.push(array.slice(i, i + chunkSize));
      }
      return results;
    }

    const caseChunks = chunkArray(cases ?? [], 14);

    return (
      <div className="min-w-max bg-white font-sans" ref={ref}>
        {/* <div className="w-full text-center translate-y-32 z-50 font-bold text-muted-foreground text-lg">
          {team?.name || "team Name"}
        </div> */}
        <div className="scale-85 w-full">
          {caseChunks.map((chunk, idx) => (
            <div
              key={idx}
              className={idx > 0 ? "print-page-break" : ""} // Add print-page-break to all but the first chunk
            >
              <Table className="text-gray-800 h-full w-full">
                <TableHeader className="w-full">
                  <TableRow className="text-gray-800">
                    {options['showClient'] && <TableHead className="font-semibold">Client</TableHead>}
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">Patient</TableHead>
                    <TableHead className="font-semibold text-center -translate-x-4">
                      Data
                    </TableHead>
                    <TableHead className="font-semibold">Material</TableHead>
                    {options['showShade'] && <TableHead className="font-semibold">Shade</TableHead>}
                    <TableHead className="font-semibold text-right">Due</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {chunk.map((caseItem: Case) => {
                    const doctor = getDoctorById(caseItem.doctorId)?.name ?? "N/A"
                    const material = getMaterialById(caseItem.materialId)?.name ?? "N/A"
                    // const material = caseItem.material?.name ?? "N/A"
                    const caseData = caseItem.data ? JSON.parse(String(caseItem.data)) as ToothCollection : undefined;
                    const lowerLeft = loadTeethData(
                      caseData?.lower?.left,
                    ).reverse();
                    const lowerRight = loadTeethData(caseData?.lower?.right);
                    const upperRight = loadTeethData(caseData?.upper?.right);
                    const upperLeft = loadTeethData(
                      caseData?.upper?.left,
                    ).reverse();

                    return (
                      <TableRow key={caseItem.$id}>
                         {options['showClient'] && <TableCell className="text-start max-w-[200px]">
                          {doctor}
                        </TableCell>}
                        <TableCell className="max-w-28">{caseItem.date}</TableCell>
                        <TableCell className="text-start max-w-[200px]">
                          {caseItem.patient}
                        </TableCell>
                        <TableCell>
                          {caseData && (
                            <div className="space-y-1 capitalize tracking-widest font-mono">
                            {/* Spread Upper and seperate them */}
                            <div className="flex h-5 items-center space-x-2">
                              <div className="w-20 text-end">{...upperLeft}</div>
                              <Separator className="bg-muted-foreground h-4" orientation="vertical" />
                              <div className="w-20 text-start">{...upperRight}</div>
                            </div>
                            <div className="flex h-5 items-center space-x-2">
                              <div className="w-20 text-end">{...lowerLeft}</div>
                              <Separator className="bg-muted-foreground h-4" orientation="vertical" />
                              <div className="w-20 text-start">{...lowerRight}</div>
                            </div>
                          </div>
                          )}
                        </TableCell>
                        <TableCell>{material?.split("-")[0]}</TableCell>
                        {options['showShade'] && <TableCell>{caseItem.shade}</TableCell>}
                        <TableCell className="text-right">{caseItem.due}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              {/* Optionally, show totals only on the last page */}
              {idx === caseChunks.length - 1 && (
                <div className="flex flex-row justify-end">
                  <div className="flex gap-2 items-center justify-end text-gray-800">
                    <div className="text-right font-bold min-w-24">Total Units</div>
                    <div className="font-bold">
                      {cases?.reduce(
                        (totalUnits, caseItem) =>
                          totalUnits + (calculateUnits(JSON.parse(String(caseItem.data))) || 0),
                        0,
                      )}
                    </div>
                  </div>
                  {/* Deduction row if present */}
                  {Number(options.deductAmount) > 0 && (
                    <div className="flex gap-2 items-center justify-end text-gray-800">
                      <div className="text-right font-bold min-w-24">Deduct</div>
                      <div className="font-bold text-destructive-foreground">
                        -{formatNumbers(Number(options.deductAmount))}
                      </div>
                    </div>
                  )}
                  {/* Adjusted Total Due */}
                  <div className="flex gap-2 items-center justify-end text-gray-800">
                    <div className="text-right font-bold min-w-24">Total</div>
                    <div className="font-bold">
                      {formatCurrency(
                        (cases?.reduce((total, caseItem) => total + caseItem.due, 0) || 0) - Number(options.deductAmount || 0),
                        teamPrefs?.currency
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  },
);

PrintableTable.displayName = "PrintableTable";

interface PrintComponentOptions {
  selectedCases: Case[];
  options: {
    [key: string]: boolean;
  }
}

const defaultOptions = {
  showClient: true,
}

// PrintComponent that handles the printing logic
const PrintComponent = ({selectedCases, options = defaultOptions}: PrintComponentOptions) => {
  const componentRef = useRef<HTMLDivElement>(null);
  const [showComponent, setShowComponent] = useState(false);
  const { isModalOpen, closeModal, openModal } = useModalStore();
  const {currentAppwriteTeam, currentTeam} = useTeamStore();
  const {getDoctorById} = useDoctorsStore();
  const {getMaterialById} = useMaterialsStore();

  React.useEffect(() => {
    if (isModalOpen('print')) {
      handlePrint()
    }
  }, [isModalOpen('print')])

  // Create an intermediary function to handle the button click event
  const handlePrint = useReactToPrint({
    onBeforeGetContent: () =>
      new Promise<void>((resolve) => {
        setShowComponent(true);
        setTimeout(resolve, 0);
      }),
    contentRef: componentRef,
    documentTitle: "DentaAuto",
    onCancel: () => {
      setShowComponent(false);
      closeModal('print')
    },
    onAfterPrint: () => {
      setShowComponent(false);
      closeModal('print')
      if (isModalOpen('cases-export') && currentTeam?.planId !== "free") openModal('save-case-export-prompt')
    },
  } as any); // Using `as any` to suppress type error

  // Event handler to wrap handlePrint call
  // const handlePrintClick = () => {
  //   handlePrint(); // Call the print function returned from useReactToPrint
  // };

  return (
    <div>
      {isModalOpen('print') && (
        <div style={{ display: "none" }}>
          <PrintableTable
            ref={componentRef}
            teamPrefs={currentAppwriteTeam?.prefs}
            cases={selectedCases}
            getDoctorById={getDoctorById}
            getMaterialById={getMaterialById}
            // doctors={doctors || []}
            // materials={materials || []}
            options={options}
          />
        </div>
      )}
    </div>
  );
};

export default PrintComponent;
