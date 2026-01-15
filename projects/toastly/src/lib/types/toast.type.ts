/**
 * Toast Types - Core type definitions for the Toastly notification library.
 *
 * All types use discriminated unions and readonly properties for type safety.
 * No 'any' or 'unknown' types are used.
 */

import { TemplateRef } from '@angular/core';

/**
 * Semantic toast types representing different notification purposes.
 * Each type has distinct visual styling and accessibility semantics.
 */
export type ToastType = 'info' | 'success' | 'warning' | 'danger';

/**
 * Visual theme variants for toast notifications.
 * - 'light': White background with dark text
 * - 'dark': Dark background with light text
 */
export type ToastTheme = 'light' | 'dark';

/**
 * Available positions for the toast container on the screen.
 */
export type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'bottom-center';

/**
 * Button style variants for toast action buttons.
 */
export type ToastActionVariant = 'primary' | 'secondary';

/**
 * Action button configuration for toast notifications.
 */
export interface ToastAction {
  /** Display label for the action button */
  readonly label: string;
  /** Callback function executed when the button is clicked */
  readonly onClick: () => void;
  /** Visual style variant for the button */
  readonly variant: ToastActionVariant;
}

/**
 * User-provided input for creating a new toast notification.
 * This is the public API for toast creation.
 */
export interface ToastPayload {
  /** Main message content of the toast */
  readonly message: string;
  /** Optional title displayed above the message */
  readonly title?: string;
  /** Semantic type determining the toast's appearance and ARIA role */
  readonly type?: ToastType;
  /** Visual theme variant */
  readonly theme?: ToastTheme;
  /** Duration in milliseconds before auto-dismiss (0 = no auto-dismiss) */
  readonly durationMs?: number;
  /** Whether the toast can be dismissed by the user */
  readonly dismissible?: boolean;
  /** Action buttons to display in the toast */
  readonly actions?: readonly ToastAction[];
  /** Custom CSS class to apply to the toast container */
  readonly styleClass?: string;
  /** Custom icon template to display instead of the default type icon */
  readonly iconTemplate?: TemplateRef<void>;
  /** URL or path to an avatar image */
  readonly avatarUrl?: string;
  /** Progress value between 0 and 100 (undefined = no progress bar) */
  readonly progressPercent?: number;
  /** Specific position for this toast (overrides global config) */
  readonly position?: ToastPosition;
}

/**
 * Internal representation of a toast notification.
 * Extends ToastPayload with required internal fields.
 */
export interface Toast extends Required<Pick<ToastPayload, 'message' | 'type' | 'theme' | 'dismissible'>> {
  /** Unique identifier for this toast instance */
  readonly id: string;
  /** Timestamp when the toast was created */
  readonly createdAt: number;
  /** Optional title */
  readonly title?: string;
  /** Duration in milliseconds (0 = no auto-dismiss) */
  readonly durationMs: number;
  /** Action buttons */
  readonly actions: readonly ToastAction[];
  /** Custom CSS class */
  readonly styleClass?: string;
  /** Custom icon template */
  readonly iconTemplate?: TemplateRef<void>;
  /** Avatar image URL */
  readonly avatarUrl?: string;
  /** Progress percentage */
  readonly progressPercent?: number;
  /** Resolved position for this toast */
  readonly position: ToastPosition;
}
