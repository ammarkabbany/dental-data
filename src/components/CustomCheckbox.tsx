import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CustomCheckBoxProps {
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  reverse?: boolean;
  icon?: React.ReactNode;
}

const CustomCheckbox = ({
  checked,
  onChange,
  label,
  reverse,
  icon = <div className="w-4 h-4 rounded-full bg-primary-foreground/80" />,
}: CustomCheckBoxProps) => {
  // Prevent text selection when Shift key is pressed during a checkbox click
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.shiftKey) {
      e.preventDefault(); // Prevent text selection
    }
    onChange(e as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <motion.label
      className={cn(
        "flex items-center gap-1.5 cursor-pointer select-none focus-visible:outline-none",
        reverse ? "flex-row-reverse" : "",
        "transition-all duration-100"
      )}
      onMouseDown={handleMouseDown}
    >
      <input
        type="checkbox"
        id={label}
        name={label}
        readOnly
        checked={checked}
        className="hidden"
      />

      <div className="relative">
        {/* Checkbox tooth icon */}
        
        {checked && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground/80" />
          </motion.div>
        )}
      </div>

      <span className={cn(
        "text-xs font-medium",
        checked ? "text-foreground" : "text-muted-foreground"
      )}>
        {label}
      </span>
    </motion.label>
  );
};

export default CustomCheckbox;
