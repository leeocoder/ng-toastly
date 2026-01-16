/**
 * Fade Animation Preset - Simple opacity fade in/out.
 *
 * The most subtle animation, ideal for:
 * - Users who prefer reduced motion
 * - Professional/minimal interfaces
 * - When you don't want animation to distract
 */

import { AnimationPresetDefinition } from '../animation.types';

/**
 * Fade animation preset definition.
 */
export const fadeAnimation: AnimationPresetDefinition = {
  enter: (element, _direction, durationMs, easing) => {
    return element.animate(
      [
        { opacity: 0 },
        { opacity: 1 },
      ],
      {
        duration: durationMs,
        easing,
        fill: 'forwards',
      }
    );
  },

  leave: (element, _direction, durationMs, easing) => {
    return element.animate(
      [
        { opacity: 1 },
        { opacity: 0 },
      ],
      {
        duration: durationMs,
        easing,
        fill: 'forwards',
      }
    );
  },
};
