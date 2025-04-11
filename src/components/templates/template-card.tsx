"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Pencil, Star, User2, Palette, Calendar } from "lucide-react";
import { Template } from "@/types";
import { useRouter } from "next/navigation";
import { usePermission } from "@/hooks/use-permissions";
import { TemplateUpdateModal } from "./update-template-modal";
import { DialogTrigger } from "../ui/dialog";
import { DeleteTemplateModal } from "./delete-template-modal";
import { useTemplatesStore } from "@/store/templates-store";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { formatDates } from "@/lib/format-utils";
import useTeamStore from "@/store/team-store";
import { useDoctorsStore } from "@/store/doctors-store";
import { useMaterialsStore } from "@/store/material-store";

export const TemplateCard = ({ template }: { template: Template }) => {
  const router = useRouter();
  const {getDoctorById, doctors} = useDoctorsStore();
  const {getMaterialById, materials} = useMaterialsStore();
  const {toggleFavorite, favoriteTemplates} = useTemplatesStore();
  const {userRole} = useTeamStore();

  const applyTemplate = (template: Template) => {
    let uriString = `/dashboard/cases/new?templateId=${template.$id}`;
    if (template.material) uriString += `&material=${template.material}`
    if (template.doctor) uriString += `&doctor=${template.doctor}`
    if (template.shade) uriString += `&shade=${template.shade}`
    if (template.note) uriString += `&note=${template.note}`
    router.push(uriString);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn(
        "relative overflow-hidden group border-border/50",
        "bg-gradient-to-br from-sidebar/60 to-sidebar hover:shadow-xl transition-all duration-300",
        favoriteTemplates.includes(template.$id) && "ring-1 ring-yellow-500/50"
      )}>
        {/* Favorite Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => toggleFavorite(template)}
          className="absolute right-4 top-4 z-10"
        >
          <Star 
            className={cn(
              "h-5 w-5 transition-all duration-300",
              favoriteTemplates.includes(template.$id)
                ? "fill-yellow-500 stroke-yellow-500"
                : "stroke-gray-400 hover:stroke-yellow-500"
            )}
          />
        </motion.button>

        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold tracking-tight">
            {template.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 flex flex-col h-[100px]">
          <div className="space-y-2 flex-grow">
            {/* Doctor Info */}
            <div className="flex items-center gap-2 text-sm">
              <User2 className="h-4 w-4 text-blue-400" />
              <span className="text-muted-foreground">
                {getDoctorById(template.doctor || "")?.name ?? "No doctor assigned"}
              </span>
            </div>

            {/* Material Info */}
            <div className="flex items-center gap-2 text-sm">
              <div className="h-4 w-4 rounded bg-primary/20 flex items-center justify-center">
                <span className="text-[10px] text-primary">M</span>
              </div>
              <span className="text-muted-foreground">
                {getMaterialById(template.material || "")?.name ?? "No material specified"}
              </span>
            </div>

            {/* Shade Info */}
            {template.shade && (
              <div className="flex items-center gap-2 text-sm">
                <Palette className="h-4 w-4 text-purple-400" />
                <span className="text-muted-foreground">{template.shade}</span>
              </div>
            )}
          </div>

          {/* Date Badge */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {formatDates(template.$createdAt)}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between pt-4 border-t border-border/50">
          <Button
            onClick={() => applyTemplate(template)}
            variant="default"
            size="sm"
            className="relative overflow-hidden group"
          >
            <motion.div
              className="flex items-center gap-2"
            >
              <Check className="h-4 w-4" />
              <span>Apply</span>
            </motion.div>
          </Button>

          <div className="flex">
            {usePermission(userRole).checkPermission('templates', 'update') && (
              <TemplateUpdateModal
                trigger={
                  <DialogTrigger asChild>
                    <Button 
                      variant="secondary" 
                      size="icon"
                      className="mx-2"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                }
                template={template}
              />
            )}
            {usePermission(userRole).checkPermission('templates', 'delete') && (
              <DeleteTemplateModal templateId={template.$id} />
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
