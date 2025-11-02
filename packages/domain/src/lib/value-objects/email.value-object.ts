import { DOMAIN_ERRORS } from '../constants/domain-errors';

/**
 * Email value object that encapsulates email validation logic.
 * Ensures all email addresses in the domain are valid.
 */
export class Email {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private constructor(private readonly value: string) {}

  /**
   * Creates a new Email value object from a string.
   * Validates the email format before creating the object.
   *
   * @param email - The email address string to validate
   * @returns A new Email value object
   * @throws Error if the email format is invalid
   */
  static create(email: string): Email {
    if (!email || email.trim().length === 0) {
      throw new Error(DOMAIN_ERRORS.INVALID_EMAIL_FORMAT);
    }

    const trimmedEmail = email.trim();

    if (!Email.EMAIL_REGEX.test(trimmedEmail)) {
      throw new Error(DOMAIN_ERRORS.INVALID_EMAIL_FORMAT);
    }

    return new Email(trimmedEmail);
  }

  /**
   * Creates an Email value object from a potentially null/undefined string.
   * Returns null if the input is null or undefined.
   *
   * @param email - The email address string or null/undefined
   * @returns A new Email value object or null
   * @throws Error if the email format is invalid (when not null/undefined)
   */
  static createOptional(email: string | null | undefined): Email | null {
    if (email === null || email === undefined) {
      return null;
    }
    return Email.create(email);
  }

  /**
   * Returns the email address as a string
   */
  toString(): string {
    return this.value;
  }

  /**
   * Returns the email address as a string (for serialization)
   */
  getValue(): string {
    return this.value;
  }

  /**
   * Checks equality with another Email value object
   */
  equals(other: Email | null | undefined): boolean {
    if (!other) {
      return false;
    }
    return this.value === other.value;
  }
}
