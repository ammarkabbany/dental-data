import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Check, Edit, Pencil, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUpdateMaterial } from '@/features/materials/hooks/use-update-material';
import { PermissionCheckType } from '@/hooks/use-permissions';
import { formatCurrency } from '@/lib/format-utils';
import useTeamStore from '@/store/team-store';

interface EditableMaterialPriceCellProps {
  initialValue: number;
  materialId: string;
  permissions: PermissionCheckType;
}

export const EditableMaterialPriceCell: React.FC<EditableMaterialPriceCellProps> = ({
  initialValue,
  materialId,
  permissions,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue.toString());
  const {currentAppwriteTeam} = useTeamStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate: updateMaterial, isPending } = useUpdateMaterial();

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    const parsedValue = parseFloat(value);
    if (!isNaN(parsedValue) && parsedValue >= 0) {
      updateMaterial(
        {
          id: materialId,
          data: { price: parsedValue },
        },
        {
          onSuccess: () => {
            setIsEditing(false);
          },
          onError: (error) => {
            console.error('Failed to update material price:', error);
            // Optionally, revert value or show error message
          },
        }
      );
    } else {
      // Handle invalid input, e.g., show an error message
      console.error('Invalid price input');
    }
  };

  const handleCancel = () => {
    setValue(initialValue.toString());
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center space-x-2">
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleCancel} // Cancel on blur if not saved
          onKeyDown={handleKeyDown}
          className="w-24"
          type="number"
          step="0.01"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSave}
          disabled={isPending}
        >
          <Check className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCancel}
          disabled={isPending}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 group">
      {permissions.checkPermission("materials", "update") ? (
        <>
        <div onDoubleClick={handleDoubleClick}>{formatCurrency(Number(value), currentAppwriteTeam?.prefs.currency)}</div>
        <Button
          size="icon"
          variant="ghost"
          onClick={handleDoubleClick}
          className="h-7 w-7 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
        >
          <Edit className="h-4 w-4" />
        </Button>
        </>
      ) : (
        <div>
          {formatCurrency(Number(value), currentAppwriteTeam?.prefs.currency)}
        </div>
      )}
    </div>
  );
};