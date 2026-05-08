/**
 * Client-side validation rules for the /ping message field:
 *   1. The message must be 20 characters or fewer.
 *   2. The message must be all lowercase (no uppercase letters).
 */

/** Maximum allowed length for the message field. */
export const MAX_MESSAGE_LENGTH = 20;

export interface ValidationResult {
  /** True if the message satisfies every rule. */
   valid: boolean;
  /** Human-readable errors, one per failed rule. Empty when valid. */
   errors: string[];
}

/** Run every validation rule and return all failures */
export function validateMessage(message: string): ValidationResult {
  const errors: string[] = [];

  if (message.length > MAX_MESSAGE_LENGTH) {
    errors.push(
      `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer (currently ${message.length}).`,
    );
  }
  if (/[A-Z]/.test(message)) {
    errors.push("Message must be all lowercase.");
  }

  return { valid: errors.length === 0, errors };
}
