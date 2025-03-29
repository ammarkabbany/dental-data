"use client"
import { CloudDownloadIcon, Pdf01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'
import autoTable from "jspdf-autotable";
import { useGetBillingPlan } from "@/features/team/hooks/use-get-billing-plan";

export default function PlanBillingPage() {
  const {data: plan, isLoading} = useGetBillingPlan();

  if (isLoading) {
    return <div>Loading...</div>
  }


  const plans = [
    {
      name: 'Free',
      desc: '500 cases, 1 team member.',
      price: 0,
      isCurrent: plan?.$id === "free",
      // upgradeOrDowngrade: plan?.price === 0
    },
    {
      name: 'Starter',
      desc: '5000 cases, Up to 5 team members.',
      price: 15,
      isCurrent: plan?.$id === "starter",
      // upgradeOrDowngrade: plan?.price < 15
    },
    {
      name: 'Pro',
      desc: '25K cases, Up to 15 team members.',
      price: 30,
      isCurrent: plan?.$id === "pro",
      // upgradeOrDowngrade: plan.price < 30
    },
    // {
    //   name: 'Business',
    //   desc: '100K cases.',
    //   price: 50,
    //   isCurrent: plan?.$id === "business",
    //   upgradeOrDowngrade: plan.price < 50
    // }
  ]

  interface Invoice {
    invoiceNumber: string;
    date: string;
    clientName: string;
    clientAddress?: string;
    clientEmail: string;
    items: InvoiceItem[];
    subtotal: number;
    taxRate?: number;
    total: number;
  }

  interface InvoiceItem {
    name: string;
    price: number;
  }

  const downloadInvoice = (invoiceData: Invoice) => {
    const doc = new jsPDF();

    // Company Info
    doc.setFontSize(16);
    // Add image (make sure the path is correct)
    const image = new Image();
    image.src = "/bbbb.jpg"; // Replace with your image path
    doc.addImage(image, "JPEG", 14, 14, 20, 20); // Adjust position and size as needed

    // Move text down to avoid overlapping the image
    doc.text("Dental Data", 40, 20); // Move right to prevent overlap
    doc.setFontSize(10);
    doc.text("6th Of October, Giza, Egypt", 40, 30);
    doc.text("Email: ammarss750@gmail.com | Phone: +20 114 298 2292", 40, 36);

    // Invoice Title
    doc.setFontSize(18);
    doc.text("INVOICE", 150, 20);
    doc.setFontSize(10);
    doc.text(`Invoice #: ${invoiceData.invoiceNumber}`, 150, 30);
    doc.text(`Date: ${invoiceData.date}`, 150, 36);

    // Client Information
    doc.setFontSize(12);
    doc.text("Bill To:", 14, 50);
    doc.setFontSize(10);
    doc.text(invoiceData.clientName, 14, 56);
    // doc.text(invoiceData.clientAddress, 14, 62);
    doc.text(`Email: ${invoiceData.clientEmail}`, 14, 62);

    // Table Header
    const tableColumn = ["Item", "Price"];
    const tableRows: any[] = [];

    invoiceData.items.forEach((item) => {
      const row = [
        item.name,
        `$${item.price.toFixed(2)}`,
      ];
      tableRows.push(row);
    });

    // Add Table
    autoTable(doc, {
      startY: 80,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
    });

    // Calculate totals
    const totalAmount = invoiceData.items.reduce(
      (sum, item) => sum + item.price,
      0
    );
    // const tax = totalAmount * 0.1; // 10% tax
    const grandTotal = totalAmount;

    const finalY = (doc as any).lastAutoTable.finalY; // ✅ FIXED

    // Totals Section
    // doc.setFontSize(12);
    // doc.text("Subtotal:", 140, finalY + 10);
    // doc.text(`$${totalAmount.toFixed(2)}`, 180, finalY + 10);

    // doc.text("Tax (10%):", 140, finalY + 20);
    // doc.text(`$${tax.toFixed(2)}`, 180, finalY + 20);

    doc.setFontSize(14);
    doc.text("Total:", 140, finalY + 30);
    doc.text(`$${grandTotal.toFixed(2)}`, 180, finalY + 30);

    doc.setFontSize(10);
    doc.text("Thank you for your business!", 14, finalY + 50);

    doc.setProperties({ title: `Invoice-${invoiceData.invoiceNumber}` });
    doc.output("dataurlnewwindow", { filename: `Invoice-${invoiceData.invoiceNumber}.pdf` })
  };

  // Example Data
  const invoiceData: Invoice = {
    invoiceNumber: "INV-2025001",
    date: "2025-02-17",
    clientName: "John Doe",
    clientEmail: "john@gmail.com",
    items: [
      { name: "Starter Plan", price: 15 },
    ],
    subtotal: 720,
    total: 786,
  };

  return (
    <div className="space-y-8 py-4">
      <div className="grid sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* {plans.map((plan, index) => (
          <PlanCard key={index} {...plan} />
        ))} */}
        <PlanCard name={plan?.$id || ""} desc={plan?.description || ""} price={Math.round(plan?.price || 0)} isCurrent upgradeOrDowngrade />
      </div>
      <div className="space-y-4">
        <h3 className="font-bold text-xl">Billing history</h3>
        <Table>
          <TableBody>
            <TableRow className="!border-t border-border">
              <TableCell className="xl:w-2/4">
                <p className="sm:text-lg font-medium text-foreground flex items-center gap-2"><HugeiconsIcon icon={Pdf01Icon} className="text-red-500 sm:size-8" />Invoice Example</p>
              </TableCell>
              <TableCell>
                <p className="text-base">Feb 2025</p>
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <p className="text-base">
                  Starter Plan
                </p>
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <p className="text-base">USD $15.00</p>
              </TableCell>
              <TableCell>
                <Button onClick={() => downloadInvoice(invoiceData)} variant={"ghost"} size={"icon"}>
                  <HugeiconsIcon icon={CloudDownloadIcon} />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}


interface PlanCardProps {
  name: string;
  desc: string;
  price: number;
  isCurrent: boolean;  // is this the current active plan?
  upgradeOrDowngrade: boolean;
}

const PlanCard = ({ name, desc, price, isCurrent, upgradeOrDowngrade }: PlanCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold capitalize">{name}</CardTitle>
        <CardDescription className="">
          {desc}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="flex items-end gap-1"><span className="font-bold text-3xl text-foreground">${price}</span>per month</p>
      </CardContent>
      <CardFooter>
        <div className="flex items-center gap-2 w-full">
          {isCurrent ? (
            <p className="text-sm font-medium text-primary mt-1">Current active plan</p>
          ) : (
            <Button
              variant={"default"}
              size={"lg"}
              className={`w-full text-white`}
            >
              {upgradeOrDowngrade ? 'Upgrade' : 'Downgrade'}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
