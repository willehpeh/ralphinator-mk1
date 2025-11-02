/**
 * Error message templates for client controller operations.
 */
export const CLIENT_CONTROLLER_ERROR_MESSAGES = {
  /**
   * Error message when a client is not found after a mutation operation.
   * @param clientId - The ID of the client that was not found
   * @param operation - The operation that was performed (e.g., 'update', 'status change')
   */
  CLIENT_NOT_FOUND_AFTER_MUTATION: (clientId: string, operation: string) =>
    `Client ${clientId} not found after ${operation}`,
} as const;
