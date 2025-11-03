/**
 * Client feature route paths.
 * This is the single source of truth for client-related routes in the UI.
 */
export const CLIENT_ROUTES = {
  /**
   * Base path for the clients feature
   */
  BASE: '/clients',

  /**
   * Path for adding a new client
   */
  ADD: '/clients/add',

  /**
   * Path for viewing all contacts across all clients
   */
  CONTACTS: '/contacts',

  /**
   * Constructs the path for viewing a specific client's details
   * @param clientId - The ID of the client
   * @returns The full path to the client detail view
   */
  detail: (clientId: string): string => `/clients/${clientId}`
} as const;
