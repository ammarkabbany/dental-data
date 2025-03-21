import { ZodIssue } from "zod";

export const formatNumbers = (value: number) => {
  return new Intl.NumberFormat("en-US").format(value);
};

export const formatDates = (value: string | Date) => {
  return new Intl.DateTimeFormat("en-GB").format(new Date(value));
};

export const formatCurrency = (
  value: string | number,
  currency: string | undefined,
) => {
  const formattedValue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(Number(value));
  return formattedValue || 0;
};

export const formatZodIssue = (issue: ZodIssue): string => {
  const { path, message } = issue
  const pathString = path.join('.')

  return `${pathString}: ${message}`
}

export const shortenString = (name?: string, length: number = 15) => {
  if (!name) return 'Undefined String'
  return name.length > length ? name.substring(0, length) + "..." : name
}