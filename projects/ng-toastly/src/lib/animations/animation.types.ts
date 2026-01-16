/**
 * Animation Types - Type definitions for toast animations.
 *
 * Provides type-safe animation configuration options.
 */

/**
 * Available animation preset names.
 *
 * - `slide`: Slides in from the edge, slides out to the edge
 * - `fade`: Simple opacity fade in/out
 * - `bounce`: Enters with a subtle bounce effect
 * - `none`: No animation (instant show/hide)
 */
export type AnimationPreset = 'slide' | 'fade' | 'bounce' | 'none';

/**
 * Animation direction based on toast position.
 */
export type AnimationDirection = 'left' | 'right' | 'top' | 'bottom';

/**
 * Custom animation callbacks for enter and leave transitions.
 *
 * @example
 * ```typescript
 * const customAnimation: CustomAnimation = {
 *   enter: (element) => {
 *     element.style.opacity = '0';
 *     element.animate([
 *       { opacity: 0, transform: 'scale(0.9)' },
 *       { opacity: 1, transform: 'scale(1)' }
 *     ], { duration: 200, fill: 'forwards' });
 *   },
 *   leave: (element) => {
 *     return element.animate([
 *       { opacity: 1 },
 *       { opacity: 0 }
 *     ], { duration: 150, fill: 'forwards' }).finished;
 *   }
 * };
 * ```
 */
export interface CustomAnimation {
  /**
   * Called when the toast enters the DOM.
   * @param element - The toast's root HTMLElement
   * @returns Optional Promise that resolves when animation completes
   */
  readonly enter: (element: HTMLElement) => void | Promise<void>;

  /**
   * Called before the toast leaves the DOM.
   * @param element - The toast's root HTMLElement
   * @returns Optional Promise that resolves when animation completes
   */
  readonly leave: (element: HTMLElement) => void | Promise<void>;
}

/**
 * Animation configuration for a toast.
 */
export interface AnimationConfig {
  /** Preset animation to use */
  readonly preset?: AnimationPreset;

  /** Custom animation callbacks (overrides preset) */
  readonly custom?: CustomAnimation;

  /** Animation duration in milliseconds */
  readonly durationMs?: number;

  /** CSS easing function */
  readonly easing?: string;
}

/**
 * Internal animation runner function signature.
 */
export type AnimationRunner = (
  element: HTMLElement,
  direction: AnimationDirection,
  durationMs: number,
  easing: string
) => Animation | void;

/**
 * Animation preset definition.
 */
export interface AnimationPresetDefinition {
  /** Enter animation runner */
  readonly enter: AnimationRunner;

  /** Leave animation runner */
  readonly leave: AnimationRunner;
}
