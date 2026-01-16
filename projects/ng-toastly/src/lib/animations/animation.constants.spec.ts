/**
 * Tests for Animation Constants
 *
 * Verifies:
 * - All constants are defined
 * - Values are reasonable
 * - CSS variable names are correct
 */

import {
  ANIMATION_DEFAULT_DURATION_MS,
  ANIMATION_REDUCED_MOTION_DURATION_MS,
  ANIMATION_DEFAULT_EASING,
  ANIMATION_BOUNCE_EASING,
  CSS_VAR_ANIMATION_DURATION,
  CSS_VAR_ANIMATION_EASING,
  ANIMATION_SLIDE_DISTANCE_PX,
  ANIMATION_BOUNCE_SCALE_START,
  ANIMATION_BOUNCE_SCALE_OVERSHOOT,
  DEFAULT_ANIMATION_PRESET,
  REDUCED_MOTION_PRESET,
} from './animation.constants';

describe('Animation Constants', () => {
  // ==========================================================================
  // Timing Constants
  // ==========================================================================

  describe('timing constants', () => {
    it('should have reasonable default duration', () => {
      expect(ANIMATION_DEFAULT_DURATION_MS).toBeGreaterThan(0);
      expect(ANIMATION_DEFAULT_DURATION_MS).toBeLessThanOrEqual(1000);
    });

    it('should have shorter reduced motion duration', () => {
      expect(ANIMATION_REDUCED_MOTION_DURATION_MS).toBeGreaterThan(0);
      expect(ANIMATION_REDUCED_MOTION_DURATION_MS).toBeLessThan(ANIMATION_DEFAULT_DURATION_MS);
    });
  });

  // ==========================================================================
  // Easing Constants
  // ==========================================================================

  describe('easing constants', () => {
    it('should have valid default easing', () => {
      expect(ANIMATION_DEFAULT_EASING).toBeDefined();
      expect(typeof ANIMATION_DEFAULT_EASING).toBe('string');
    });

    it('should have valid bounce easing', () => {
      expect(ANIMATION_BOUNCE_EASING).toBeDefined();
      expect(ANIMATION_BOUNCE_EASING).toContain('cubic-bezier');
    });
  });

  // ==========================================================================
  // CSS Variable Names
  // ==========================================================================

  describe('CSS variable names', () => {
    it('should have duration CSS variable', () => {
      expect(CSS_VAR_ANIMATION_DURATION).toBe('--toastly-animation-duration');
    });

    it('should have easing CSS variable', () => {
      expect(CSS_VAR_ANIMATION_EASING).toBe('--toastly-animation-easing');
    });

    it('should use correct prefix', () => {
      expect(CSS_VAR_ANIMATION_DURATION).toContain('--toastly-');
      expect(CSS_VAR_ANIMATION_EASING).toContain('--toastly-');
    });
  });

  // ==========================================================================
  // Transform Values
  // ==========================================================================

  describe('transform values', () => {
    it('should have reasonable slide distance', () => {
      expect(ANIMATION_SLIDE_DISTANCE_PX).toBeGreaterThan(0);
      expect(ANIMATION_SLIDE_DISTANCE_PX).toBeLessThanOrEqual(200);
    });

    it('should have bounce scale start less than 1', () => {
      expect(ANIMATION_BOUNCE_SCALE_START).toBeGreaterThan(0);
      expect(ANIMATION_BOUNCE_SCALE_START).toBeLessThan(1);
    });

    it('should have bounce scale overshoot greater than 1', () => {
      expect(ANIMATION_BOUNCE_SCALE_OVERSHOOT).toBeGreaterThan(1);
      expect(ANIMATION_BOUNCE_SCALE_OVERSHOOT).toBeLessThan(1.2);
    });
  });

  // ==========================================================================
  // Default Configuration
  // ==========================================================================

  describe('default configuration', () => {
    it('should have valid default animation preset', () => {
      expect(DEFAULT_ANIMATION_PRESET).toBe('slide');
    });

    it('should have valid reduced motion preset', () => {
      expect(REDUCED_MOTION_PRESET).toBe('fade');
    });

    it('should use fade for reduced motion (least intrusive)', () => {
      expect(REDUCED_MOTION_PRESET).toBe('fade');
    });
  });
});
