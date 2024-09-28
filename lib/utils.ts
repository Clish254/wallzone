import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// converts a wallet address or transaction signature to format
// 5wU2...8ACK.
export function truncateString(
  str: string,
  startLength: number,
  endLength: number,
): string {
  if (str.length <= startLength + endLength) {
    // Return the original string if it's shorter than or equal to the desired length
    return str;
  }

  // Extract the start and end parts of the string
  const start = str.substring(0, startLength);
  const end = str.substring(str.length - endLength);

  // Combine start, ellipsis, and end parts
  return `${start}...${end}`;
}
