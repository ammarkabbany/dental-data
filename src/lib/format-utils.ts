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
  decimals: number = 2
) => {
  const formattedValue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    minimumFractionDigits: decimals,
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

export const getYearlyPrice = (monthlyPrice: number, discount = 0.20) => {
  const fullYear = monthlyPrice * 12;
  return Math.round((fullYear * (1 - discount)))
};

export function formatDuration(durationInSeconds: number) {
  if (typeof durationInSeconds !== 'number' || isNaN(durationInSeconds)) {
    return 'N/A'; // Or throw an error, depending on your error handling
  }

  // Convert to milliseconds first for precision
  const durationInMs = durationInSeconds * 1000;

  if (durationInMs < 1000) {
    // Less than 1 second, display in milliseconds
    return `${Math.round(durationInMs)}ms`;
  } else if (durationInMs < 60 * 1000) {
    // Less than 1 minute, display in seconds
    // Round to one decimal place if needed, or just to nearest second
    return `${(durationInMs / 1000).toFixed(1)}s`;
  } else if (durationInMs < 60 * 60 * 1000) {
    // Less than 1 hour, display in minutes and seconds
    const minutes = Math.floor(durationInMs / (60 * 1000));
    const remainingSeconds = Math.round((durationInMs % (60 * 1000)) / 1000);
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    // 1 hour or more, display in hours, minutes, and seconds
    const hours = Math.floor(durationInMs / (60 * 60 * 1000));
    const minutes = Math.floor(
      (durationInMs % (60 * 60 * 1000)) / (60 * 1000)
    );
    const remainingSeconds = Math.round((durationInMs % (60 * 1000)) / 1000);
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  }
}