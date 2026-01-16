/**
 * Toast Item Component - Individual toast notification display.
 *
 * Renders a single toast with:
 * - Icon or avatar
 * - Title and message
 * - Optional action buttons
 * - Optional progress bar
 * - Close button (if dismissible)
 *
 * Supports full customization via CSS variables and class inputs.
 */

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { TOAST_ANIMATION_DURATION_MS, TOAST_ITEM_ROLES } from '../../constants/toast.constants';
import { Toast, ToastAction } from '../../types/toast.type';
import { ToastService } from '../../services/toast.service';
import { NgTemplateOutlet } from '@angular/common';

/**
 * Default icon SVG paths for each toast type.
 * Used when no custom icon template is provided.
 */
const TOAST_TYPE_ICON_PATHS: Readonly<Record<string, string>> = {
  info: 'M12 16v-4m0-4h.01M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z',
  success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  danger: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
};

@Component({
  selector: 'toastly-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[attr.role]': 'ariaRole()',
    '[attr.aria-live]': '"polite"',
    '[style.--toastly-animation-duration]': 'animationDurationCssValue',
    '(mouseenter)': 'handleMouseEnter()',
    '(mouseleave)': 'handleMouseLeave()',
  },
  template: `
    <div class="toastly-item__content">
      <!-- Avatar or Icon -->
      @if (toast().avatarUrl) {
        <img
          [src]="toast().avatarUrl"
          [alt]="''"
          class="toastly-item__avatar"
          aria-hidden="true"
        />
      } @else if (toast().iconTemplate) {
        <div class="toastly-item__icon" aria-hidden="true">
          <ng-container *ngTemplateOutlet="toast().iconTemplate" />
        </div>
      } @else {
        <div class="toastly-item__icon toastly-item__icon--{{ toast().type }}" aria-hidden="true">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path [attr.d]="iconPath()" />
          </svg>
        </div>
      }

      <!-- Text Content -->
      <div class="toastly-item__text">
        @if (toast().title) {
          <div class="toastly-item__title">{{ toast().title }}</div>
        }
        <div class="toastly-item__message">{{ toast().message }}</div>
      </div>

      <!-- Close Button -->
      @if (toast().dismissible) {
        <button
          type="button"
          class="toastly-item__close"
          [attr.aria-label]="'Dismiss notification'"
          (click)="handleDismiss()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      }
    </div>

    <!-- Progress Bar -->
    @if (toast().progressPercent !== undefined) {
      <div class="toastly-item__progress-track" role="progressbar" [attr.aria-valuenow]="toast().progressPercent">
        <div
          class="toastly-item__progress-bar"
          [style.width.%]="toast().progressPercent"
        ></div>
      </div>
    }

    <!-- Action Buttons -->
    @if (hasActions()) {
      <div class="toastly-item__actions">
        @for (action of toast().actions; track action.label) {
          <button
            type="button"
            class="toastly-item__action toastly-item__action--{{ action.variant }}"
            (click)="handleActionClick(action)"
          >
            {{ action.label }}
          </button>
        }
      </div>
    }
  `,
  styles: `
    :host {
      --toastly-animation-duration: 300ms;

      display: block;
      width: 100%;
      max-width: 360px;
      background-color: var(--toastly-bg, #ffffff);
      color: var(--toastly-text, #18181b);
      border-radius: var(--toastly-radius, 12px);
      box-shadow: var(--toastly-shadow, 0 4px 12px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.05));
      overflow: hidden;
      animation: toastly-slide-in var(--toastly-animation-duration) ease-out;
    }

    :host(.toastly-item--dark) {
      --toastly-bg: #18181b;
      --toastly-text: #fafafa;
      --toastly-text-muted: #a1a1aa;
      --toastly-border: #3f3f46;
      --toastly-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    }

    :host(.toastly-item--exiting) {
      animation: toastly-slide-out var(--toastly-animation-duration) ease-in forwards;
    }

    @keyframes toastly-slide-in {
      from {
        opacity: 0;
        transform: translateX(100%);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes toastly-slide-out {
      from {
        opacity: 1;
        transform: translateX(0);
      }
      to {
        opacity: 0;
        transform: translateX(100%);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      :host {
        animation: none;
      }
      :host(.toastly-item--exiting) {
        animation: none;
        opacity: 0;
      }
    }

    .toastly-item__content {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: var(--toastly-padding, 16px);
    }

    .toastly-item__icon {
      flex-shrink: 0;
      width: 20px;
      height: 20px;
    }

    .toastly-item__icon svg {
      width: 100%;
      height: 100%;
    }

    .toastly-item__icon--info {
      color: var(--toastly-info, #7c3aed);
    }

    .toastly-item__icon--success {
      color: var(--toastly-success, #16a34a);
    }

    .toastly-item__icon--warning {
      color: var(--toastly-warning, #f59e0b);
    }

    .toastly-item__icon--danger {
      color: var(--toastly-danger, #dc2626);
    }

    .toastly-item__avatar {
      flex-shrink: 0;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }

    .toastly-item__text {
      flex: 1;
      min-width: 0;
    }

    .toastly-item__title {
      font-size: 14px;
      font-weight: 600;
      line-height: 1.4;
      margin-bottom: 2px;
    }

    .toastly-item__message {
      font-size: 14px;
      font-weight: 400;
      line-height: 1.4;
      color: var(--toastly-text-muted, #71717a);
    }

    .toastly-item__close {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      padding: 0;
      border: none;
      background: transparent;
      color: var(--toastly-text-muted, #71717a);
      cursor: pointer;
      border-radius: 4px;
      transition: background-color 150ms ease, color 150ms ease;
    }

    .toastly-item__close:hover {
      background-color: rgba(0, 0, 0, 0.05);
      color: var(--toastly-text, #18181b);
    }

    :host(.toastly-item--dark) .toastly-item__close:hover {
      background-color: rgba(255, 255, 255, 0.1);
      color: var(--toastly-text, #fafafa);
    }

    .toastly-item__close svg {
      width: 16px;
      height: 16px;
    }

    .toastly-item__progress-track {
      height: 4px;
      background-color: rgba(0, 0, 0, 0.1);
    }

    :host(.toastly-item--dark) .toastly-item__progress-track {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .toastly-item__progress-bar {
      height: 100%;
      background-color: var(--toastly-info, #7c3aed);
      transition: width 150ms ease;
    }

    .toastly-item__actions {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 var(--toastly-padding, 16px) var(--toastly-padding, 16px);
    }

    .toastly-item__action {
      font-size: 14px;
      font-weight: 500;
      padding: 6px 12px;
      border-radius: 6px;
      cursor: pointer;
      transition: background-color 150ms ease, color 150ms ease;
    }

    .toastly-item__action--primary {
      background-color: var(--toastly-text, #18181b);
      color: var(--toastly-bg, #ffffff);
      border: none;
    }

    .toastly-item__action--primary:hover {
      opacity: 0.9;
    }

    .toastly-item__action--secondary {
      background-color: transparent;
      color: var(--toastly-text, #18181b);
      border: 1px solid var(--toastly-border, #e4e4e7);
    }

    .toastly-item__action--secondary:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }

    :host(.toastly-item--dark) .toastly-item__action--primary {
      background-color: var(--toastly-text, #fafafa);
      color: var(--toastly-bg, #18181b);
    }

    :host(.toastly-item--dark) .toastly-item__action--secondary {
      color: var(--toastly-text, #fafafa);
      border-color: var(--toastly-border, #3f3f46);
    }

    :host(.toastly-item--dark) .toastly-item__action--secondary:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  `,
  imports: [NgTemplateOutlet],
})
export class ToastItemComponent {
  private readonly toastService = inject(ToastService);

