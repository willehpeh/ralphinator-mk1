/**
 * Utility functions for extracting values from HTML form events with proper type casting.
 * Eliminates repetitive event handling code across components.
 */

/**
 * Extracts the selected value from a select element change event
 * @param event - The DOM event from a select element
 * @returns The selected value as a string
 */
export function extractSelectValue(event: Event): string {
  return (event.target as HTMLSelectElement).value;
}

/**
 * Extracts the input value from an input element change event
 * @param event - The DOM event from an input element
 * @returns The input value as a string
 */
export function extractInputValue(event: Event): string {
  return (event.target as HTMLInputElement).value;
}

/**
 * Extracts the checked state from a checkbox input element change event
 * @param event - The DOM event from a checkbox input element
 * @returns The checked state as a boolean
 */
export function extractCheckboxValue(event: Event): boolean {
  return (event.target as HTMLInputElement).checked;
}
