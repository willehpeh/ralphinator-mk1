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
 * Duration in milliseconds to display success messages before auto-dismissing
 */
export const SUCCESS_MESSAGE_DISMISS_DURATION_MS = 3000;

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

  // Loading and error states
  LOADING_CLIENTS: 'Loading clients...',
  LOADING_CLIENT_DETAILS: 'Loading client details...',
  CLIENT_NOT_FOUND: 'Client not found',
  NO_CLIENTS_FOUND: 'No clients found',
  ADD_FIRST_CLIENT: 'Add your first client to get started',
  NO_SEARCH_RESULTS: 'Try a different search term.',
  NO_FILTER_RESULTS: 'Try a different filter.',

  // Search and filter
  SEARCH_PLACEHOLDER: 'Search by company name...',
  ALL_CLIENTS_FILTER: 'All Clients',
  NO_CLIENTS_MATCHING_SEARCH: 'No clients found matching your search',
  NO_CLIENTS_WITH_STATUS: 'No clients found with status',

  // Client count display
  SHOWING_PREFIX: 'Showing',
  CLIENT_SINGULAR: 'client',
  CLIENT_PLURAL: 'clients',
  MATCHING_PREFIX: 'matching',
  WITH_STATUS_PREFIX: 'with status',

  // Detail labels (used in client list and detail views)
  LABEL_EMAIL: 'Email:',
  LABEL_PHONE: 'Phone:',
  LABEL_ADDRESS: 'Address:',
  LABEL_NOTES: 'Notes:',
  LABEL_CREATED: 'Created:',

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
  COMPANY_NAME_REQUIRED: 'Company name is required',
  EMAIL_REQUIRED: 'Email is required',
  INVALID_EMAIL: 'Please enter a valid email address',

  // Submit button labels
  ADD_CLIENT_BUTTON: 'Add Client',
  UPDATE_CLIENT_BUTTON: 'Update Client',
  SUBMITTING_BUTTON: 'Submitting...',
  UPDATING_BUTTON: 'Updating...',
  CANCEL_BUTTON: 'Cancel',
} as const;

/**
 * Error messages for client-related operations.
 * These are used in NGRX effects when API calls fail.
 */
export const CLIENT_ERROR_MESSAGES = {
  LOAD_CLIENTS_FAILED: 'Failed to load clients',
  UPDATE_CLIENT_FAILED: 'Failed to update client',
  CHANGE_STATUS_FAILED: 'Failed to change client status',
  FILTER_BY_STATUS_FAILED: 'Failed to filter clients by status',
  DELETE_CLIENT_FAILED: 'Failed to delete client',
} as const;
