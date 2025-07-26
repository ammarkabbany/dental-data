import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Material } from "@/types";
import { formatCurrency } from "@/lib/format-utils";
import { PermissionCheckType } from "@/hooks/use-permissions";
import { Models } from "appwrite";
import { EditableMaterialNameCell } from "@/components/materials/EditableMaterialNameCell";

export const getColumns = (
  permissions: PermissionCheckType,
  prefs: Models.Preferences,
  editingRowId: string | null,
  setEditingRowId: (id: string | null) => void,
): ColumnDef<Material>[] => [
  {
    accessorKey: "$id",
    header: "ID",
    cell: ({ row }) => {
      const id = Number(row.original.$sequence);
      let idString = String(id);
      while (idString.length < 4) {
        idString = "0" + idString;
      }
      return <div className="capitalize">MAT-{idString}</div>;
    },
    size: 100,
  },
  {
    accessorKey: "material",
    header: "Material",
    // header: ({ table }) => {
    //   const currentValue = table.getColumn("doctor")?.getFilterValue() as string;
    //   return (
    //     <CustomComboBox
    //       label="doctor"
    //       variant={"outline"}
    //       initValue={currentValue}
    //       id="cases-table-doctors-c-combobox"
    //       action={(newValue) => {
    //         if (newValue === currentValue) {
    //           table.getColumn("doctor")?.setFilterValue(null);
    //           return;
    //         }
    //         table.getColumn("doctor")?.setFilterValue(newValue);
    //       }}
    //       values={useDoctorsStore.getState().doctors}
    //     />
    //   );
    // },
    accessorFn: (row) => row.name,
    cell: ({ row }) => {
      const material = row.original;
      return (
        <EditableMaterialNameCell
          material={material}
          isEditing={editingRowId === material.$id}
          setEditingRowId={setEditingRowId}
          permissions={permissions}
        />
      );
    },
    size: 280,

    // filterFn: (row, _, filterValue) => {
    //   const {data: doctor, isLoading} = useGetDoctorById(row.original.doctorId)
    //   if (isLoading) return true;
    //   return filterValue
    //     // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    //     ? doctor?.name.toLowerCase().includes(filterValue.toLowerCase()) ? true : false
    //     : true;
    // }, // Apply the filter function here
  },
  // {
  //   accessorKey: "totalCases",
  //   header: "Cases",
  //   cell: ({ row }) => {
  //     const cases = parseInt(row.getValue("totalCases"));

  //     // Format the amount as a dollar amount
  //     const formatted = formatNumbers(cases);

  //     return (
  //       <Badge variant={"default"} className="text-center">
  //         {formatted}
  //       </Badge>
  //     );
  //   },
  //   size: 50,
  // },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = parseInt(row.getValue("price"));

      // Format the amount as a dollar amount
      const formatted = formatCurrency(price, prefs.currency, 0);

      return <div>{formatted}</div>;
    },
    size: 100,
  },
  // {
  //   accessorKey: "actions",
  //   header: () => <div className="text-center">Actions</div>,
  //   cell: ({ row }) => {
  //     return (
  //       <TooltipProvider disableHoverableContent>
  //         <div className="flex items-center gap-2 justify-center">
  //           {permissions.checkPermission("financials", "has") && (
  //             <>
  //               <Tooltip delayDuration={100}>
  //                 <PaymentDialog doctor={row.original}>
  //                   <TooltipTrigger asChild>
  //                     <Button
  //                       size={"icon"}
  //                       className="rounded-full"
  //                       variant={"secondary"}
  //                     >
  //                       <CreditCard className="h-4 w-4" />
  //                     </Button>
  //                   </TooltipTrigger>
  //                 </PaymentDialog>
  //                 <TooltipContent side="top">Add Payment</TooltipContent>
  //               </Tooltip>
  //               {/* <Tooltip delayDuration={100}>
  //                 <TooltipTrigger asChild>
  //                   <Button
  //                     size={"icon"}
  //                     className="rounded-full"
  //                     variant={"secondary"}
  //                   >
  //                     <EyeIcon />
  //                   </Button>
  //                 </TooltipTrigger>
  //                 <TooltipContent side="top">View Doctor</TooltipContent>
  //               </Tooltip> */}
  //             </>
  //           )}
  //           {/* <Tooltip delayDuration={100}>
  //             <TooltipTrigger asChild>
  //               <Button
  //                 size={"icon"}
  //                 className="rounded-full"
  //                 variant={"secondary"}
  //               >
  //                 <Edit />
  //               </Button>
  //             </TooltipTrigger>
  //             <TooltipContent side="top">Edit Doctor</TooltipContent>
  //           </Tooltip> */}
  //         </div>
  //       </TooltipProvider>
  //     );
  //   },
  //   size: 50,
  //   enableSorting: false,
  //   enableHiding: false,
  // },
];
