/**
 * Toast Service - Central state management for toast notifications.
 *
 * Uses Angular signals for reactive state management.
 * Ensures memory safety with proper timer cleanup via DestroyRef.
 *
 * @example
 * ```typescript
 * const toastService = inject(ToastService);
 * toastService.success('Operation completed successfully!');
 * ```
 */

import {
  computed,
  DestroyRef,
  inject,
  Injectable,
  signal,
} from '@angular/core';
import {
  DEFAULT_TOAST_CONFIG,
  PROGRESS_MAXIMUM_PERCENT,
  PROGRESS_MINIMUM_PERCENT,
  TOAST_ID_PREFIX,
  TOAST_MINIMUM_DURATION_MS,
} from '../constants/toast.constants';
import { TOAST_GLOBAL_CONFIG, ToastGlobalConfig } from '../types/toast-config.type';
import { createToastError, TOAST_ERROR_MESSAGES } from '../types/toast-error.type';
import { Toast, ToastPayload, ToastType } from '../types/toast.type';

/**
 * Service for managing toast notifications throughout the application.
 *
 * Features:
 * - Signal-based reactive state
 * - Automatic timer cleanup on service destruction
 * - Configurable global defaults
 * - Type-safe public API
 */
@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly globalConfig: ToastGlobalConfig;

  /**
   * Internal counter for generating unique toast IDs.
   */
  private toastIdCounter = 0;

  /**
   * Map of active auto-dismiss timers.
   * Key: toast ID, Value: timer reference
   */
  private readonly activeTimers = new Map<string, ReturnType<typeof setTimeout>>();

  /**
   * Internal writeable signal containing all active toasts.
   */
  private readonly toastsSignal = signal<readonly Toast[]>([]);

  /**
   * Readonly signal exposing all active toasts.
   */
  readonly toasts = this.toastsSignal.asReadonly();

  /**
   * Computed signal returning only the visible toasts based on configuration.
   */
  readonly visibleToasts = computed<readonly Toast[]>(() => {
    const allToasts = this.toastsSignal();
    const maxVisible = this.globalConfig.maximumVisibleToasts;

    if (this.globalConfig.newestOnTop) {
      return allToasts.slice(0, maxVisible);
    }

    return allToasts.slice(-maxVisible);
  });

  /**
   * Current position setting for the toast container.
   */
  readonly position = computed(() => this.globalConfig.position);

  constructor() {
    // Merge provided config with defaults
    const providedConfig = inject(TOAST_GLOBAL_CONFIG, { optional: true });
    this.globalConfig = { ...DEFAULT_TOAST_CONFIG, ...providedConfig };

    // Register cleanup callback on service destruction
    this.destroyRef.onDestroy(() => {
      this.clearAllTimers();
    });
  }

  // ==========================================================================
  // PUBLIC API - Convenience Methods
  // ==========================================================================

  /**
   * Shows an informational toast notification.
   *
   * @param message - The message to display
   * @param options - Additional toast options
   * @returns The unique ID of the created toast
   */
  info(message: string, options?: Omit<ToastPayload, 'message' | 'type'>): string {
    return this.show({ ...options, message, type: 'info' });
  }

  /**
   * Shows a success toast notification.
   *
   * @param message - The message to display
   * @param options - Additional toast options
   * @returns The unique ID of the created toast
   */
  success(message: string, options?: Omit<ToastPayload, 'message' | 'type'>): string {
    return this.show({ ...options, message, type: 'success' });
  }

  /**
   * Shows a warning toast notification.
   *
   * @param message - The message to display
   * @param options - Additional toast options
   * @returns The unique ID of the created toast
   */
  warning(message: string, options?: Omit<ToastPayload, 'message' | 'type'>): string {
    return this.show({ ...options, message, type: 'warning' });
  }

  /**
   * Shows a danger/error toast notification.
   *
   * @param message - The message to display
   * @param options - Additional toast options
   * @returns The unique ID of the created toast
   */
  danger(message: string, options?: Omit<ToastPayload, 'message' | 'type'>): string {
    return this.show({ ...options, message, type: 'danger' });
  }

  // ==========================================================================
  // PUBLIC API - Core Methods
  // ==========================================================================

  /**
   * Shows a toast notification with the provided payload.
   *
   * @param payload - Configuration for the toast
   * @returns The unique ID of the created toast
   * @throws ToastError if validation fails
   */
  show(payload: ToastPayload): string {
    this.validatePayload(payload);

    const toast = this.createToastFromPayload(payload);

    this.addToast(toast);
    this.scheduleAutoDismissIfNeeded(toast);

    return toast.id;
  }

  /**
   * Dismisses a specific toast by its ID.
   *
   * @param toastId - The unique ID of the toast to dismiss
   */
  dismiss(toastId: string): void {
    this.clearTimerForToast(toastId);
    this.removeToast(toastId);
  }

  /**
   * Dismisses all currently active toasts.
   */
  dismissAll(): void {
    this.clearAllTimers();
    this.toastsSignal.set([]);
  }

  /**
   * Updates the progress value of a specific toast.
   *
   * @param toastId - The unique ID of the toast
   * @param progressPercent - New progress value (0-100)
   */
  updateProgress(toastId: string, progressPercent: number): void {
    this.validateProgressValue(progressPercent);

    this.toastsSignal.update((toasts) =>
      toasts.map((toast) =>
        toast.id === toastId ? { ...toast, progressPercent } : toast
      )
    );
  }

  /**
   * Pauses the auto-dismiss timer for a specific toast.
   * Useful for hover interactions.
   *
   * @param toastId - The unique ID of the toast
   */
  pauseTimer(toastId: string): void {
    this.clearTimerForToast(toastId);
  }

  /**
   * Resumes the auto-dismiss timer for a specific toast.
   *
   * @param toastId - The unique ID of the toast
   */
  resumeTimer(toastId: string): void {
    const toast = this.toastsSignal().find((t) => t.id === toastId);
    if (toast && toast.durationMs > 0) {
      this.scheduleAutoDismissIfNeeded(toast);
    }
  }

  // ==========================================================================
  // PRIVATE - Validation
  // ==========================================================================

  private validatePayload(payload: ToastPayload): void {
    if (payload.durationMs !== undefined && payload.durationMs < 0) {
      throw createToastError(
        'INVALID_DURATION',
        TOAST_ERROR_MESSAGES.INVALID_DURATION,
        `Received: ${payload.durationMs}ms`
      );
    }

    if (payload.progressPercent !== undefined) {
      this.validateProgressValue(payload.progressPercent);
    }
  }

  private validateProgressValue(progressPercent: number): void {
    const isValidProgress =
      progressPercent >= PROGRESS_MINIMUM_PERCENT &&
      progressPercent <= PROGRESS_MAXIMUM_PERCENT;

    if (!isValidProgress) {
      throw createToastError(
        'INVALID_PROGRESS_VALUE',
        TOAST_ERROR_MESSAGES.INVALID_PROGRESS_VALUE,
        `Received: ${progressPercent}%`
      );
    }
  }

  // ==========================================================================
  // PRIVATE - Toast Creation
  // ==========================================================================

  private createToastFromPayload(payload: ToastPayload): Toast {
    const toastId = this.generateToastId();
    const toastType: ToastType = payload.type ?? this.globalConfig.defaultType;
    const durationMs = this.resolveDuration(payload.durationMs);

    // Resolve position: Payload > Global Config
    const position = payload.position ?? this.globalConfig.position;

    return {
      id: toastId,
      createdAt: Date.now(),
      message: payload.message,
      title: payload.title,
      type: toastType,
      theme: payload.theme ?? this.globalConfig.theme,
      durationMs,
      dismissible: payload.dismissible ?? this.globalConfig.dismissibleByDefault,
      actions: payload.actions ?? [],
      styleClass: payload.styleClass,
      iconTemplate: payload.iconTemplate,
      avatarUrl: payload.avatarUrl,
      progressPercent: payload.progressPercent,
      position,
    };
  }

  private generateToastId(): string {
    this.toastIdCounter += 1;
    return `${TOAST_ID_PREFIX}${Date.now()}-${this.toastIdCounter}`;
  }

  private resolveDuration(providedDurationMs: number | undefined): number {
    if (providedDurationMs === undefined) {
      return this.globalConfig.defaultDurationMs;
    }

    if (providedDurationMs === 0) {
      return 0; // Explicit "no auto-dismiss"
    }

    return Math.max(providedDurationMs, TOAST_MINIMUM_DURATION_MS);
  }

  // ==========================================================================
  // PRIVATE - Toast Collection Management
  // ==========================================================================

  private addToast(toast: Toast): void {
    this.toastsSignal.update((currentToasts) => {
      if (this.globalConfig.newestOnTop) {
        return [toast, ...currentToasts];
      }
      return [...currentToasts, toast];
    });
  }

  private removeToast(toastId: string): void {
    this.toastsSignal.update((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== toastId)
    );
  }

  // ==========================================================================
  // PRIVATE - Timer Management (Memory Safety)
  // ==========================================================================

  private scheduleAutoDismissIfNeeded(toast: Toast): void {
    if (toast.durationMs <= 0) {
      return; // No auto-dismiss
    }

    const timerId = setTimeout(() => {
      this.dismiss(toast.id);
    }, toast.durationMs);

    this.activeTimers.set(toast.id, timerId);
  }

  private clearTimerForToast(toastId: string): void {
    const timerId = this.activeTimers.get(toastId);
    if (timerId !== undefined) {
      clearTimeout(timerId);
      this.activeTimers.delete(toastId);
    }
  }

  private clearAllTimers(): void {
    this.activeTimers.forEach((timerId) => {
      clearTimeout(timerId);
    });
    this.activeTimers.clear();
  }
}
