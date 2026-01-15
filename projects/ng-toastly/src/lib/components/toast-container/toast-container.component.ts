/**
 * Toast Container Component - Manages the toast stack and positioning.
 *
 * This component:
 * - Renders all visible toasts from ToastService
 * - Positions the toast stack based on configuration
 * - Provides ARIA live region for screen readers
 * - Handles hover-to-pause functionality
 */

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import {
  TOAST_CONTAINER_Z_INDEX,
  TOAST_SCREEN_OFFSET_PX,
  TOAST_STACK_GAP_PX,
  TOAST_ARIA_LIVE_POLITENESS,
  TOAST_CONTAINER_ROLE,
} from '../../constants/toast.constants';
import { ToastService } from '../../services/toast.service';
import { ToastPosition } from '../../types/toast.type';
import { ToastItemComponent } from '../toast-item/toast-item.component';

@Component({
  selector: 'toastly-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[style]': 'hostStyles()',
    '[attr.role]': 'containerRole',
    '[attr.aria-live]': 'ariaLivePoliteness',
    '[attr.aria-label]': '"Notifications"',
  },
  template: `
    @for (toast of filteredToasts(); track toast.id) {
      <toastly-item
        [toast]="toast"
        (mouseenter)="handleMouseEnter(toast.id)"
        (mouseleave)="handleMouseLeave(toast.id)"
      />
    }
  `,
  styles: `
    :host {
      position: fixed;
      display: flex;
      flex-direction: column;
      pointer-events: none;
      max-height: 100vh;
      overflow: hidden;
    }

    :host > * {
      pointer-events: auto;
    }

    /* Position: top-right */
    :host(.toastly-container--top-right) {
      top: 0;
      right: 0;
      align-items: flex-end;
    }

    /* Position: top-left */
    :host(.toastly-container--top-left) {
      top: 0;
      left: 0;
      align-items: flex-start;
    }

    /* Position: top-center */
    :host(.toastly-container--top-center) {
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      align-items: center;
    }

    /* Position: bottom-right */
    :host(.toastly-container--bottom-right) {
      bottom: 0;
      right: 0;
      align-items: flex-end;
      flex-direction: column-reverse;
    }

    /* Position: bottom-left */
    :host(.toastly-container--bottom-left) {
      bottom: 0;
      left: 0;
      align-items: flex-start;
      flex-direction: column-reverse;
    }

    /* Position: bottom-center */
    :host(.toastly-container--bottom-center) {
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      align-items: center;
      flex-direction: column-reverse;
    }
  `,
  imports: [ToastItemComponent],
})
export class ToastContainerComponent {
  protected readonly toastService = inject(ToastService);

  /**
   * Optional position override.
   * If not provided, uses the global configuration.
   */
  readonly position = input<ToastPosition | undefined>(undefined);

  /**
   * Optional custom CSS class for the container.
   */
  readonly styleClass = input<string>('');

  /**
   * ARIA constants for accessibility.
   */
  readonly containerRole = TOAST_CONTAINER_ROLE;
  readonly ariaLivePoliteness = TOAST_ARIA_LIVE_POLITENESS;

  /**
   * Resolved position, using input or global config.
   */
  readonly resolvedPosition = computed((): ToastPosition => {
    return this.position() ?? this.toastService.position();
  });

  /**
   * Filtered list of toasts that match this container's position.
   */
  readonly filteredToasts = computed(() => {
    const containerPosition = this.resolvedPosition();
    return this.toastService.visibleToasts().filter(
      (toast) => toast.position === containerPosition
    );
  });

  /**
   * Computed CSS classes for the host element.
   */
  readonly hostClasses = computed((): string => {
    const classes: string[] = ['toastly-container'];
    const pos = this.resolvedPosition();

    classes.push(`toastly-container--${pos}`);

    const customClass = this.styleClass();
    if (customClass) {
      classes.push(customClass);
    }

    return classes.join(' ');
  });

  /**
   * Computed inline styles for positioning.
   */
  readonly hostStyles = computed((): string => {
    const offset = TOAST_SCREEN_OFFSET_PX;
    const gap = TOAST_STACK_GAP_PX;
    const zIndex = TOAST_CONTAINER_Z_INDEX;

    return `z-index: ${zIndex}; padding: ${offset}px; gap: ${gap}px;`;
  });

  /**
   * Handles mouse enter on a toast item.
   * Pauses the auto-dismiss timer.
   */
  handleMouseEnter(toastId: string): void {
    this.toastService.pauseTimer(toastId);
  }

  /**
   * Handles mouse leave on a toast item.
   * Resumes the auto-dismiss timer.
   */
  handleMouseLeave(toastId: string): void {
    this.toastService.resumeTimer(toastId);
  }
}
