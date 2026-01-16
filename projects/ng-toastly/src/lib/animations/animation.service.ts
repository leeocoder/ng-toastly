/**
 * Animation Service - Manages toast enter/leave animations.
 *
 * Features:
 * - Preset animations (slide, fade, bounce)
 * - Custom animation callbacks
 * - Respects prefers-reduced-motion
 * - CSS variable overrides
 */

import { Injectable, signal } from '@angular/core';
import {
  AnimationPreset,
  AnimationDirection,
  CustomAnimation,
  AnimationPresetDefinition,
} from './animation.types';
import {
  ANIMATION_DEFAULT_DURATION_MS,
  ANIMATION_DEFAULT_EASING,
  ANIMATION_REDUCED_MOTION_DURATION_MS,
  DEFAULT_ANIMATION_PRESET,
  REDUCED_MOTION_PRESET,
} from './animation.constants';
import { slideAnimation } from './presets/slide.animation';
import { fadeAnimation } from './presets/fade.animation';
import { bounceAnimation } from './presets/bounce.animation';
import { ToastPosition } from '../types/toast.type';

/**
 * Map of preset names to their definitions.
 */
const PRESET_MAP: Readonly<Record<AnimationPreset, AnimationPresetDefinition | null>> = {
  slide: slideAnimation,
  fade: fadeAnimation,
  bounce: bounceAnimation,
  none: null,
};

/**
 * Service for managing toast animations.
 */
@Injectable({
  providedIn: 'root',
})
export class AnimationService {
  /**
   * Whether the user prefers reduced motion.
   */
  private readonly prefersReducedMotion = signal(this.detectReducedMotion());

  /**
   * Detects if the user prefers reduced motion.
   */
  private detectReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;
    if (typeof window.matchMedia !== 'function') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Gets the animation direction based on toast position.
   */
  getDirectionFromPosition(position: ToastPosition): AnimationDirection {
    if (position.includes('left')) return 'left';
    if (position.includes('right')) return 'right';
    if (position.startsWith('top')) return 'top';
    return 'bottom';
  }

  /**
   * Runs the enter animation for a toast element.
   *
   * @param element - The toast's HTMLElement
   * @param position - Toast position for direction
   * @param preset - Animation preset to use
   * @param custom - Optional custom animation
   * @param durationMs - Override duration
   * @param easing - Override easing
   * @returns Promise that resolves when animation completes
   */
  async runEnterAnimation(
    element: HTMLElement,
    position: ToastPosition,
    preset: AnimationPreset = DEFAULT_ANIMATION_PRESET,
    custom?: CustomAnimation,
    durationMs?: number,
    easing?: string
  ): Promise<void> {
    // Handle custom animation
    if (custom?.enter) {
      await custom.enter(element);
      return;
    }

    // Handle reduced motion
    const effectivePreset = this.prefersReducedMotion() ? REDUCED_MOTION_PRESET : preset;

    // Handle 'none' preset
    if (effectivePreset === 'none') {
      element.style.opacity = '1';
      return;
    }

    const presetDef = PRESET_MAP[effectivePreset];
    if (!presetDef) {
      element.style.opacity = '1';
      return;
    }

    const direction = this.getDirectionFromPosition(position);
    const duration = this.prefersReducedMotion()
      ? ANIMATION_REDUCED_MOTION_DURATION_MS
      : (durationMs ?? ANIMATION_DEFAULT_DURATION_MS);
    const easingValue = easing ?? ANIMATION_DEFAULT_EASING;

    const animation = presetDef.enter(element, direction, duration, easingValue);

    if (animation?.finished) {
      await animation.finished;
    }
  }

  /**
   * Runs the leave animation for a toast element.
   *
   * @param element - The toast's HTMLElement
   * @param position - Toast position for direction
   * @param preset - Animation preset to use
   * @param custom - Optional custom animation
   * @param durationMs - Override duration
   * @param easing - Override easing
   * @returns Promise that resolves when animation completes
   */
  async runLeaveAnimation(
    element: HTMLElement,
    position: ToastPosition,
    preset: AnimationPreset = DEFAULT_ANIMATION_PRESET,
    custom?: CustomAnimation,
    durationMs?: number,
    easing?: string
  ): Promise<void> {
    // Handle custom animation
    if (custom?.leave) {
      await custom.leave(element);
      return;
    }

    // Handle reduced motion
    const effectivePreset = this.prefersReducedMotion() ? REDUCED_MOTION_PRESET : preset;

    // Handle 'none' preset
    if (effectivePreset === 'none') {
      element.style.opacity = '0';
      return;
    }

    const presetDef = PRESET_MAP[effectivePreset];
    if (!presetDef) {
      element.style.opacity = '0';
      return;
    }

    const direction = this.getDirectionFromPosition(position);
    const duration = this.prefersReducedMotion()
      ? ANIMATION_REDUCED_MOTION_DURATION_MS
      : (durationMs ?? ANIMATION_DEFAULT_DURATION_MS);
    const easingValue = easing ?? ANIMATION_DEFAULT_EASING;

    const animation = presetDef.leave(element, direction, duration, easingValue);

    if (animation?.finished) {
      await animation.finished;
    }
  }

  /**
   * Checks if animations are currently disabled.
   */
  isReducedMotion(): boolean {
    return this.prefersReducedMotion();
  }
}
