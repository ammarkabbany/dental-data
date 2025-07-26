import * as React from "react";
import { Material } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save, X, Loader2, Edit } from "lucide-react";
import { useUpdateMaterial } from "@/features/materials/hooks/use-update-material";
import { toastAPI } from "@/lib/ToastAPI";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { shortenString } from "@/lib/format-utils";
import { PermissionCheckType } from "@/hooks/use-permissions";

interface EditableMaterialNameCellProps {
  material: Material;
  permissions: PermissionCheckType;
}

export const EditableMaterialNameCell: React.FC<EditableMaterialNameCellProps> = ({
  material,
  permissions,
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [name, setName] = React.useState(material.name);
  const { mutate: updateMaterial, isPending: isUpdating } = useUpdateMaterial();

  React.useEffect(() => {
    if (!isEditing) {
      setName(material.name);
    }
  }, [isEditing, material.name]);

  const handleSave = () => {
    if (name === material.name) {
      setIsEditing(false);
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
    updateMaterial(
      { id: material.$id, data: { name: name.trim() } },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
        onError: (error) => {
          toastAPI.error(error.message || "Failed to update material");
        },
      }
    );
  };

  const handleCancel = () => {
    setName(material.name);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
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
          disabled={isUpdating || name === material.name || name.trim().length === 0}
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
  const createdAt = new Date(material.$createdAt);
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
  const isRecent = createdAt >= fiveMinutesAgo;
  const materialNameDisplay: string = shortenString(material.name, 20);

  return (
    <div className="capitalize flex items-center gap-2 text-ellipsis truncate group">
      <span title={material.name}>{materialNameDisplay}</span>
      {isRecent && (
        <Badge className="ml-1" variant="info">
          New
        </Badge>
      )}
      {permissions.checkPermission("materials", "update") && (
        <Button
          size="icon"
          variant="ghost"
          onClick={handleEdit}
          className="h-7 w-7 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};