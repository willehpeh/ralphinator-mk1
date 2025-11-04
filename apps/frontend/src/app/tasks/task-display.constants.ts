/**
 * Display constants for task-related components
 */

/**
 * UI text labels for task-related components.
 * This is the single source of truth for UI text in the tasks feature.
 */
export const TASK_UI_TEXT = {
  // Buttons
  ADD_NEW_TASK: 'Add New Task',
  EDIT_TASK: 'Edit Task',
  DELETE_TASK: 'Delete Task',
  CHANGE_STATUS: 'Change Status',
  MARK_COMPLETE: 'Mark Complete',
  BACK_TO_LIST: '← Back to List',
  BACK_TO_TASKS: '← Back to Tasks',
  RETRY: 'Retry',

  // Page titles
  TASK_LIST: 'Task List',
  TASK_DETAILS: 'Task Details',
  ADD_TASK_TITLE: 'Add New Task',
  EDIT_TASK_TITLE: 'Edit Task',

  // Messages - Task
  DELETE_CONFIRMATION_TITLE: 'Delete Task',
  DELETE_CONFIRMATION_MESSAGE: 'Are you sure you want to delete this task? This action cannot be undone.',
  DELETE_CONFIRM_BUTTON: 'Delete',
  DELETE_CANCEL_BUTTON: 'Cancel',

  TASK_CREATED_SUCCESS: 'Task created successfully!',
  TASK_UPDATED_SUCCESS: 'Task updated successfully!',

  // Loading and error states
  LOADING_TASKS: 'Loading tasks...',
  LOADING_TASK_DETAILS: 'Loading task details...',
  TASK_NOT_FOUND: 'Task not found',
  NO_TASKS_FOUND: 'No tasks found',
  ADD_FIRST_TASK: 'Add your first task to get started',
  NO_SEARCH_RESULTS: 'Try a different search term.',
  NO_FILTER_RESULTS: 'Try a different filter.',
  NO_OVERDUE_TASKS: 'All tasks are on track!',
  NO_OVERDUE_TASKS_DESCRIPTION: 'There are no overdue action items. Keep up the great work!',

  // Search and filter
  SEARCH_PLACEHOLDER: 'Search by task title...',
  ALL_TASKS_FILTER: 'All Tasks',
  SHOW_OVERDUE_ONLY: 'Show Overdue Only',
  VIEW_DETAILS: 'View Details',
  NO_TASKS_MATCHING_SEARCH: 'No tasks found matching your search',
  NO_TASKS_WITH_STATUS: 'No tasks found with status',
  NO_TASKS_WITH_PRIORITY: 'No tasks found with priority',

  // Task count display
  SHOWING_PREFIX: 'Showing',
  TASK_SINGULAR: 'task',
  TASK_PLURAL: 'tasks',
  MATCHING_PREFIX: 'matching',
  WITH_STATUS_PREFIX: 'with status',
  WITH_PRIORITY_PREFIX: 'with priority',

  // Detail labels (used in task list and detail views)
  LABEL_TITLE: 'Title:',
  LABEL_NOTES: 'Notes:',
  LABEL_DESCRIPTION: 'Description',
  LABEL_STATUS: 'Status:',
  LABEL_PRIORITY: 'Priority:',
  LABEL_DUE_DATE: 'Due Date:',
  LABEL_DEADLINE: 'Deadline',
  LABEL_CLIENT: 'Client:',
  LABEL_PROJECT: 'Project:',
  LABEL_CREATED: 'Created:',
  VIEW_CLIENT: 'View Client →',
  VIEW_PROJECT: 'View Project →',
  NO_CLIENT_ASSIGNED: 'No client assigned',
  NO_PROJECT_ASSIGNED: 'No project assigned',

  // Change Status Form
  CHANGE_STATUS_TITLE: 'Change Task Status',
  CHANGE_STATUS_DESCRIPTION: 'Select a new status for this task. The change will be saved immediately.',
  CURRENT_STATUS_LABEL: 'Current Status:',
  NEW_STATUS_LABEL: 'New Status',
  SELECT_STATUS_PLACEHOLDER: 'Select a status',
  SELECT_STATUS_ERROR: 'Please select a status',
  SAVE_STATUS_BUTTON: 'Save Status',
  CANCEL_BUTTON: 'Cancel',
} as const;

/**
 * Form field labels and placeholders for task forms.
 * This ensures consistent labeling across all task form instances.
 */
export const TASK_FORM_LABELS = {
  // Field labels
  TITLE: 'Title *',
  NOTES: 'Notes',
  STATUS: 'Status *',
  PRIORITY: 'Priority *',
  DUE_DATE: 'Due Date',
  CLIENT_ID: 'Client',
  PROJECT_ID: 'Project',

  // Placeholders
  TITLE_PLACEHOLDER: 'Enter task title',
  NOTES_PLACEHOLDER: 'Add detailed notes about this task',
  STATUS_PLACEHOLDER: 'Select status',
  PRIORITY_PLACEHOLDER: 'Select priority',
  DUE_DATE_PLACEHOLDER: 'Select due date',
  CLIENT_ID_PLACEHOLDER: 'Select a client (optional)',
  PROJECT_ID_PLACEHOLDER: 'Select a project (optional)',

  // Validation messages
  TITLE_REQUIRED: 'Task title is required',
  STATUS_REQUIRED: 'Task status is required',
  PRIORITY_REQUIRED: 'Task priority is required',
  INVALID_DUE_DATE: 'Please enter a valid due date',

  // Submit button labels
  ADD_TASK_BUTTON: 'Add Task',
  UPDATE_TASK_BUTTON: 'Update Task',
  SUBMITTING_BUTTON: 'Submitting...',
  UPDATING_BUTTON: 'Updating...',
  CANCEL_BUTTON: 'Cancel',
} as const;

/**
 * Error messages for task-related operations.
 * These are used in NGRX effects when API calls fail.
 */
export const TASK_ERROR_MESSAGES = {
  LOAD_TASKS_FAILED: 'Failed to load tasks',
  LOAD_TASK_FAILED: 'Failed to load task details',
  CREATE_TASK_FAILED: 'Failed to create task',
  UPDATE_TASK_FAILED: 'Failed to update task',
  CHANGE_STATUS_FAILED: 'Failed to change task status',
  DELETE_TASK_FAILED: 'Failed to delete task',
  FILTER_BY_STATUS_FAILED: 'Failed to filter tasks by status',
  FILTER_BY_PRIORITY_FAILED: 'Failed to filter tasks by priority',
} as const;
