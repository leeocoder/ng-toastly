/**
 * Toast Error Types - Structured error handling for the Toastly library.
 *
 * All errors are typed and provide developer-friendly messages.
 * Follows the fail-fast principle with meaningful feedback.
 */

/**
 * Discriminated union of all possible toast error codes.
 */
export type ToastErrorCode =
  | 'TOAST_NOT_FOUND'
  | 'INVALID_DURATION'
  | 'INVALID_PROGRESS_VALUE'
  | 'MAXIMUM_TOASTS_EXCEEDED'
  | 'INVALID_CONFIGURATION';

/**
 * Structured error object for toast operations.
 */
export interface ToastError {
  /** Error code for programmatic handling */
  readonly code: ToastErrorCode;
  /** Human-readable error message */
  readonly message: string;
  /** Additional context about the error */
  readonly details?: string;
}

/**
 * Creates a structured toast error object.
 *
 * @param code - The error code
 * @param message - Human-readable message
 * @param details - Optional additional context
 * @returns A fully typed ToastError object
 */
export function createToastError(
  code: ToastErrorCode,
  message: string,
  details?: string
): ToastError {
  return {
    code,
    message,
    details,
  };
}

/**
 * Pre-defined error messages for common error scenarios.
 * Provides consistent, developer-friendly error messages.
 */
export const TOAST_ERROR_MESSAGES: Readonly<Record<ToastErrorCode, string>> = {
  TOAST_NOT_FOUND: 'The specified toast ID does not exist in the current toast collection.',
  INVALID_DURATION: 'Toast duration must be a non-negative number in milliseconds.',
  INVALID_PROGRESS_VALUE: 'Progress value must be between 0 and 100 inclusive.',
  MAXIMUM_TOASTS_EXCEEDED: 'Maximum number of visible toasts has been reached.',
  INVALID_CONFIGURATION: 'Invalid toast configuration provided.',
};
