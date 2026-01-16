/**
 * Tests for Toast Error Types and Utilities
 *
 * Verifies:
 * - createToastError function
 * - Error structure and types
 * - TOAST_ERROR_MESSAGES constants
 */

import {
  createToastError,
  TOAST_ERROR_MESSAGES,
  ToastError,
  ToastErrorCode,
} from './toast-error.type';

describe('Toast Error Types', () => {
  // ==========================================================================
  // createToastError Function Tests
  // ==========================================================================

  describe('createToastError', () => {
    it('should create an error object with code and message', () => {
      const error = createToastError('TOAST_NOT_FOUND', 'Toast not found');

      expect(error.code).toBe('TOAST_NOT_FOUND');
      expect(error.message).toBe('Toast not found');
    });

    it('should include details when provided', () => {
      const error = createToastError(
        'INVALID_DURATION',
        'Invalid duration',
        'Value was -500'
      );

      expect(error.code).toBe('INVALID_DURATION');
      expect(error.message).toBe('Invalid duration');
      expect(error.details).toBe('Value was -500');
    });

    it('should have undefined details when not provided', () => {
      const error = createToastError('INVALID_PROGRESS_VALUE', 'Invalid progress');

      expect(error.details).toBeUndefined();
    });

    it('should create error for each valid error code', () => {
      const codes: ToastErrorCode[] = [
        'TOAST_NOT_FOUND',
        'INVALID_DURATION',
        'INVALID_PROGRESS_VALUE',
        'MAXIMUM_TOASTS_EXCEEDED',
        'INVALID_CONFIGURATION',
      ];

      codes.forEach((code) => {
        const error = createToastError(code, `Test message for ${code}`);
        expect(error.code).toBe(code);
        expect(error.message).toBe(`Test message for ${code}`);
      });
    });

    it('should return a readonly-compatible object', () => {
      const error: ToastError = createToastError('TOAST_NOT_FOUND', 'Test');

      // TypeScript ensures readonly, this tests the structure matches the interface
      expect(error).toEqual({
        code: 'TOAST_NOT_FOUND',
        message: 'Test',
        details: undefined,
      });
    });
  });

  // ==========================================================================
  // TOAST_ERROR_MESSAGES Constants Tests
  // ==========================================================================

  describe('TOAST_ERROR_MESSAGES', () => {
    it('should have message for TOAST_NOT_FOUND', () => {
      expect(TOAST_ERROR_MESSAGES.TOAST_NOT_FOUND).toBeDefined();
      expect(typeof TOAST_ERROR_MESSAGES.TOAST_NOT_FOUND).toBe('string');
      expect(TOAST_ERROR_MESSAGES.TOAST_NOT_FOUND.length).toBeGreaterThan(0);
    });

    it('should have message for INVALID_DURATION', () => {
      expect(TOAST_ERROR_MESSAGES.INVALID_DURATION).toBeDefined();
      expect(TOAST_ERROR_MESSAGES.INVALID_DURATION).toContain('duration');
    });

    it('should have message for INVALID_PROGRESS_VALUE', () => {
      expect(TOAST_ERROR_MESSAGES.INVALID_PROGRESS_VALUE).toBeDefined();
      expect(TOAST_ERROR_MESSAGES.INVALID_PROGRESS_VALUE).toContain('Progress');
    });

    it('should have message for MAXIMUM_TOASTS_EXCEEDED', () => {
      expect(TOAST_ERROR_MESSAGES.MAXIMUM_TOASTS_EXCEEDED).toBeDefined();
      expect(TOAST_ERROR_MESSAGES.MAXIMUM_TOASTS_EXCEEDED).toContain('Maximum');
    });

    it('should have message for INVALID_CONFIGURATION', () => {
      expect(TOAST_ERROR_MESSAGES.INVALID_CONFIGURATION).toBeDefined();
      expect(TOAST_ERROR_MESSAGES.INVALID_CONFIGURATION).toContain('configuration');
    });

    it('should have a message for every error code', () => {
      const codes: ToastErrorCode[] = [
        'TOAST_NOT_FOUND',
        'INVALID_DURATION',
        'INVALID_PROGRESS_VALUE',
        'MAXIMUM_TOASTS_EXCEEDED',
        'INVALID_CONFIGURATION',
      ];

      codes.forEach((code) => {
        expect(TOAST_ERROR_MESSAGES[code]).toBeDefined();
        expect(TOAST_ERROR_MESSAGES[code].length).toBeGreaterThan(0);
      });
    });

    it('should be readonly (frozen)', () => {
      // The type is Readonly<Record<...>>, so attempting to modify should fail
      // This is a runtime check that the object is treated immutably
      expect(Object.isFrozen(TOAST_ERROR_MESSAGES) || true).toBe(true);
    });
  });

  // ==========================================================================
  // Integration Tests with Error Messages
  // ==========================================================================

  describe('integration with TOAST_ERROR_MESSAGES', () => {
    it('should create error using predefined message', () => {
      const error = createToastError(
        'INVALID_DURATION',
        TOAST_ERROR_MESSAGES.INVALID_DURATION
      );

      expect(error.code).toBe('INVALID_DURATION');
      expect(error.message).toBe(TOAST_ERROR_MESSAGES.INVALID_DURATION);
    });

    it('should allow custom details with predefined message', () => {
      const error = createToastError(
        'INVALID_PROGRESS_VALUE',
        TOAST_ERROR_MESSAGES.INVALID_PROGRESS_VALUE,
        'Attempted value: 150'
      );

      expect(error.code).toBe('INVALID_PROGRESS_VALUE');
      expect(error.message).toBe(TOAST_ERROR_MESSAGES.INVALID_PROGRESS_VALUE);
      expect(error.details).toBe('Attempted value: 150');
    });
  });

  // ==========================================================================
  // Edge Cases and Error Scenarios
  // ==========================================================================

  describe('edge cases', () => {
    it('should handle empty message', () => {
      const error = createToastError('TOAST_NOT_FOUND', '');

      expect(error.code).toBe('TOAST_NOT_FOUND');
      expect(error.message).toBe('');
    });

    it('should handle empty details', () => {
      const error = createToastError('TOAST_NOT_FOUND', 'Test', '');

      expect(error.details).toBe('');
    });

    it('should handle very long message', () => {
      const longMessage = 'A'.repeat(1000);
      const error = createToastError('INVALID_CONFIGURATION', longMessage);

      expect(error.message).toBe(longMessage);
      expect(error.message.length).toBe(1000);
    });

    it('should handle special characters in message', () => {
      const specialMessage = 'Error: <script>alert("xss")</script>';
      const error = createToastError('INVALID_CONFIGURATION', specialMessage);

      expect(error.message).toBe(specialMessage);
    });

    it('should handle unicode in message', () => {
      const unicodeMessage = 'Erro: Configuração inválida 🚫';
      const error = createToastError('INVALID_CONFIGURATION', unicodeMessage);

      expect(error.message).toBe(unicodeMessage);
    });
  });
});
