/**
 * Date formatting utility functions
 * Provides consistent date formatting across the application
 */

/**
 * Format Date object or ISO string to YYYY-MM-DD string for input[type="date"]
 *
 * @param date - Date object or ISO date string
 * @returns Formatted date string in YYYY-MM-DD format
 *
 * @example
 * formatDateForInput(new Date('2024-03-15')) // Returns '2024-03-15'
 * formatDateForInput('2024-03-15T10:30:00Z') // Returns '2024-03-15'
 */
export function formatDateForInput(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
