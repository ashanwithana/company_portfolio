import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge conditional class names, resolving conflicting Tailwind utilities so
 * the last one always wins (e.g. `p-2` followed by `p-4` yields `p-4`).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
