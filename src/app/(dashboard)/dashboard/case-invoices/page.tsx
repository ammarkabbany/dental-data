"use client"
import { ContentLayout } from "@/components/admin-panel/content-layout";
// import { CreateCaseInvoiceModal } from "@/components/case-invoices/create-case-invoice-modal"; // To be created later
import { CaseInvoicesDataTable } from "@/components/case-invoices/data-table";
import { motion, AnimatePresence } from "framer-motion";
import * as React from 'react'

export default function CaseInvoicesPage() {

  return (
    <>
      {/* <CreateCaseInvoiceModal /> */}
      <ContentLayout title="Case Invoices">
        <motion.div
          className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-y-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Case Invoice Management</h2>
            <p className="text-sm text-muted-foreground">
              View and manage your dental lab&apos;s case invoices
            </p>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
            <motion.div
              key="table"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CaseInvoicesDataTable />
            </motion.div>
        </AnimatePresence>
      </ContentLayout>
    </>
  );
}