  /**
   * The toast data to display.
   */
  readonly toast = input.required<Toast>();

  /**
   * Event emitted when the toast requests dismissal.
   */
  readonly dismissed = output<string>();

  /**
   * CSS value for animation duration.
   */
  readonly animationDurationCssValue = `${TOAST_ANIMATION_DURATION_MS}ms`;

  /**
   * Computed icon SVG path based on toast type.
   */
  readonly iconPath = computed((): string => {
    const toastType = this.toast().type;
    return TOAST_TYPE_ICON_PATHS[toastType] ?? TOAST_TYPE_ICON_PATHS['info'];
  });

  /**
   * Computed ARIA role based on toast type.
   */
  readonly ariaRole = computed((): string => {
    const toastType = this.toast().type;
    return TOAST_ITEM_ROLES[toastType] ?? 'status';
  });

  /**
   * Computed CSS classes for the host element.
   */
  readonly hostClasses = computed((): string => {
    const toast = this.toast();
    const classes: string[] = ['toastly-item'];

    classes.push(`toastly-item--${toast.type}`);
    classes.push(`toastly-item--${toast.theme}`);

    if (toast.styleClass) {
      classes.push(toast.styleClass);
    }

    return classes.join(' ');
  });

  /**
   * Whether the toast has action buttons.
   */
  readonly hasActions = computed((): boolean => {
    return this.toast().actions.length > 0;
  });

  /**
   * Handles the dismiss button click.
   */
  handleDismiss(): void {
    const toastId = this.toast().id;
    this.dismissed.emit(toastId);
    this.toastService.dismiss(toastId);
  }

  /**
   * Handles an action button click.
   */
  handleActionClick(action: ToastAction): void {
    action.onClick();
  }

  /**
   * Pauses auto-dismiss on mouse enter (if configured).
   */
  handleMouseEnter(): void {
    if (this.toastService.pauseOnHover()) {
      this.toastService.pauseTimer(this.toast().id);
    }
  }

  /**
   * Resumes auto-dismiss on mouse leave (if configured).
   */
  handleMouseLeave(): void {
    if (this.toastService.pauseOnHover()) {
      this.toastService.resumeTimer(this.toast().id);
    }
  }
}
