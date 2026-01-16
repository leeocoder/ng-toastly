/**
 * Toast Configuration Types - Global and per-toast configuration options.
 */

import { InjectionToken } from '@angular/core';
import { ToastPosition, ToastTheme, ToastType } from './toast.type';
import { AnimationPreset, CustomAnimation } from '../animations/animation.types';

/**
 * Global configuration for the Toastly notification system.
 * Provided at the application root level.
 */
export interface ToastGlobalConfig {
  /** Default position for toast notifications */
  readonly position: ToastPosition;
  /** Default theme for toast notifications */
  readonly theme: ToastTheme;
  /** Default auto-dismiss duration in milliseconds */
  readonly defaultDurationMs: number;
  /** Maximum number of toasts visible at once */
  readonly maximumVisibleToasts: number;
  /** Whether new toasts should appear at the top or bottom of the stack */
  readonly newestOnTop: boolean;
  /** Whether toasts should pause auto-dismiss on hover */
  readonly pauseOnHover: boolean;
  /** Whether toasts are dismissible by default */
  readonly dismissibleByDefault: boolean;
  /** Default type for toasts when not specified */
  readonly defaultType: ToastType;
  /** Animation preset to use for enter/leave transitions */
  readonly animationPreset: AnimationPreset;
  /** Custom animation callbacks (overrides animationPreset) */
  readonly animation?: CustomAnimation;
}

/**
 * Partial configuration for overriding global defaults.
 */
export type ToastGlobalConfigPartial = Partial<ToastGlobalConfig>;

/**
 * Style configuration using CSS variable overrides.
 */
export interface ToastStyleConfig {
  /** Background color */
  readonly backgroundColor?: string;
  /** Text color */
  readonly textColor?: string;
  /** Muted text color for secondary content */
  readonly textMutedColor?: string;
  /** Border color */
  readonly borderColor?: string;
  /** Border radius in pixels or CSS value */
  readonly borderRadius?: string;
  /** Box shadow CSS value */
  readonly boxShadow?: string;
}

/**
 * Injection token for providing global toast configuration.
 */
export const TOAST_GLOBAL_CONFIG = new InjectionToken<ToastGlobalConfigPartial>(
  'TOAST_GLOBAL_CONFIG'
);
