"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Pencil, Star } from "lucide-react";
import { Template } from "@/types";
import { useMaterialsStore } from "@/store/material-store";
import { useDoctorsStore } from "@/store/doctors-store";
import { useRouter } from "next/navigation";
import { usePermission } from "@/hooks/use-permissions";
import { useTeam } from "@/providers/team-provider";
import { TemplateUpdateModal } from "./update-template-modal";
import { DialogTrigger } from "../ui/dialog";
import { DeleteTemplateModal } from "./delete-template-modal";
import { useTemplatesStore } from "@/store/templates-store";
export const TemplateCard = ({ template }: { template: Template }) => {
  const router = useRouter();
  const { getMaterialById } = useMaterialsStore();
  const { getDoctorById } = useDoctorsStore();
  const {toggleFavorite, favoriteTemplates} = useTemplatesStore();
  const {userRole} = useTeam();

  const applyTemplate = (template: Template) => {
    let uriString = `/dashboard/cases/new?templateId=${template.$id}`;
    if (template.material) uriString += `&material=${template.material}`
    if (template.doctor) uriString += `&doctor=${template.doctor}`
    if (template.shade) uriString += `&shade=${template.shade}`
    if (template.note) uriString += `&note=${template.note}`
    router.push(uriString);
  }

  return (
    <Card
      key={template.$id}
      className="relative transition-shadow hover:shadow-lg from-sidebar/60 to-sidebar bg-gradient-to-br"
    >
      {/* Favorite Button (Star) */}
      <button
        onClick={() => toggleFavorite(template)}
        // disabled={favoriteLoading}
        className="absolute right-5 top-7 text-gray-400 hover:text-yellow-500"
      >
        {favoriteTemplates.includes(template.$id) ? (
        <Star className="h-5 w-5 fill-yellow-500 stroke-yellow-500" />
        ) : (
        <Star className="h-5 w-5 stroke-gray-400 hover:stroke-yellow-500 transition-all duration-150" />
        )}
      </button>

      <CardHeader>
        <CardTitle className="text-lg">{template.name}</CardTitle>
        <p className="text-sm text-muted-foreground">
          Doctor: {getDoctorById(template.doctor || "")?.name ?? "none"}
        </p>
        <p className="text-sm text-muted-foreground">
          Material: {getMaterialById(template.material || "")?.name ?? "none"}
        </p>
      </CardHeader>

      <CardContent>
        {/* Shade */}
        <p className="mt-1 text-sm text-muted-foreground">
          Shade: {template.shade ?? "none"}
        </p>

        {/* Date Created */}
        <p className="mt-2 text-xs text-muted-foreground">
          Created on: {new Date(template.$createdAt).toLocaleDateString()}
        </p>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button
          onClick={() => applyTemplate(template)}
          variant="secondary"
          size="sm"
          className="items-center text-xs"
        >
          <Check className="h-4 w-4" /> Apply
        </Button>
        <div className="flex gap-1">
          {usePermission(userRole).checkPermission('templates', 'update') && <TemplateUpdateModal trigger={
            <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Pencil className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          } template={template} />}
          {usePermission(userRole).checkPermission('templates', 'delete') && <DeleteTemplateModal templateId={template.$id} />}
        </div>
      </CardFooter>
    </Card>
  );
};
