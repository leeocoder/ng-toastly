/**
 * Bounce Animation Preset - Enters with a playful bounce effect.
 *
 * Features:
 * - Slight scale overshoot on enter
 * - More engaging than slide/fade
 * - Good for success notifications
 */

import { AnimationPresetDefinition } from '../animation.types';
import {
  ANIMATION_BOUNCE_SCALE_START,
  ANIMATION_BOUNCE_SCALE_OVERSHOOT,
  ANIMATION_BOUNCE_EASING,
} from '../animation.constants';

/**
 * Bounce animation preset definition.
 */
export const bounceAnimation: AnimationPresetDefinition = {
  enter: (element, _direction, durationMs, _easing) => {
    return element.animate(
      [
        { opacity: 0, transform: `scale(${ANIMATION_BOUNCE_SCALE_START})` },
        { opacity: 1, transform: `scale(${ANIMATION_BOUNCE_SCALE_OVERSHOOT})`, offset: 0.7 },
        { opacity: 1, transform: 'scale(1)' },
      ],
      {
        duration: durationMs,
        easing: ANIMATION_BOUNCE_EASING,
        fill: 'forwards',
      }
    );
  },

  leave: (element, _direction, durationMs, easing) => {
    // Leave animation uses simple fade + scale down
    return element.animate(
      [
        { opacity: 1, transform: 'scale(1)' },
        { opacity: 0, transform: `scale(${ANIMATION_BOUNCE_SCALE_START})` },
      ],
      {
        duration: durationMs,
        easing,
        fill: 'forwards',
      }
    );
  },
};
