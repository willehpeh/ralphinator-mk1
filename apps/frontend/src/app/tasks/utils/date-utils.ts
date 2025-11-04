/**
 * Shared date utility functions for task date formatting and calculations.
 * Centralized to ensure consistency across components.
 */

/**
 * Formats a date in a human-readable format.
 * @param date The date to format, or null
 * @returns Formatted date string (e.g., "Jan 15, 2025") or empty string if null
 */
export function formatDate(date: Date | null): string {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

/**
 * Checks if a given due date is overdue (past today).
 * @param dueDate The due date to check
 * @param includeCompleted If false, completed tasks are never considered overdue
 * @returns True if the date is in the past
 */
export function isOverdue(dueDate: Date | null, isCompleted = false): boolean {
  if (!dueDate) return false;
  if (isCompleted) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return due < today;
}

/**
 * Calculates the number of days a task is overdue.
 * @param dueDate The due date to check
 * @returns Number of days overdue (0 if not overdue)
 */
export function daysOverdue(dueDate: Date | null): number {
  if (!dueDate) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const diffTime = today.getTime() - due.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}

/**
 * Formats how long a task has been overdue in human-readable text.
 * @param dueDate The due date to check
 * @returns Text like "less than a day", "1 day", "5 days", or empty string
 */
export function formatOverdueText(dueDate: Date | null): string {
  if (!dueDate) return '';
  const now = new Date();
  const deadline = new Date(dueDate);
  const diffMs = now.getTime() - deadline.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return '';
  if (diffDays < 1) return 'less than a day';
  if (diffDays === 1) return '1 day';
  return `${diffDays} days`;
}

/**
 * Formats deadline text with context (overdue, due today, due in X days, etc.).
 * @param dueDate The due date to format
 * @returns Human-readable deadline text
 */
export function formatDeadlineText(dueDate: Date | null): string {
  if (!dueDate) return 'No deadline set';

  const now = new Date();
  const deadline = new Date(dueDate);
  const diffMs = deadline.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`;
  } else if (diffDays === 0) {
    return 'Due today';
  } else if (diffDays === 1) {
    return 'Due tomorrow';
  } else if (diffDays <= 7) {
    return `Due in ${diffDays} days`;
  } else {
    return deadline.toLocaleDateString();
  }
}
