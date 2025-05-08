import React from "react";
import { Button } from "./ui/button";
import { RefreshCw } from "lucide-react";

interface ToothSectionProps {
  id: number;
  onChange: any;
  pathData: string;
  isChecked: boolean;
  showLabels: boolean;
  side: "left" | "right";
}

const ToothSection: React.FC<ToothSectionProps> = ({
  id,
  pathData,
  onChange,
  isChecked,
}) => {
  return (
    <>
      <path
        d={pathData}
        className={`${isChecked ? "hover:fill-primary/75 fill-primary" : "hover:fill-[#acacac] fill-white"} stroke-black transition-all duration-100`}
        style={{
          fillOpacity: 1,
          strokeWidth: 3.21039,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeDasharray: "none",
          strokeOpacity: 0.5,
          paintOrder: "markers fill stroke",
          cursor: "pointer",
        }}
        // onMouseDown={(e) => onMouseDown(e, id)}
        onMouseDown={(e) => {
          e.preventDefault();
          onChange(e, id);
        }}
      />
    </>
  );
};

interface ToothCheckboxProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>, label: number) => void;
  onReset?: () => void;
  teethData?: number[];
  scale?: number;
  showLabels?: boolean;
}

const ToothCheckbox: React.FC<ToothCheckboxProps> = ({
  onChange,
  teethData = [],
  onReset,
  scale = 1,
  showLabels = false,
}) => {
  const UpperLeft = [
    {
      label: 18,
      name: "Crown",
      path: "m 128.40491,551.42846 c 0,0 -8.38659,55.40694 38.79423,58.63405 27.44646,1.87731 45.31903,-35.51379 22.83104,-59.44602 -10.1521,-10.8041 -23.33081,-7.64326 -36.55984,-8.08414 -13.22902,-0.44087 -26.21353,-0.24426 -25.06543,8.89611 z",
      textX: 160,
      textY: 580,
    },
    {
      label: 17,
      name: "Cervical",
      path: "m 128.40491,533.63624 c -3.50613,-11.95158 -9.96615,-45.09326 3.51414,-62.49867 5.87072,-7.58012 27.10989,-1.28472 41.03595,2.16581 27.45425,6.80248 24.03118,38.18335 17.07518,61.14483 -4.29834,14.18866 -23.33081,7.64326 -36.55984,8.08414 -13.22902,0.44087 -22.47221,-0.0564 -25.06543,-8.89611 z",
      textX: 160,
      textY: 510,
    },
    {
      label: 16,
      name: "Upper Root",
      path: "m 135.94653,461.4045 c -3.50613,-11.95158 -4.32328,-37.82173 9.15701,-55.22714 5.87072,-7.58012 44.92043,5.33547 55.98105,14.47353 6.53112,5.39588 2.40475,21.30419 -4.55125,44.26567 -4.29834,14.18866 -23.57834,8.38682 -37.2056,5.02511 -13.62727,-3.3617 -20.78799,0.30254 -23.38121,-8.53717 z",
      textX: 170,
      textY: 440,
    },
    {
      label: 15,
      name: "Middle Root",
      path: "m 154.9807,389.88362 c 1.58326,-17.32371 6.21615,-28.57204 23.19819,-42.58192 6.31236,-5.20759 17.28226,3.75222 28.15499,8.93137 6.9857,3.32759 17.90562,3.76111 20.31454,8.83002 8.80756,18.53305 -20.99202,58.92612 -25.56383,55.5878 -6.10644,-4.45889 -23.30681,-11.40406 -33.28947,-14.42042 -9.98265,-3.01637 -13.65286,-7.17285 -12.81442,-16.34685 z",
      textX: 190,
      textY: 380,
    },
    {
      label: 14,
      name: "Lower Root",
      path: "m 187.38014,339.16648 c -2.35214,-12.23114 0.40056,-21.65312 14.28205,-37.5409 5.17692,-5.92514 15.92475,-8.37612 26.39735,-6.13519 8.54913,1.82935 22.71503,8.82502 30.53206,17.48696 6.78721,7.52081 -14.91887,38.75422 -21.90737,44.00041 -9.85154,7.39544 -20.75969,4.17851 -30.35035,-0.74469 -9.59067,-4.92319 -17.21122,-8.00544 -18.95374,-17.06659 z",
      textX: 220,
      textY: 330,
    },
    {
      label: 13,
      name: "Apex 1",
      path: "m 225.30647,254.49283 c 3.49836,-4.55394 16.42997,-8.16314 27.16635,-5.72101 12.99446,2.95577 23.1936,19.04385 24.73434,33.50702 0.68953,6.47263 1.31724,11.11477 -3.19935,16.70504 -4.35262,5.38733 -6.89705,10.56783 -13.17361,10.19126 -6.84442,-0.41063 -17.69689,-6.94362 -29.29921,-14.7398 -11.99833,-8.06227 -18.27923,-24.25566 -6.22852,-39.94251 z",
      textX: 250,
      textY: 280,
    },
    {
      label: 12,
      name: "Apex 3",
      path: "m 307.7269,196.01899 c 5.74229,-14.04119 32.85484,-24.23732 54.42857,-17.28516 29.47127,9.49716 6.12149,73.08989 -8.39657,74.82375 -7.22663,0.86306 -18.39376,-9.89067 -28.89886,-22.37284 -10.59929,-12.59408 -20.48993,-26.95763 -17.13314,-35.16575 z",
      textX: 345,
      textY: 210,
    },
    {
      label: 11,
      name: "Apex 2",
      path: "m 250.13475,236.11195 c -1.28344,-27.84173 31.92201,-36.08065 46.81364,-34.72299 13.05552,1.19025 13.92084,23.47851 13.11587,41.14565 -0.67559,14.82764 0.70555,25.34995 -2.44119,27.29104 -4.76078,2.93673 -56.67523,-16.07524 -57.48832,-33.7137 z",
      textX: 280,
      textY: 230,
    },
  ];
  // Add textX and textY for other sections as well
  const UpperRight = [
    {
      label: 28,
      name: "Crown",
      path: "m 128.40491,551.42846 c 0,0 -8.38659,55.40694 38.79423,58.63405 27.44646,1.87731 45.31903,-35.51379 22.83104,-59.44602 -10.1521,-10.8041 -23.33081,-7.64326 -36.55984,-8.08414 -13.22902,-0.44087 -26.21353,-0.24426 -25.06543,8.89611 z",
      textX: 160,
      textY: 580,
    },
    {
      label: 27,
      name: "Cervical",
      path: "m 128.40491,533.63624 c -3.50613,-11.95158 -9.96615,-45.09326 3.51414,-62.49867 5.87072,-7.58012 27.10989,-1.28472 41.03595,2.16581 27.45425,6.80248 24.03118,38.18335 17.07518,61.14483 -4.29834,14.18866 -23.33081,7.64326 -36.55984,8.08414 -13.22902,0.44087 -22.47221,-0.0564 -25.06543,-8.89611 z",
      textX: 160,
      textY: 510,
    },
    {
      label: 26,
      name: "Upper Root",
      path: "m 135.94653,461.4045 c -3.50613,-11.95158 -4.32328,-37.82173 9.15701,-55.22714 5.87072,-7.58012 44.92043,5.33547 55.98105,14.47353 6.53112,5.39588 2.40475,21.30419 -4.55125,44.26567 -4.29834,14.18866 -23.57834,8.38682 -37.2056,5.02511 -13.62727,-3.3617 -20.78799,0.30254 -23.38121,-8.53717 z",
      textX: 170,
      textY: 440,
    },
    {
      label: 25,
      name: "Middle Root",
      path: "m 154.9807,389.88362 c 1.58326,-17.32371 6.21615,-28.57204 23.19819,-42.58192 6.31236,-5.20759 17.28226,3.75222 28.15499,8.93137 6.9857,3.32759 17.90562,3.76111 20.31454,8.83002 8.80756,18.53305 -20.99202,58.92612 -25.56383,55.5878 -6.10644,-4.45889 -23.30681,-11.40406 -33.28947,-14.42042 -9.98265,-3.01637 -13.65286,-7.17285 -12.81442,-16.34685 z",
      textX: 190,
      textY: 380,
    },
    {
      label: 24,
      name: "Lower Root",
      path: "m 187.38014,339.16648 c -2.35214,-12.23114 0.40056,-21.65312 14.28205,-37.5409 5.17692,-5.92514 15.92475,-8.37612 26.39735,-6.13519 8.54913,1.82935 22.71503,8.82502 30.53206,17.48696 6.78721,7.52081 -14.91887,38.75422 -21.90737,44.00041 -9.85154,7.39544 -20.75969,4.17851 -30.35035,-0.74469 -9.59067,-4.92319 -17.21122,-8.00544 -18.95374,-17.06659 z",
      textX: 220,
      textY: 330,
    },
    {
      label: 23,
      name: "Apex 1",
      path: "m 225.30647,254.49283 c 3.49836,-4.55394 16.42997,-8.16314 27.16635,-5.72101 12.99446,2.95577 23.1936,19.04385 24.73434,33.50702 0.68953,6.47263 1.31724,11.11477 -3.19935,16.70504 -4.35262,5.38733 -6.89705,10.56783 -13.17361,10.19126 -6.84442,-0.41063 -17.69689,-6.94362 -29.29921,-14.7398 -11.99833,-8.06227 -18.27923,-24.25566 -6.22852,-39.94251 z",
      textX: 250,
      textY: 280,
    },
    {
      label: 22,
      name: "Apex 3",
      path: "m 307.7269,196.01899 c 5.74229,-14.04119 32.85484,-24.23732 54.42857,-17.28516 29.47127,9.49716 6.12149,73.08989 -8.39657,74.82375 -7.22663,0.86306 -18.39376,-9.89067 -28.89886,-22.37284 -10.59929,-12.59408 -20.48993,-26.95763 -17.13314,-35.16575 z",
      textX: 345,
      textY: 210,
    },
    {
      label: 21,
      name: "Apex 2",
      path: "m 250.13475,236.11195 c -1.28344,-27.84173 31.92201,-36.08065 46.81364,-34.72299 13.05552,1.19025 13.92084,23.47851 13.11587,41.14565 -0.67559,14.82764 0.70555,25.34995 -2.44119,27.29104 -4.76078,2.93673 -56.67523,-16.07524 -57.48832,-33.7137 z",
      textX: 280,
      textY: 230,
    },
  ];
  const LowerLeft = [
    {
      label: 48,
      name: "Crown",
      path: "m 128.40491,551.42846 c 0,0 -8.38659,55.40694 38.79423,58.63405 27.44646,1.87731 45.31903,-35.51379 22.83104,-59.44602 -10.1521,-10.8041 -23.33081,-7.64326 -36.55984,-8.08414 -13.22902,-0.44087 -26.21353,-0.24426 -25.06543,8.89611 z",
      textX: 160,
      textY: 580,
    },
    {
      label: 47,
      name: "Cervical",
      path: "m 128.40491,533.63624 c -3.50613,-11.95158 -9.96615,-45.09326 3.51414,-62.49867 5.87072,-7.58012 27.10989,-1.28472 41.03595,2.16581 27.45425,6.80248 24.03118,38.18335 17.07518,61.14483 -4.29834,14.18866 -23.33081,7.64326 -36.55984,8.08414 -13.22902,0.44087 -22.47221,-0.0564 -25.06543,-8.89611 z",
      textX: 160,
      textY: 510,
    },
    {
      label: 46,
      name: "Upper Root",
      path: "m 135.94653,461.4045 c -3.50613,-11.95158 -4.32328,-37.82173 9.15701,-55.22714 5.87072,-7.58012 44.92043,5.33547 55.98105,14.47353 6.53112,5.39588 2.40475,21.30419 -4.55125,44.26567 -4.29834,14.18866 -23.57834,8.38682 -37.2056,5.02511 -13.62727,-3.3617 -20.78799,0.30254 -23.38121,-8.53717 z",
      textX: 170,
      textY: 440,
    },
    {
      label: 45,
      name: "Middle Root",
      path: "m 154.9807,389.88362 c 1.58326,-17.32371 6.21615,-28.57204 23.19819,-42.58192 6.31236,-5.20759 17.28226,3.75222 28.15499,8.93137 6.9857,3.32759 17.90562,3.76111 20.31454,8.83002 8.80756,18.53305 -20.99202,58.92612 -25.56383,55.5878 -6.10644,-4.45889 -23.30681,-11.40406 -33.28947,-14.42042 -9.98265,-3.01637 -13.65286,-7.17285 -12.81442,-16.34685 z",
      textX: 190,
      textY: 380,
    },
    {
      label: 44,
      name: "Lower Root",
      path: "m 187.38014,339.16648 c -2.35214,-12.23114 0.40056,-21.65312 14.28205,-37.5409 5.17692,-5.92514 15.92475,-8.37612 26.39735,-6.13519 8.54913,1.82935 22.71503,8.82502 30.53206,17.48696 6.78721,7.52081 -14.91887,38.75422 -21.90737,44.00041 -9.85154,7.39544 -20.75969,4.17851 -30.35035,-0.74469 -9.59067,-4.92319 -17.21122,-8.00544 -18.95374,-17.06659 z",
      textX: 220,
      textY: 330,
    },
    {
      label: 43,
      name: "Apex 1",
      path: "m 225.30647,254.49283 c 3.49836,-4.55394 16.42997,-8.16314 27.16635,-5.72101 12.99446,2.95577 23.1936,19.04385 24.73434,33.50702 0.68953,6.47263 1.31724,11.11477 -3.19935,16.70504 -4.35262,5.38733 -6.89705,10.56783 -13.17361,10.19126 -6.84442,-0.41063 -17.69689,-6.94362 -29.29921,-14.7398 -11.99833,-8.06227 -18.27923,-24.25566 -6.22852,-39.94251 z",
      textX: 250,
      textY: 280,
    },
    {
      label: 42,
      name: "Apex 3",
      path: "m 307.7269,196.01899 c 5.74229,-14.04119 32.85484,-24.23732 54.42857,-17.28516 29.47127,9.49716 6.12149,73.08989 -8.39657,74.82375 -7.22663,0.86306 -18.39376,-9.89067 -28.89886,-22.37284 -10.59929,-12.59408 -20.48993,-26.95763 -17.13314,-35.16575 z",
      textX: 345,
      textY: 210,
    },
    {
      label: 41,
      name: "Apex 2",
      path: "m 250.13475,236.11195 c -1.28344,-27.84173 31.92201,-36.08065 46.81364,-34.72299 13.05552,1.19025 13.92084,23.47851 13.11587,41.14565 -0.67559,14.82764 0.70555,25.34995 -2.44119,27.29104 -4.76078,2.93673 -56.67523,-16.07524 -57.48832,-33.7137 z",
      textX: 280,
      textY: 230,
    },
  ];
  const LowerRight = [
    {
      label: 38,
      name: "Crown",
      path: "m 128.40491,551.42846 c 0,0 -8.38659,55.40694 38.79423,58.63405 27.44646,1.87731 45.31903,-35.51379 22.83104,-59.44602 -10.1521,-10.8041 -23.33081,-7.64326 -36.55984,-8.08414 -13.22902,-0.44087 -26.21353,-0.24426 -25.06543,8.89611 z",
      textX: 160,
      textY: 580,
    },
    {
      label: 37,
      name: "Cervical",
      path: "m 128.40491,533.63624 c -3.50613,-11.95158 -9.96615,-45.09326 3.51414,-62.49867 5.87072,-7.58012 27.10989,-1.28472 41.03595,2.16581 27.45425,6.80248 24.03118,38.18335 17.07518,61.14483 -4.29834,14.18866 -23.33081,7.64326 -36.55984,8.08414 -13.22902,0.44087 -22.47221,-0.0564 -25.06543,-8.89611 z",
      textX: 160,
      textY: 510,
    },
    {
      label: 36,
      name: "Upper Root",
      path: "m 135.94653,461.4045 c -3.50613,-11.95158 -4.32328,-37.82173 9.15701,-55.22714 5.87072,-7.58012 44.92043,5.33547 55.98105,14.47353 6.53112,5.39588 2.40475,21.30419 -4.55125,44.26567 -4.29834,14.18866 -23.57834,8.38682 -37.2056,5.02511 -13.62727,-3.3617 -20.78799,0.30254 -23.38121,-8.53717 z",
      textX: 170,
      textY: 440,
    },
    {
      label: 35,
      name: "Middle Root",
      path: "m 154.9807,389.88362 c 1.58326,-17.32371 6.21615,-28.57204 23.19819,-42.58192 6.31236,-5.20759 17.28226,3.75222 28.15499,8.93137 6.9857,3.32759 17.90562,3.76111 20.31454,8.83002 8.80756,18.53305 -20.99202,58.92612 -25.56383,55.5878 -6.10644,-4.45889 -23.30681,-11.40406 -33.28947,-14.42042 -9.98265,-3.01637 -13.65286,-7.17285 -12.81442,-16.34685 z",
      textX: 190,
      textY: 380,
    },
    {
      label: 34,
      name: "Lower Root",
      path: "m 187.38014,339.16648 c -2.35214,-12.23114 0.40056,-21.65312 14.28205,-37.5409 5.17692,-5.92514 15.92475,-8.37612 26.39735,-6.13519 8.54913,1.82935 22.71503,8.82502 30.53206,17.48696 6.78721,7.52081 -14.91887,38.75422 -21.90737,44.00041 -9.85154,7.39544 -20.75969,4.17851 -30.35035,-0.74469 -9.59067,-4.92319 -17.21122,-8.00544 -18.95374,-17.06659 z",
      textX: 220,
      textY: 330,
    },
    {
      label: 33,
      name: "Apex 1",
      path: "m 225.30647,254.49283 c 3.49836,-4.55394 16.42997,-8.16314 27.16635,-5.72101 12.99446,2.95577 23.1936,19.04385 24.73434,33.50702 0.68953,6.47263 1.31724,11.11477 -3.19935,16.70504 -4.35262,5.38733 -6.89705,10.56783 -13.17361,10.19126 -6.84442,-0.41063 -17.69689,-6.94362 -29.29921,-14.7398 -11.99833,-8.06227 -18.27923,-24.25566 -6.22852,-39.94251 z",
      textX: 250,
      textY: 280,
    },
    {
      label: 32,
      name: "Apex 3",
      path: "m 307.7269,196.01899 c 5.74229,-14.04119 32.85484,-24.23732 54.42857,-17.28516 29.47127,9.49716 6.12149,73.08989 -8.39657,74.82375 -7.22663,0.86306 -18.39376,-9.89067 -28.89886,-22.37284 -10.59929,-12.59408 -20.48993,-26.95763 -17.13314,-35.16575 z",
      textX: 345,
      textY: 210,
    },
    {
      label: 31,
      name: "Apex 2",
      path: "m 250.13475,236.11195 c -1.28344,-27.84173 31.92201,-36.08065 46.81364,-34.72299 13.05552,1.19025 13.92084,23.47851 13.11587,41.14565 -0.67559,14.82764 0.70555,25.34995 -2.44119,27.29104 -4.76078,2.93673 -56.67523,-16.07524 -57.48832,-33.7137 z",
      textX: 280,
      textY: 230,
    },
  ];

  // Create sections
  const upperleftSections = UpperLeft.map((section) => ({
    ...section,
    label: section.label,
    name: `${section.name} (Upper Left)`,
    side: "left" as const,
  }));

  const upperrightSections = UpperRight.map((section) => ({
    ...section,
    label: section.label,
    name: `${section.name} (Upper Right)`,
    side: "right" as const,
  }));

  const lowerrightSections = LowerRight.map((section) => ({
    ...section,
    label: section.label,
    name: `${section.name} (Lower Right)`,
    side: "right" as const,
  }));

  const lowerleftSections = LowerLeft.map((section) => ({
    ...section,
    label: section.label,
    name: `${section.name} (Lower Left)`,
    side: "left" as const,
  }));

  return (
    <div className="flex flex-col items-center relative h-[540px]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 75 580 500"
        width={`${350}px`}
        height={`${300}px`}
        className="absolute"
      >
        {/* Upper left - positioned at the top */}
        <g transform="translate(-100, -100) scale(1)">
          {upperleftSections.map((section) => (
            <React.Fragment key={section.label}>
              <ToothSection
                id={section.label}
                pathData={section.path}
                isChecked={teethData.includes(section.label)}
                onChange={onChange}
                showLabels={showLabels}
                side="left"
              />
              {showLabels && (
                <text
                  x={section.textX}
                  y={section.textY}
                  fontSize="18"
                  fill="black"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  style={{ pointerEvents: "none" }}
                >
                  {section.label}
                </text>
              )}
            </React.Fragment>
          ))}
        </g>

        {/* Upper right - positioned at the top, mirrored horizontally */}
        <g transform="translate(660, -100) scale(-1, 1)">
          {upperrightSections.map((section) => (
            <React.Fragment key={section.label}>
              <ToothSection
                key={section.label}
                id={section.label}
                pathData={section.path}
                isChecked={teethData.includes(section.label)}
                onChange={onChange}
                showLabels={showLabels}
                side="right"
              />
              {showLabels && (
                <text
                  x={section.textX}
                  y={section.textY}
                  fontSize="18"
                  fill="black"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  style={{
                    pointerEvents: "none",
                    transform: "scale(-1, 1)",
                    transformOrigin: `${section.textX}px ${section.textY}px`,
                  }}
                >
                  {section.label}
                </text>
              )}
            </React.Fragment>
          ))}
        </g>
      </svg>
      {onReset && (
        <div className="flex justify-center absolute top-1/2 bottom-1/2 z-10">
          <Button
            variant="outline"
            type="reset"
            size="sm"
            onClick={onReset}
            className="text-xs px-2 py-4 h-auto hover:bg-accent/80 cursor-pointer"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Reset
          </Button>
        </div>
      )}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 150 580 500"
        width={`${350}px`}
        height={`${300}px`}
        className="mx-auto top-1/2 absolute"
      >
        {/* Lower left - positioned at the bottom, flipped vertically */}
        <g transform="translate(-100, 800) scale(1, -1)">
          {lowerleftSections.map((section) => (
            <React.Fragment key={section.label}>
              <ToothSection
                key={section.label}
                id={section.label}
                pathData={section.path}
                isChecked={teethData.includes(section.label)}
                onChange={onChange}
                showLabels={showLabels}
                side="left"
              />
              {showLabels && (
                <text
                  x={section.textX}
                  y={section.textY}
                  fontSize="18"
                  fill="black"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  style={{
                    pointerEvents: "none",
                    transform: "scale(1, -1)",
                    transformOrigin: `${section.textX}px ${section.textY}px`,
                  }}
                >
                  {section.label}
                </text>
              )}
            </React.Fragment>
          ))}
        </g>

        {/* Lower right - positioned at the bottom, flipped both horizontally and vertically */}
        <g transform="translate(660, 800) scale(-1, -1)">
          {lowerrightSections.map((section) => (
            <React.Fragment key={section.label}>
              <ToothSection
                key={section.label}
                id={section.label}
                pathData={section.path}
                isChecked={teethData.includes(section.label)}
                onChange={onChange}
                showLabels={showLabels}
                side="right"
              />
              {showLabels && (
                <text
                  x={section.textX}
                  y={section.textY}
                  fontSize="18"
                  fill="black"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  style={{
                    pointerEvents: "none",
                    transform: "scale(-1, -1)",
                    transformOrigin: `${section.textX}px ${section.textY}px`,
                  }}
                >
                  {section.label}
                </text>
              )}
            </React.Fragment>
          ))}
        </g>
      </svg>
    </div>
  );
};

export default ToothCheckbox;
