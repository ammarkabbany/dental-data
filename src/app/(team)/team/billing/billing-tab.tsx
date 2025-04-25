"use client";
import { Pdf01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import { useGetBillingPlan } from "@/features/team/hooks/use-get-billing-plan";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { useState } from "react";
import { CheckoutDialog } from "./checkout-dialog";
import useTeamStore from "@/store/team-store";
import { usePermission } from "@/hooks/use-permissions";

export default function PlanBillingPage() {
  const { data: plan, isLoading } = useGetBillingPlan();
  const { userRole } = useTeamStore();
  const canUpdate = usePermission(userRole).checkPermission("team", "update");

  const plans = [
    {
      name: "Free",
      desc: "100 cases, 1 team member.",
      price: 0,
      features: ["100 cases", "1 team member", "Basic support"],
      isCurrent: plan?.$id === "free",
      upgradeOrDowngrade: false,
    },
    {
      name: "Starter",
      desc: "200 cases, Up to 3 team members.",
      price: 14.99,
      features: [
        "Up to 200 cases per month",
        "Up to 3 team members",
        "Priority support",
        "Advanced analytics",
      ],
      isCurrent: plan?.$id === "starter",
      upgradeOrDowngrade: plan?.$id === "free",
    },
    {
      name: "Pro",
      desc: "500 cases, Up to 5 team members.",
      price: 29.99,
      features: [
        "Up to 500 cases per month",
        "Up to 5 team members",
        "Premium support",
        "Advanced analytics",
        "Custom integrations",
      ],
      isCurrent: plan?.$id === "pro",
      upgradeOrDowngrade: plan?.$id === "free" || plan?.$id === "starter",
    },
  ];

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
    doc.text("DentaAuto", 40, 20); // Move right to prevent overlap
    doc.setFontSize(10);
    doc.text("6th Of October, Giza, Egypt", 40, 30);
    doc.text("Email: croxteamco@gmail.com | Phone: +20 114 298 2292", 40, 36);

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
    doc.text(`Email: ${invoiceData.clientEmail}`, 14, 62);

    // Table Header
    const tableColumn = ["Item", "Price"];
    const tableRows: any[] = [];

    invoiceData.items.forEach((item) => {
      const row = [item.name, `$${item.price.toFixed(2)}`];
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
    const grandTotal = totalAmount;

    const finalY = (doc as any).lastAutoTable.finalY;

    doc.setFontSize(14);
    doc.text("Total:", 140, finalY + 30);
    doc.text(`$${grandTotal.toFixed(2)}`, 180, finalY + 30);

    doc.setFontSize(10);
    doc.text("Thank you for your business!", 14, finalY + 50);

    doc.setProperties({ title: `Invoice-${invoiceData.invoiceNumber}` });
    doc.output("dataurlnewwindow", {
      filename: `Invoice-${invoiceData.invoiceNumber}.pdf`,
    });
  };

  // Example Data
  const invoiceData: Invoice = {
    invoiceNumber: "INV-2025001",
    date: "2025-02-17",
    clientName: "John Doe",
    clientEmail: "john@gmail.com",
    items: [{ name: "Starter Plan", price: 15 }],
    subtotal: 15,
    total: 15,
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10 py-4"
    >
      <motion.div variants={itemVariants}>
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Current Plan</h3>
          <p className="text-sm text-muted-foreground">
            You are currently on the{" "}
            <span className="font-medium text-foreground capitalize">
              {plan?.$id}
            </span>{" "}
            plan.
            {plan?.$id !== "pro" &&
              " You can upgrade your plan at any time to get more features."}
          </p>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <motion.div variants={itemVariants} className="h-full">
              <Card className="border animate-pulse">
                <CardHeader className="pb-4">
                  <div className="h-6 w-24 bg-muted rounded" />
                  <div className="h-4 w-32 bg-muted rounded mt-2" />
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="h-4 w-4 bg-muted rounded" />
                        <div className="h-4 w-32 bg-muted rounded" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            plan && plans.map((planItem, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="h-full"
              >
                <PlanCard canUpdate={canUpdate} {...planItem} />
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="space-y-4 pt-4 border-t border-border"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xl">Billing history</h3>
          {/* <Button variant="outline" size="sm" className="gap-2">
            <CreditCard className="size-4" />
            Manage payment methods
          </Button> */}
        </div>

        <Card className="border-0 shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="hidden lg:table-cell">Plan</TableHead>
                <TableHead className="hidden lg:table-cell">Amount</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* <TableRow className="hover:bg-muted/30">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <HugeiconsIcon
                      icon={Pdf01Icon}
                      className="text-red-500 size-6"
                    />
                    <span className="font-medium">Invoice Example</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground">Feb 2025</span>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Badge variant="outline" className="font-normal">
                    Starter Plan
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <span className="font-medium">USD $15.00</span>
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => downloadInvoice(invoiceData)}
                    variant="ghost"
                    size="icon"
                    className="hover:bg-primary/10 hover:text-primary"
                  >
                    <Download className="size-4" />
                  </Button>
                </TableCell>
              </TableRow> */}
            </TableBody>
          </Table>
        </Card>
      </motion.div>
    </motion.div>
  );
}

interface PlanCardProps {
  name: string;
  desc: string;
  price: number;
  features: string[];
  isCurrent: boolean;
  upgradeOrDowngrade: boolean;
  canUpdate: boolean;
}

const PlanCard = ({
  name,
  desc,
  price,
  features,
  isCurrent,
  upgradeOrDowngrade,
  canUpdate
}: PlanCardProps) => {
  const [showCheckout, setShowCheckout] = useState(false);

  return (
    <>
      <Card
        className={`border h-full flex flex-col overflow-hidden transition-all duration-200 ${
          isCurrent
            ? "border-primary shadow-md ring-1 ring-primary/20"
            : "hover:border-primary/50 hover:shadow-sm"
        }`}
      >
        {isCurrent && (
          <div className="bg-primary text-primary-foreground text-xs font-medium text-center py-1">
            Current Plan
          </div>
        )}
        <CardHeader className={isCurrent ? "pb-4" : "pb-4"}>
          <CardTitle className="text-xl font-bold capitalize flex items-center justify-between">
            {name}
            {price === 0 ? (
              <Badge variant="secondary" className="ml-2">
                Free
              </Badge>
            ) : (
              <span className="text-sm font-normal text-muted-foreground">
                ${price}/month
              </span>
            )}
          </CardTitle>
          <CardDescription className="mt-1">{desc}</CardDescription>
        </CardHeader>
        <CardContent className="pb-4 flex-grow">
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <Check className="size-4 text-primary mt-0.5 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="pt-2 pb-4 mt-auto">
          {!isCurrent && upgradeOrDowngrade && canUpdate && (
            <Button
              variant={upgradeOrDowngrade ? "default" : "outline"}
              size="default"
              className="w-full"
              onClick={() => setShowCheckout(true)}
            >
              {upgradeOrDowngrade ? "Upgrade" : "Downgrade"}
            </Button>
          )}
          {/* {isCurrent && (
            <Button
              variant="outline"
              size="default"
              className="w-full border-primary/30 text-primary hover:bg-primary/10"
            >
              Manage Subscription
            </Button>
          )} */}
        </CardFooter>
      </Card>

      <CheckoutDialog
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        planName={name}
        price={price}
      />
    </>
  );
};
