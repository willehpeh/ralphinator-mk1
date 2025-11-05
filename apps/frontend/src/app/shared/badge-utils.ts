/**
 * Utility functions for generating CSS class names for badges
 * (priority and status badges used in task displays)
 */

/**
 * Maps task priority values to their corresponding CSS class names
 */
export function getPriorityBadgeClass(priority: string): string {
  const priorityClassMap: Record<string, string> = {
    'Urgent': 'priority-urgent',
    'High': 'priority-high',
    'Medium': 'priority-medium',
    'Low': 'priority-low'
  };
  return priorityClassMap[priority] || '';
}

/**
 * Maps task status values to their corresponding CSS class names
 */
export function getStatusBadgeClass(status: string): string {
  const statusClassMap: Record<string, string> = {
    'Todo': 'status-todo',
    'InProgress': 'status-in-progress',
    'Completed': 'status-completed',
    'Cancelled': 'status-cancelled'
  };
  return statusClassMap[status] || '';
}
