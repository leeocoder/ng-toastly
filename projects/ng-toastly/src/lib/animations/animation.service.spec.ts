/**
 * Tests for AnimationService
 *
 * Verifies:
 * - Service creation
 * - Direction detection from position
 * - Preset and custom animation handling
 * - Reduced motion detection
 */

import { TestBed } from '@angular/core/testing';
import { AnimationService } from './animation.service';

describe('AnimationService', () => {
  let service: AnimationService;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [AnimationService],
    });
    service = TestBed.inject(AnimationService);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  // ==========================================================================
  // Service Creation Tests
  // ==========================================================================

  describe('creation', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should have runEnterAnimation method', () => {
      expect(typeof service.runEnterAnimation).toBe('function');
    });

    it('should have runLeaveAnimation method', () => {
      expect(typeof service.runLeaveAnimation).toBe('function');
    });

    it('should have getDirectionFromPosition method', () => {
      expect(typeof service.getDirectionFromPosition).toBe('function');
    });

    it('should have isReducedMotion method', () => {
      expect(typeof service.isReducedMotion).toBe('function');
    });
  });

  // ==========================================================================
  // Direction Detection Tests
  // ==========================================================================

  describe('getDirectionFromPosition', () => {
    it('should return "left" for top-left position', () => {
      expect(service.getDirectionFromPosition('top-left')).toBe('left');
    });

    it('should return "left" for bottom-left position', () => {
      expect(service.getDirectionFromPosition('bottom-left')).toBe('left');
    });

    it('should return "right" for top-right position', () => {
      expect(service.getDirectionFromPosition('top-right')).toBe('right');
    });

    it('should return "right" for bottom-right position', () => {
      expect(service.getDirectionFromPosition('bottom-right')).toBe('right');
    });

    it('should return "top" for top-center position', () => {
      expect(service.getDirectionFromPosition('top-center')).toBe('top');
    });

    it('should return "bottom" for bottom-center position', () => {
      expect(service.getDirectionFromPosition('bottom-center')).toBe('bottom');
    });
  });

  // ==========================================================================
  // Reduced Motion Tests
  // ==========================================================================

  describe('isReducedMotion', () => {
    it('should return a boolean', () => {
      const result = service.isReducedMotion();
      expect(typeof result).toBe('boolean');
    });

    it('should return false in test environment (no matchMedia)', () => {
      expect(service.isReducedMotion()).toBe(false);
    });
  });

  // ==========================================================================
  // Enter Animation Tests
  // ==========================================================================

  describe('runEnterAnimation', () => {
    it('should handle "none" preset by setting opacity', async () => {
      const element = document.createElement('div');

      await service.runEnterAnimation(element, 'bottom-right', 'none');

      expect(element.style.opacity).toBe('1');
    });

    it('should call custom enter animation when provided', async () => {
      const element = document.createElement('div');
      const customEnter = vi.fn();
      const custom = { enter: customEnter, leave: vi.fn() };

      await service.runEnterAnimation(element, 'bottom-right', 'slide', custom);

      expect(customEnter).toHaveBeenCalledWith(element);
    });

    it('should await async custom animation', async () => {
      const element = document.createElement('div');
      let resolved = false;
      const customEnter = vi.fn().mockImplementation(async () => {
        await new Promise((r) => setTimeout(r, 10));
        resolved = true;
      });
      const custom = { enter: customEnter, leave: vi.fn() };

      await service.runEnterAnimation(element, 'bottom-right', 'slide', custom);

      expect(resolved).toBe(true);
    });

    it('should not throw for any preset', async () => {
      const element = document.createElement('div');
      element.animate = vi.fn().mockReturnValue({
        finished: Promise.resolve(),
      });

      await expect(
        service.runEnterAnimation(element, 'bottom-right', 'slide')
      ).resolves.toBeUndefined();

      await expect(
        service.runEnterAnimation(element, 'bottom-right', 'fade')
      ).resolves.toBeUndefined();

      await expect(
        service.runEnterAnimation(element, 'bottom-right', 'bounce')
      ).resolves.toBeUndefined();
    });
  });

  // ==========================================================================
  // Leave Animation Tests
  // ==========================================================================

  describe('runLeaveAnimation', () => {
    it('should handle "none" preset by setting opacity', async () => {
      const element = document.createElement('div');

      await service.runLeaveAnimation(element, 'bottom-right', 'none');

      expect(element.style.opacity).toBe('0');
    });

    it('should call custom leave animation when provided', async () => {
      const element = document.createElement('div');
      const customLeave = vi.fn();
      const custom = { enter: vi.fn(), leave: customLeave };

      await service.runLeaveAnimation(element, 'bottom-right', 'slide', custom);

      expect(customLeave).toHaveBeenCalledWith(element);
    });

    it('should not throw for any preset', async () => {
      const element = document.createElement('div');
      element.animate = vi.fn().mockReturnValue({
        finished: Promise.resolve(),
      });

      await expect(
        service.runLeaveAnimation(element, 'bottom-right', 'slide')
      ).resolves.toBeUndefined();

      await expect(
        service.runLeaveAnimation(element, 'bottom-right', 'fade')
      ).resolves.toBeUndefined();

      await expect(
        service.runLeaveAnimation(element, 'bottom-right', 'bounce')
      ).resolves.toBeUndefined();
    });
  });

  // ==========================================================================
  // Position Direction Mapping Tests
  // ==========================================================================

  describe('position-direction mapping', () => {
    it('should map all 6 positions correctly', () => {
      expect(service.getDirectionFromPosition('top-left')).toBe('left');
      expect(service.getDirectionFromPosition('top-center')).toBe('top');
      expect(service.getDirectionFromPosition('top-right')).toBe('right');
      expect(service.getDirectionFromPosition('bottom-left')).toBe('left');
      expect(service.getDirectionFromPosition('bottom-center')).toBe('bottom');
      expect(service.getDirectionFromPosition('bottom-right')).toBe('right');
    });
  });
});
