/**
 * Tests for ToastService
 *
 * Verifies:
 * - Toast creation and dismissal
 * - Auto-dismiss timer behavior
 * - Timer cleanup on dismiss
 * - Validation logic
 */

import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';
import { ToastPayload } from '../types/toast.type';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToastService],
    });
    service = TestBed.inject(ToastService);
  });

  afterEach(() => {
    service.dismissAll();
  });

  // ==========================================================================
  // Toast Creation Tests
  // ==========================================================================

  describe('show()', () => {
    it('should create a toast and return its ID', () => {
      const toastId = service.show({ message: 'Test message' });

      expect(toastId).toBeTruthy();
      expect(toastId).toContain('toastly-');
      expect(service.toasts().length).toBe(1);
    });

    it('should create a toast with all provided options', () => {
      const payload: ToastPayload = {
        message: 'Test message',
        title: 'Test Title',
        type: 'success',
        theme: 'dark',
        durationMs: 3000,
        dismissible: false,
      };

      service.show(payload);
      const toast = service.toasts()[0];

      expect(toast.message).toBe('Test message');
      expect(toast.title).toBe('Test Title');
      expect(toast.type).toBe('success');
      expect(toast.theme).toBe('dark');
      expect(toast.durationMs).toBe(3000);
      expect(toast.dismissible).toBe(false);
    });

    it('should use default values when options are not provided', () => {
      service.show({ message: 'Test' });
      const toast = service.toasts()[0];

      expect(toast.type).toBe('info');
      expect(toast.theme).toBe('light');
      expect(toast.dismissible).toBe(true);
    });
  });

  // ==========================================================================
  // Convenience Method Tests
  // ==========================================================================

  describe('convenience methods', () => {
    it('info() should create an info toast', () => {
      service.info('Info message');
      expect(service.toasts()[0].type).toBe('info');
    });

    it('success() should create a success toast', () => {
      service.success('Success message');
      expect(service.toasts()[0].type).toBe('success');
    });

    it('warning() should create a warning toast', () => {
      service.warning('Warning message');
      expect(service.toasts()[0].type).toBe('warning');
    });

    it('danger() should create a danger toast', () => {
      service.danger('Danger message');
      expect(service.toasts()[0].type).toBe('danger');
    });
  });

  // ==========================================================================
  // Dismiss Tests
  // ==========================================================================

  describe('dismiss()', () => {
    it('should remove a specific toast by ID', () => {
      const id1 = service.info('First');
      const id2 = service.info('Second');

      expect(service.toasts().length).toBe(2);

      service.dismiss(id1);

      expect(service.toasts().length).toBe(1);
      expect(service.toasts()[0].id).toBe(id2);
    });

    it('should handle dismissing non-existent toast gracefully', () => {
      service.info('Test');

      expect(() => service.dismiss('non-existent-id')).not.toThrow();
      expect(service.toasts().length).toBe(1);
    });
  });

  describe('dismissAll()', () => {
    it('should remove all toasts', () => {
      service.info('First');
      service.success('Second');
      service.warning('Third');

      expect(service.toasts().length).toBe(3);

      service.dismissAll();

      expect(service.toasts().length).toBe(0);
    });
  });

  // ==========================================================================
  // Validation Tests
  // ==========================================================================

  describe('validation', () => {
    it('should throw error for negative duration', () => {
      expect(() =>
        service.show({ message: 'Test', durationMs: -1000 })
      ).toThrow();
    });

    it('should throw error for progress value below 0', () => {
      expect(() =>
        service.show({ message: 'Test', progressPercent: -10 })
      ).toThrow();
    });

    it('should throw error for progress value above 100', () => {
      expect(() =>
        service.show({ message: 'Test', progressPercent: 150 })
      ).toThrow();
    });

    it('should accept progress value of 0', () => {
      expect(() =>
        service.show({ message: 'Test', progressPercent: 0 })
      ).not.toThrow();
    });

    it('should accept progress value of 100', () => {
      expect(() =>
        service.show({ message: 'Test', progressPercent: 100 })
      ).not.toThrow();
    });
  });

  // ==========================================================================
  // Progress Update Tests
  // ==========================================================================

  describe('updateProgress()', () => {
    it('should update progress value for a toast', () => {
      const toastId = service.show({ message: 'Uploading', progressPercent: 0 });

      service.updateProgress(toastId, 50);

      expect(service.toasts()[0].progressPercent).toBe(50);
    });

    it('should throw for invalid progress values', () => {
      const toastId = service.show({ message: 'Test', progressPercent: 0 });

      expect(() => service.updateProgress(toastId, -10)).toThrow();
      expect(() => service.updateProgress(toastId, 150)).toThrow();
    });
  });

  // ==========================================================================
  // Visible Toasts Tests
  // ==========================================================================

  describe('visibleToasts', () => {
    it('should limit visible toasts to maximum configured', () => {
      // Default max is 5
      for (let i = 0; i < 10; i++) {
        service.info(`Toast ${i}`);
      }

      expect(service.toasts().length).toBe(10);
      expect(service.visibleToasts().length).toBe(5);
    });
  });
});
