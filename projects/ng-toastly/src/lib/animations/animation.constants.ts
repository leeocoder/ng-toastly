/**
 * Animation Constants - Default values and CSS variable names.
 *
 * No magic numbers or strings - all animation timing and styling
 * values are defined here with descriptive names.
 */

import { AnimationPreset } from './animation.types';

// ============================================================================
// TIMING CONSTANTS
// ============================================================================

/**
 * Default animation duration in milliseconds.
 * Balanced between noticeable and not too slow.
 */
export const ANIMATION_DEFAULT_DURATION_MS = 300;

/**
 * Reduced motion animation duration.
 * Faster for users who prefer reduced motion.
 */
export const ANIMATION_REDUCED_MOTION_DURATION_MS = 100;

/**
 * Default CSS easing function.
 * Smooth, natural-feeling animation curve.
 */
export const ANIMATION_DEFAULT_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';

/**
 * Bounce easing for enter animations.
 * Slight overshoot for playful effect.
 */
export const ANIMATION_BOUNCE_EASING = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

// ============================================================================
// CSS VARIABLE NAMES
// ============================================================================

/**
 * CSS variable name for animation duration.
 */
export const CSS_VAR_ANIMATION_DURATION = '--toastly-animation-duration';

/**
 * CSS variable name for animation easing.
 */
export const CSS_VAR_ANIMATION_EASING = '--toastly-animation-easing';

// ============================================================================
// TRANSFORM VALUES
// ============================================================================

/**
 * Slide distance for enter/leave animations in pixels.
 */
export const ANIMATION_SLIDE_DISTANCE_PX = 100;

/**
 * Scale value for bounce animation start.
 */
export const ANIMATION_BOUNCE_SCALE_START = 0.9;

/**
 * Scale value for bounce animation overshoot.
 */
export const ANIMATION_BOUNCE_SCALE_OVERSHOOT = 1.02;

// ============================================================================
// DEFAULT CONFIGURATION
// ============================================================================

/**
 * Default animation preset.
 */
export const DEFAULT_ANIMATION_PRESET: AnimationPreset = 'slide';

/**
 * Animation preset to use when prefers-reduced-motion is enabled.
 * 'fade' is the least intrusive animation.
 */
export const REDUCED_MOTION_PRESET: AnimationPreset = 'fade';
