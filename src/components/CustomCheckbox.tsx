interface CustomCheckBoxProps {
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  reverse?: boolean; // New prop to control the direction of the checkbox and label
}

const CustomCheckbox = ({
  checked,
  onChange,
  label,
  reverse,
}: CustomCheckBoxProps) => {
  // Prevent text selection when Shift key is pressed during a checkbox click
  const handleMouseDown = (e: any) => {
    if (e.shiftKey) {
      e.preventDefault(); // Prevent text selection
    }
    onChange(e);
  };

  return (
    <label
      className={`flex text-dark-text-secondary ${reverse ? "flex-row-reverse" : ""
        } gap-1 items-center cursor-pointer`}
      onMouseDown={handleMouseDown} // Add this to handle Shift-click behavior
    >
      <input
        type="checkbox"
        id={label}
        name={label}
        readOnly
        checked={checked} // Use the checked prop directly
        className="hidden peer"
      />

      {/* SVG Tooth-like shape */}
      <svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        width="100.000000pt"
        height="125.000000pt"
        viewBox="0 0 100.000000 125.000000"
        preserveAspectRatio="xMidYMid meet"
        className="w-7 h-7 text-gray-400 peer-checked:text-blue-500 transition-colors duration-300"
      >
        <g transform="translate(0.000000,125.000000) scale(0.120000,-0.100000)">
          <path
            className={`${checked ? "fill-blue-500" : "dark:fill-foreground"}`}
            d="M496 1235 c-21 -7 -53 -27 -70 -44 -30 -29 -35 -30 -65 -20 -17 6
            -60 9 -95 7 -78 -5 -134 -39 -174 -107 -22 -38 -27 -60 -30 -139 -3 -55 1
            -119 8 -151 14 -62 61 -174 78 -185 7 -4 11 -45 11 -104 -1 -115 13 -201 47
            -290 31 -82 80 -168 100 -176 27 -10 71 -7 81 6 6 7 13 56 17 108 9 135 59
            306 93 317 32 11 86 -164 98 -317 4 -52 11 -101 17 -107 6 -7 25 -13 43 -13
            44 0 84 48 124 149 45 112 61 193 61 312 0 79 4 110 14 118 17 15 55 100 72
            166 8 28 14 91 14 141 0 81 -3 98 -28 145 -33 63 -96 107 -163 116 -28 4 -56
            16 -76 34 -30 26 -89 49 -123 49 -8 -1 -32 -7 -54 -15z m134 -33 c37 -21 51
            -42 26 -42 -9 0 -16 -5 -16 -11 0 -8 14 -10 44 -6 86 12 168 -30 208 -106 18
            -34 22 -59 23 -132 0 -49 -6 -112 -14 -140 -19 -67 -69 -162 -98 -185 -28 -22
            -29 -30 -3 -30 18 0 20 -7 20 -67 0 -154 -85 -407 -145 -435 -44 -20 -55 -6
            -55 72 0 86 -23 202 -57 287 -37 93 -76 105 -112 34 -37 -72 -62 -176 -68
            -279 -7 -113 -16 -133 -58 -114 -28 13 -95 146 -120 237 -8 33 -18 106 -22
            162 -6 101 -6 103 15 103 25 0 29 15 7 24 -23 9 -72 92 -97 165 -26 78 -31
            223 -10 284 39 110 166 168 261 119 46 -23 50 -41 12 -48 -17 -4 -31 -13 -31
            -20 0 -19 20 -17 75 7 62 27 122 20 169 -22 19 -16 36 -29 40 -29 12 0 6 24
            -11 42 -15 17 -14 18 36 18 29 0 61 -5 72 -11 22 -12 62 -3 57 13 -6 16 -91
            25 -198 19 -55 -2 -150 11 -159 23 -8 9 -5 19 12 34 57 54 135 67 197 34z"
          />
        </g>
      </svg>

      {label && <span>{label}</span>}
    </label>
  );
};

export default CustomCheckbox;
