import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as currency based on the provided currency code
 * @param amount The amount to format
 * @param currencyCode The currency code (e.g., 'USD', 'IDR')
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currencyCode: string = 'USD'): string {
  const currencyFormats: Record<string, { symbol: string, position: 'before' | 'after', decimalPlaces: number }> = {
    USD: { symbol: '$', position: 'before', decimalPlaces: 2 },
    IDR: { symbol: 'Rp', position: 'before', decimalPlaces: 0 }
  };

  const format = currencyFormats[currencyCode] || currencyFormats.USD;
  
  // Format the number with the appropriate decimal places
  const formattedNumber = amount.toFixed(format.decimalPlaces);
  
  // Add thousand separators
  const parts = formattedNumber.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const numberWithSeparators = parts.join('.');
  
  // Add the currency symbol in the correct position
  if (format.position === 'before') {
    return `${format.symbol}${numberWithSeparators}`;
  } else {
    return `${numberWithSeparators} ${format.symbol}`;
  }
}
