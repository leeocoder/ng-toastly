/**
 * Toast Constants - All named constants for the Toastly library.
 *
 * No magic numbers or magic strings are used anywhere in the codebase.
 * All configurable values are defined here with descriptive names.
 */

import { ToastGlobalConfig } from '../types/toast-config.type';

// ============================================================================
// TIMING CONSTANTS
// ============================================================================

/**
 * Default duration before a toast is automatically dismissed.
 * Set to 5 seconds for optimal user experience.
 */
export const TOAST_AUTO_DISMISS_DELAY_MS = 5000;

/**
 * Duration of toast enter/exit animations.
 * Matches CSS transition timing for smooth animations.
 */
export const TOAST_ANIMATION_DURATION_MS = 300;

/**
 * Minimum allowed duration for auto-dismiss.
 * Prevents toasts from disappearing too quickly to read.
 */
export const TOAST_MINIMUM_DURATION_MS = 1000;

// ============================================================================
// LAYOUT CONSTANTS
// ============================================================================

/**
 * Z-index for the toast container.
 * Set high to ensure toasts appear above most UI elements.
 */
export const TOAST_CONTAINER_Z_INDEX = 9999;

/**
 * Maximum number of toasts visible simultaneously.
 * Prevents overwhelming the user with too many notifications.
 */
export const MAXIMUM_VISIBLE_TOASTS = 5;

/**
 * Vertical gap between stacked toasts in pixels.
 */
export const TOAST_STACK_GAP_PX = 12;

/**
 * Horizontal and vertical offset from screen edge in pixels.
 */
export const TOAST_SCREEN_OFFSET_PX = 16;

// ============================================================================
// PROGRESS CONSTANTS
// ============================================================================

/**
 * Minimum valid progress percentage value.
 */
export const PROGRESS_MINIMUM_PERCENT = 0;

/**
 * Maximum valid progress percentage value.
 */
export const PROGRESS_MAXIMUM_PERCENT = 100;

// ============================================================================
// ID GENERATION
// ============================================================================

/**
 * Prefix used for generated toast IDs.
 * Helps identify toast-related DOM elements during debugging.
 */
export const TOAST_ID_PREFIX = 'toastly-';

// ============================================================================
// DEFAULT CONFIGURATION
// ============================================================================

/**
 * Default global configuration for the toast service.
 * Used when no custom configuration is provided.
 */
export const DEFAULT_TOAST_CONFIG: ToastGlobalConfig = {
  position: 'bottom-right',
  theme: 'light',
  defaultDurationMs: TOAST_AUTO_DISMISS_DELAY_MS,
  maximumVisibleToasts: MAXIMUM_VISIBLE_TOASTS,
  newestOnTop: true,
  pauseOnHover: true,
  dismissibleByDefault: true,
  defaultType: 'info',
};

// ============================================================================
// ARIA / ACCESSIBILITY
// ============================================================================

/**
 * ARIA live region politeness setting for toast announcements.
 * 'polite' waits for user to finish current action before announcing.
 */
export const TOAST_ARIA_LIVE_POLITENESS = 'polite' as const;

/**
 * ARIA role for the toast container.
 */
export const TOAST_CONTAINER_ROLE = 'region' as const;

/**
 * ARIA role for individual toast items based on type.
 */
export const TOAST_ITEM_ROLES: Readonly<Record<string, string>> = {
  info: 'status',
  success: 'status',
  warning: 'alert',
  danger: 'alert',
};
