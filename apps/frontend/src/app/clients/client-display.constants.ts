/**
 * Display constants for client-related components
 */

/**
 * Standard date format for displaying client dates (createdAt, etc.)
 * Uses Angular DatePipe format string
 * 'medium' format example: "Jun 15, 2023, 9:03:01 AM"
 */
export const STANDARD_DATE_FORMAT = 'medium';

/**
 * UI text labels for client-related components.
 * This is the single source of truth for UI text in the clients feature.
 */
export const CLIENT_UI_TEXT = {
  // Buttons
  ADD_NEW_CLIENT: 'Add New Client',
  EDIT_CLIENT: 'Edit Client',
  DELETE_CLIENT: 'Delete Client',
  CHANGE_STATUS: 'Change Status',
  BACK_TO_LIST: '← Back to List',

  // Page titles
  CLIENT_LIST: 'Client List',
  CLIENT_DETAILS: 'Client Details',
  ADD_CLIENT_TITLE: 'Add New Client',
  EDIT_CLIENT_TITLE: 'Edit Client',

  // Messages
  DELETE_CONFIRMATION_TITLE: 'Delete Client',
  DELETE_CONFIRMATION_MESSAGE: 'Are you sure you want to delete this client? This action cannot be undone.',
  DELETE_CONFIRM_BUTTON: 'Delete',
  DELETE_CANCEL_BUTTON: 'Cancel',

  CLIENT_CREATED_SUCCESS: 'Client created successfully!',
  CLIENT_UPDATED_SUCCESS: 'Client updated successfully!',
} as const;
