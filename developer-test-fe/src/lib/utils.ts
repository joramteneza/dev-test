import { clsx, type ClassValue } from "clsx"
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const addOrdinalSuffix = (day: number) => {
  if (day > 3 && day < 21) return `${day}th`; // Covers 4th to 20th
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const mod = day % 10;
  return `${day}${suffixes[(mod < 4) ? mod : 0]}`;
};

export const formatDateWithOrdinal = (dateString: string) => {
  const date = dayjs(dateString);
  return `${addOrdinalSuffix(date.date())} ${date.format('MMMM YYYY')}`;
};

export const toNumericTimestamp = (dateString: string) => {
  return dayjs(dateString).valueOf();
};