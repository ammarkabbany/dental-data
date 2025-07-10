import * as React from "react";
import { Doctor } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save, X, Loader2, Edit } from "lucide-react";
import { useUpdateDoctor } from "@/features/doctors/hooks/use-update-doctor";
import { toastAPI } from "@/lib/ToastAPI";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { shortenString } from "@/lib/format-utils";
import { PermissionCheckType } from "@/hooks/use-permissions";

interface EditableDoctorNameCellProps {
  doctor: Doctor;
  isEditing: boolean;
  setEditingRowId: (id: string | null) => void;
  permissions: PermissionCheckType;
}

export const EditableDoctorNameCell: React.FC<EditableDoctorNameCellProps> = ({
  doctor,
  isEditing,
  setEditingRowId,
  permissions,
}) => {
  const [name, setName] = React.useState(doctor.name);
  const { mutate: updateDoctor, isPending: isUpdating } = useUpdateDoctor();

  React.useEffect(() => {
    if (!isEditing) {
      setName(doctor.name);
    }
  }, [isEditing, doctor.name]);

  const handleSave = () => {
    if (name === doctor.name) {
      setEditingRowId(null);
      return;
    }
    if (name.trim().length < 4) {
      toastAPI.error("Name needs to be at least 4 characters long");
      return;
    }
    if (name.trim().length > 32) {
      toastAPI.error("Name needs to be at most 32 characters long");
      return;
    }
    updateDoctor(
      { id: doctor.$id, data: { name: name.trim() } },
      {
        onSuccess: () => {
          setEditingRowId(null);
          // toastAPI.success("Doctor updated successfully"); // Already handled by the hook
        },
        onError: (error) => {
          toastAPI.error(error.message || "Failed to update doctor");
        },
      }
    );
  };

  const handleCancel = () => {
    setName(doctor.name);
    setEditingRowId(null);
  };

  const handleEdit = () => {
    setEditingRowId(doctor.$id);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-8"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") handleCancel();
          }}
        />
        <Button
          size="icon"
          variant="ghost"
          onClick={handleSave}
          disabled={isUpdating || name === doctor.name || name.trim().length === 0}
          className="h-8 w-8"
        >
          {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={handleCancel}
          disabled={isUpdating}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  const now = new Date();
  const createdAt = new Date(doctor.$createdAt);
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
  const isRecent = createdAt >= fiveMinutesAgo;
  const doctorNameDisplay: string = shortenString(doctor.name, 20);

  return (
    <div className="capitalize flex items-center gap-2 text-ellipsis truncate group">
      <span title={doctor.name}>{doctorNameDisplay}</span>
      {isRecent && (
        <Badge className="ml-1" variant="info">
          New
        </Badge>
      )}
      {permissions.checkPermission("doctors", "update") && (
        <Button
          size="icon"
          size="icon"
          variant="ghost"
          onClick={handleEdit}
          // Always visible on small screens, hover effect on medium screens and up
          className="h-7 w-7 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
