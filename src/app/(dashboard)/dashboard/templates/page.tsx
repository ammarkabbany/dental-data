"use client";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import Link from "next/link";
import { TemplateCard } from "@/components/templates/template-card";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/search-input";
import { useGetTemplates } from "@/features/templates/hooks/use-get-templates";
import { usePermission } from "@/hooks/use-permissions";

import { PlusIcon, FileTextIcon } from "@radix-ui/react-icons";
import { motion, AnimatePresence } from "framer-motion";
import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import useTeamStore from "@/store/team-store";

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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

export default function TemplatesPage() {
  const { data: templates, isLoading } = useGetTemplates();
  const { userRole } = useTeamStore();
  const canCreate = usePermission(userRole).checkPermission(
    "templates",
    "create"
  );
  const [searchTerm, setSearchTerm] = React.useState("");


  const filteredTemplates = templates?.filter((t) =>
    searchTerm ? t.name.toLowerCase().includes(searchTerm.toLowerCase()) : true
  );

  const showEmptyState = !isLoading && (!templates || templates.length === 0);
  const showNoResults =
    !isLoading &&
    filteredTemplates &&
    filteredTemplates.length === 0 &&
    searchTerm;

  return (
      <ContentLayout title="Templates">
        <motion.div
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Case Templates</h2>
            <p className="text-sm text-muted-foreground">
              Templates are pre-defined case structures that can be used to
              create new cases.
            </p>
          </div>
        </motion.div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            onClear={() => setSearchTerm("")}
            placeholder="Search templates..."
          />
          {canCreate && (
            <motion.div
              className="ml-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                asChild
                variant="default"
                 className="py-2"
              >
                
                 <Link href="/dashboard/templates/create">
                <PlusIcon className="mr-2" />
                Add Template
                </Link>
              </Button>
            </motion.div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div key={i} variants={itemVariants}>
                  <Skeleton className="h-[200px] w-full rounded-xl" />
                </motion.div>
              ))}
            </motion.div>
          ) : showEmptyState ? (
            <motion.div
              key="empty"
              className="text-center py-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="mx-auto w-fit p-4 rounded-full bg-muted mb-4">
                <FileTextIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Templates Yet</h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Create your first template to streamline your workflow and
                standardize your case management.
              </p>
              {canCreate && (
                <Button asChild variant="default">
                   <Link href="/dashboard/templates/create">
                     <PlusIcon className="mr-2" />
                     Create Your First Template
                   </Link>
                 </Button>
              )}
            </motion.div>
          ) : showNoResults ? (
            <motion.div
              key="no-results"
              className="text-center py-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h3 className="text-lg font-semibold mb-2">
                No Matching Templates
              </h3>
              <p className="text-muted-foreground">
                No templates found for &quot;{searchTerm}&quot;. Try a different
                search term.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="templates"
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {filteredTemplates?.map((template) => (
                <motion.div key={template.$id} variants={itemVariants}>
                  <TemplateCard template={template} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </ContentLayout>

  );
}
