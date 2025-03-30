import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CustomCheckBoxProps {
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  reverse?: boolean;
}

const CustomCheckbox = ({
  checked,
  onChange,
  label,
  reverse,
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
        <svg
          version="1.0"
          xmlns="http://www.w3.org/2000/svg"
          width="100.000000pt"
          height="125.000000pt"
          viewBox="0 0 100.000000 125.000000"
          preserveAspectRatio="xMidYMid meet"
          className={cn(
            "w-5 h-5 sm:w-6 sm:h-6",
            "transition-all duration-100",
            checked ? 'text-primary' : 'text-muted-foreground/70'
          )}
        >
          <defs>
            <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <g transform="translate(0.000000,125.000000) scale(0.120000,-0.100000)">
            <path
              className={cn(
                "transition-all duration-300",
                checked 
                  ? "fill-primary filter drop-shadow-md" 
                  : "fill-current hover:fill-muted-foreground/50"
              )}
              d="M496 1235 c-21 -7 -53 -27 -70 -44 -30 -29 -35 -30 -65 -20 -17 6
              -60 9 -95 7 -78 -5 -134 -39 -174 -107 -22 -38 -27 -60 -30 -139 -3 -55 1
              -119 8 -151 14 -62 61 -174 78 -185 7 -4 11 -45 11 -104 -1 -115 13 -201 47
              -290 31 -82 80 -168 100 -176 27 -10 71 -7 81 6 6 7 13 56 17 108 9 135 59
              306 93 317 32 11 86 -164 98 -317 4 -52 11 -101 17 -107 6 -7 25 -13 43 -13
              44 0 84 48 124 149 45 112 61 193 61 312 0 79 4 110 14 118 17 15 55 100 72
              166 8 28 14 91 14 141 0 81 -3 98 -28 145 -33 63 -96 107 -163 116 -28 4 -56
              16 -76 34 -30 26 -89 49 -123 49 -8 -1 -32 -7 -54 -15z"
            />
          </g>
        </svg>
        
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
