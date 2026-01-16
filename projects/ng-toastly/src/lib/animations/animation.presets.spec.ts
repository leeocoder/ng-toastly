/**
 * Tests for Animation Presets
 *
 * Verifies:
 * - Slide animation returns correct keyframes and options
 * - Fade animation returns correct keyframes and options
 * - Bounce animation returns correct keyframes and options
 */

import { slideAnimation } from './presets/slide.animation';
import { fadeAnimation } from './presets/fade.animation';
import { bounceAnimation } from './presets/bounce.animation';
import { AnimationDirection, AnimationPresetDefinition } from './animation.types';

describe('Animation Presets', () => {
  // Mock element with animate method for testing
  let mockElement: HTMLElement;
  let capturedKeyframes: Keyframe[];
  let capturedOptions: KeyframeAnimationOptions;

  beforeEach(() => {
    mockElement = document.createElement('div');
    mockElement.animate = vi.fn().mockImplementation((keyframes: Keyframe[], options: KeyframeAnimationOptions) => {
      capturedKeyframes = keyframes;
      capturedOptions = options;
      return {
        finished: Promise.resolve(),
        cancel: vi.fn(),
        play: vi.fn(),
      };
    });
  });

  // ==========================================================================
  // Slide Animation Tests
  // ==========================================================================

  describe('slideAnimation', () => {
    it('should be a valid AnimationPresetDefinition', () => {
      expect(slideAnimation.enter).toBeDefined();
      expect(slideAnimation.leave).toBeDefined();
      expect(typeof slideAnimation.enter).toBe('function');
      expect(typeof slideAnimation.leave).toBe('function');
    });

    describe('enter', () => {
      it('should call animate with translateX for right direction', () => {
        slideAnimation.enter(mockElement, 'right', 300, 'ease');

        expect(mockElement.animate).toHaveBeenCalled();
        expect(capturedKeyframes[0]['transform']).toContain('translateX');
      });

      it('should call animate with translateX for left direction', () => {
        slideAnimation.enter(mockElement, 'left', 300, 'ease');

        expect(mockElement.animate).toHaveBeenCalled();
        expect(capturedKeyframes[0]['transform']).toContain('translateX(-');
      });

      it('should call animate with translateY for top direction', () => {
        slideAnimation.enter(mockElement, 'top', 300, 'ease');

        expect(mockElement.animate).toHaveBeenCalled();
        expect(capturedKeyframes[0]['transform']).toContain('translateY(-');
      });

      it('should call animate with translateY for bottom direction', () => {
        slideAnimation.enter(mockElement, 'bottom', 300, 'ease');

        expect(mockElement.animate).toHaveBeenCalled();
        expect(capturedKeyframes[0]['transform']).toContain('translateY(');
      });

      it('should use provided duration', () => {
        slideAnimation.enter(mockElement, 'right', 500, 'ease');

        expect(capturedOptions.duration).toBe(500);
      });

      it('should use provided easing', () => {
        slideAnimation.enter(mockElement, 'right', 300, 'ease-in-out');

        expect(capturedOptions.easing).toBe('ease-in-out');
      });

      it('should use fill: forwards', () => {
        slideAnimation.enter(mockElement, 'right', 300, 'ease');

        expect(capturedOptions.fill).toBe('forwards');
      });
    });

    describe('leave', () => {
      it('should call animate method', () => {
        slideAnimation.leave(mockElement, 'right', 300, 'ease');

        expect(mockElement.animate).toHaveBeenCalled();
      });
    });
  });

  // ==========================================================================
  // Fade Animation Tests
  // ==========================================================================

  describe('fadeAnimation', () => {
    it('should be a valid AnimationPresetDefinition', () => {
      expect(fadeAnimation.enter).toBeDefined();
      expect(fadeAnimation.leave).toBeDefined();
    });

    describe('enter', () => {
      it('should animate opacity from 0 to 1', () => {
        fadeAnimation.enter(mockElement, 'right', 300, 'ease');

        expect(capturedKeyframes).toEqual([{ opacity: 0 }, { opacity: 1 }]);
      });

      it('should work for all directions', () => {
        const directions: AnimationDirection[] = ['left', 'right', 'top', 'bottom'];

        directions.forEach((dir) => {
          fadeAnimation.enter(mockElement, dir, 300, 'ease');
          expect(capturedKeyframes).toEqual([{ opacity: 0 }, { opacity: 1 }]);
        });
      });

      it('should use fill: forwards', () => {
        fadeAnimation.enter(mockElement, 'right', 300, 'ease');

        expect(capturedOptions.fill).toBe('forwards');
      });
    });

    describe('leave', () => {
      it('should animate opacity from 1 to 0', () => {
        fadeAnimation.leave(mockElement, 'right', 300, 'ease');

        expect(capturedKeyframes).toEqual([{ opacity: 1 }, { opacity: 0 }]);
      });
    });
  });

  // ==========================================================================
  // Bounce Animation Tests
  // ==========================================================================

  describe('bounceAnimation', () => {
    it('should be a valid AnimationPresetDefinition', () => {
      expect(bounceAnimation.enter).toBeDefined();
      expect(bounceAnimation.leave).toBeDefined();
    });

    describe('enter', () => {
      it('should animate with scale values', () => {
        bounceAnimation.enter(mockElement, 'right', 300, 'ease');

        expect(capturedKeyframes.length).toBe(3);
        expect(capturedKeyframes[0]['transform']).toContain('scale(0.9)');
        expect(capturedKeyframes[1]['transform']).toContain('scale(1.02)');
        expect(capturedKeyframes[2]['transform']).toContain('scale(1)');
      });

      it('should use custom bounce easing', () => {
        bounceAnimation.enter(mockElement, 'right', 300, 'ease');

        expect(capturedOptions.easing).toContain('cubic-bezier');
      });
    });

    describe('leave', () => {
      it('should animate with scale down', () => {
        bounceAnimation.leave(mockElement, 'right', 300, 'ease');

        expect(capturedKeyframes.length).toBe(2);
        expect(capturedKeyframes[0]['transform']).toBe('scale(1)');
        expect(capturedKeyframes[1]['transform']).toContain('scale(0.9)');
      });
    });
  });
});
