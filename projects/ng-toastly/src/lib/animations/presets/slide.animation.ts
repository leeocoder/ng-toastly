/**
 * Slide Animation Preset - Slides toasts in and out from the edge.
 *
 * Direction is automatically determined by toast position:
 * - Left positions slide from left
 * - Right positions slide from right
 * - Top positions slide from top
 * - Bottom positions slide from bottom
 */

import { AnimationPresetDefinition, AnimationDirection } from '../animation.types';
import { ANIMATION_SLIDE_DISTANCE_PX } from '../animation.constants';

/**
 * Gets the transform value for a given direction.
 */
function getTranslateValue(direction: AnimationDirection, distance: number): string {
  switch (direction) {
    case 'left':
      return `translateX(-${distance}px)`;
    case 'right':
      return `translateX(${distance}px)`;
    case 'top':
      return `translateY(-${distance}px)`;
    case 'bottom':
      return `translateY(${distance}px)`;
  }
}

/**
 * Slide animation preset definition.
 */
export const slideAnimation: AnimationPresetDefinition = {
  enter: (element, direction, durationMs, easing) => {
    const startTransform = getTranslateValue(direction, ANIMATION_SLIDE_DISTANCE_PX);

    return element.animate(
      [
        { opacity: 0, transform: startTransform },
        { opacity: 1, transform: 'translate(0)' },
      ],
      {
        duration: durationMs,
        easing,
        fill: 'forwards',
      }
    );
  },

  leave: (element, direction, durationMs, easing) => {
    const endTransform = getTranslateValue(direction, ANIMATION_SLIDE_DISTANCE_PX);

    return element.animate(
      [
        { opacity: 1, transform: 'translate(0)' },
        { opacity: 0, transform: endTransform },
      ],
      {
        duration: durationMs,
        easing,
        fill: 'forwards',
      }
    );
  },
};
