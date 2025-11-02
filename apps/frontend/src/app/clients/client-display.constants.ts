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

  // Change Status Form
  CHANGE_STATUS_TITLE: 'Change Client Status',
  CHANGE_STATUS_DESCRIPTION: 'Select a new status for this client. The change will be saved immediately.',
  CURRENT_STATUS_LABEL: 'Current Status:',
  NEW_STATUS_LABEL: 'New Status',
  SELECT_STATUS_PLACEHOLDER: 'Select a status',
  SELECT_STATUS_ERROR: 'Please select a status',
  SAVE_STATUS_BUTTON: 'Save Status',
  CANCEL_BUTTON: 'Cancel',
} as const;

/**
 * Form field labels and placeholders for client forms.
 * This ensures consistent labeling across all client form instances.
 */
export const CLIENT_FORM_LABELS = {
  // Field labels
  COMPANY_NAME: 'Company Name *',
  EMAIL: 'Email *',
  PHONE: 'Phone',
  ADDRESS: 'Address',
  STATUS: 'Status *',
  NOTES: 'Notes',

  // Placeholders
  COMPANY_NAME_PLACEHOLDER: 'Enter company name',
  EMAIL_PLACEHOLDER: 'contact@example.com',
  PHONE_PLACEHOLDER: '+1-555-0123',
  ADDRESS_PLACEHOLDER: '123 Main St, City, State ZIP',
  NOTES_PLACEHOLDER: 'Additional notes about the client',

  // Validation messages
  EMAIL_REQUIRED: 'Email is required',
  INVALID_EMAIL: 'Please enter a valid email address',
} as const;
