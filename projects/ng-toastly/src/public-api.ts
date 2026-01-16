/**
 * Toastly - Angular Toast Notification Library
 *
 * Public API Surface
 *
 * This file defines all public exports for the library.
 * Only exports listed here are part of the public API.
 */

// =============================================================================
// TYPES
// =============================================================================

export type {
  Toast,
  ToastPayload,
  ToastType,
  ToastTheme,
  ToastPosition,
  ToastAction,
  ToastActionVariant,
} from './lib/types/toast.type';

export type {
  ToastGlobalConfig,
  ToastGlobalConfigPartial,
  ToastStyleConfig,
} from './lib/types/toast-config.type';

export { TOAST_GLOBAL_CONFIG } from './lib/types/toast-config.type';

export { provideToastly } from './lib/provide-toast';

export type {
  ToastError,
  ToastErrorCode,
} from './lib/types/toast-error.type';

export {
  createToastError,
  TOAST_ERROR_MESSAGES,
} from './lib/types/toast-error.type';

// =============================================================================
// ANIMATION TYPES
// =============================================================================

export type {
  AnimationPreset,
  AnimationDirection,
  CustomAnimation,
  AnimationConfig,
} from './lib/animations/animation.types';

export {
  ANIMATION_DEFAULT_DURATION_MS,
  ANIMATION_DEFAULT_EASING,
  CSS_VAR_ANIMATION_DURATION,
  CSS_VAR_ANIMATION_EASING,
  DEFAULT_ANIMATION_PRESET,
} from './lib/animations/animation.constants';

export { AnimationService } from './lib/animations/animation.service';

// =============================================================================
// CONSTANTS
// =============================================================================

export {
  TOAST_AUTO_DISMISS_DELAY_MS,
  TOAST_ANIMATION_DURATION_MS,
  TOAST_MINIMUM_DURATION_MS,
  TOAST_CONTAINER_Z_INDEX,
  MAXIMUM_VISIBLE_TOASTS,
  TOAST_STACK_GAP_PX,
  TOAST_SCREEN_OFFSET_PX,
  PROGRESS_MINIMUM_PERCENT,
  PROGRESS_MAXIMUM_PERCENT,
  TOAST_ID_PREFIX,
  DEFAULT_TOAST_CONFIG,
} from './lib/constants/toast.constants';

// =============================================================================
// SERVICES
// =============================================================================

export { ToastService } from './lib/services/toast.service';

// =============================================================================
// COMPONENTS
// =============================================================================

export { ToastContainerComponent } from './lib/components/toast-container/toast-container.component';
export { ToastItemComponent } from './lib/components/toast-item/toast-item.component';

