import { TaskStatus } from '@angular-nest-starter/shared-types';

/**
 * Shared task display utility functions for formatting task properties.
 * Centralized to ensure consistency across components.
 */

/**
 * Formats a task status for display by converting camelCase to space-separated words.
 * @param status The task status to format
 * @returns Formatted status string (e.g., "In Progress" from "InProgress")
 * @example
 * formatTaskStatus('Todo') // Returns: 'Todo'
 * formatTaskStatus('InProgress') // Returns: 'In Progress'
 * formatTaskStatus('Completed') // Returns: 'Completed'
 */
export function formatTaskStatus(status: string): string {
  // Convert camelCase to space-separated words (e.g., "InProgress" -> "In Progress")
  return status.replace(/([A-Z])/g, ' $1').trim();
}

/**
 * Checks if a task with a given due date and status is overdue.
 * A task is considered overdue if:
 * - It has a due date that is in the past (before today)
 * - AND it's not already completed or cancelled
 *
 * @param dueDate The due date to check
 * @param status Optional task status. If 'Completed' or 'Cancelled', returns false
 * @returns True if the task is overdue (past due date and not completed/cancelled)
 * @example
 * isTaskOverdue(new Date('2025-01-01')) // Returns: true if today is after 2025-01-01
 * isTaskOverdue(new Date('2025-01-01'), 'Completed') // Returns: false (completed tasks are never overdue)
 * isTaskOverdue(null) // Returns: false (no due date means not overdue)
 */
export function isTaskOverdue(dueDate: Date | null, status?: TaskStatus | string): boolean {
  if (!dueDate) return false;

  // Completed or cancelled tasks are never considered overdue
  if (status === 'Completed' || status === 'Cancelled') return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  return due < today;
}
