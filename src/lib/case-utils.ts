import { Doctor, ToothCollection } from "@/types";

export const calculateUnits = (caseData: ToothCollection | undefined) => {
  if (!caseData) return undefined;
  const { upper, lower } = caseData;
  const upperLeft = upper?.left?.length || 0;
  const upperRight = upper?.right?.length || 0;
  const lowerLeft = lower?.left?.length || 0;
  const lowerRight = lower?.right?.length || 0;

  return upperLeft + upperRight + lowerLeft + lowerRight;
}

export const calculateTotalDue = (doctors: Doctor[]) => {
  const totalDue = doctors?.reduce((acc, doctor) => {
    return acc + doctor.due;
  }, 0);
  return totalDue || 0;
}