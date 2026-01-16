/**
 * Tests for provideToastly function
 *
 * Verifies:
 * - Correct Provider structure returned
 * - Default config handling
 * - Partial config override
 */

import { TestBed } from '@angular/core/testing';
import { provideToastly } from './provide-toast';
import { TOAST_GLOBAL_CONFIG, ToastGlobalConfigPartial } from './types/toast-config.type';

describe('provideToastly', () => {
  // ==========================================================================
  // Basic Provider Tests
  // ==========================================================================

  describe('provider structure', () => {
    it('should return a valid Provider object', () => {
      const provider = provideToastly();

      expect(provider).toBeDefined();
      expect(provider).toHaveProperty('provide');
      expect(provider).toHaveProperty('useValue');
    });

    it('should use TOAST_GLOBAL_CONFIG as the injection token', () => {
      const provider = provideToastly() as { provide: unknown; useValue: unknown };

      expect(provider.provide).toBe(TOAST_GLOBAL_CONFIG);
    });
  });

  // ==========================================================================
  // Default Config Tests
  // ==========================================================================

  describe('default configuration', () => {
    it('should return empty object when no config provided', () => {
      const provider = provideToastly() as { provide: unknown; useValue: ToastGlobalConfigPartial };

      expect(provider.useValue).toEqual({});
    });

    it('should return empty object when called with undefined', () => {
      const provider = provideToastly(undefined) as { provide: unknown; useValue: ToastGlobalConfigPartial };

      expect(provider.useValue).toEqual({});
    });
  });

  // ==========================================================================
  // Custom Config Tests
  // ==========================================================================

  describe('custom configuration', () => {
    it('should pass through position config', () => {
      const config: ToastGlobalConfigPartial = { position: 'top-left' };
      const provider = provideToastly(config) as { provide: unknown; useValue: ToastGlobalConfigPartial };

      expect(provider.useValue.position).toBe('top-left');
    });

    it('should pass through theme config', () => {
      const config: ToastGlobalConfigPartial = { theme: 'dark' };
      const provider = provideToastly(config) as { provide: unknown; useValue: ToastGlobalConfigPartial };

      expect(provider.useValue.theme).toBe('dark');
    });

    it('should pass through defaultDurationMs config', () => {
      const config: ToastGlobalConfigPartial = { defaultDurationMs: 3000 };
      const provider = provideToastly(config) as { provide: unknown; useValue: ToastGlobalConfigPartial };

      expect(provider.useValue.defaultDurationMs).toBe(3000);
    });

    it('should pass through maximumVisibleToasts config', () => {
      const config: ToastGlobalConfigPartial = { maximumVisibleToasts: 10 };
      const provider = provideToastly(config) as { provide: unknown; useValue: ToastGlobalConfigPartial };

      expect(provider.useValue.maximumVisibleToasts).toBe(10);
    });

    it('should pass through newestOnTop config', () => {
      const config: ToastGlobalConfigPartial = { newestOnTop: false };
      const provider = provideToastly(config) as { provide: unknown; useValue: ToastGlobalConfigPartial };

      expect(provider.useValue.newestOnTop).toBe(false);
    });

    it('should pass through pauseOnHover config', () => {
      const config: ToastGlobalConfigPartial = { pauseOnHover: false };
      const provider = provideToastly(config) as { provide: unknown; useValue: ToastGlobalConfigPartial };

      expect(provider.useValue.pauseOnHover).toBe(false);
    });

    it('should pass through dismissibleByDefault config', () => {
      const config: ToastGlobalConfigPartial = { dismissibleByDefault: false };
      const provider = provideToastly(config) as { provide: unknown; useValue: ToastGlobalConfigPartial };

      expect(provider.useValue.dismissibleByDefault).toBe(false);
    });

    it('should pass through defaultType config', () => {
      const config: ToastGlobalConfigPartial = { defaultType: 'success' };
      const provider = provideToastly(config) as { provide: unknown; useValue: ToastGlobalConfigPartial };

      expect(provider.useValue.defaultType).toBe('success');
    });

    it('should pass through multiple config options', () => {
      const config: ToastGlobalConfigPartial = {
        position: 'top-center',
        theme: 'dark',
        defaultDurationMs: 2000,
        pauseOnHover: false,
      };
      const provider = provideToastly(config) as { provide: unknown; useValue: ToastGlobalConfigPartial };

      expect(provider.useValue).toEqual(config);
    });
  });

  // ==========================================================================
  // Integration Tests
  // ==========================================================================

  describe('integration with TestBed', () => {
    afterEach(() => {
      TestBed.resetTestingModule();
    });

    it('should be injectable via TestBed.configureTestingModule', () => {
      TestBed.configureTestingModule({
        providers: [provideToastly({ position: 'top-right' })],
      });

      const config = TestBed.inject(TOAST_GLOBAL_CONFIG);

      expect(config).toBeDefined();
      expect(config?.position).toBe('top-right');
    });

    it('should allow multiple config properties to be injected', () => {
      TestBed.configureTestingModule({
        providers: [
          provideToastly({
            theme: 'dark',
            defaultDurationMs: 1000,
            newestOnTop: false,
          }),
        ],
      });

      const config = TestBed.inject(TOAST_GLOBAL_CONFIG);

      expect(config?.theme).toBe('dark');
      expect(config?.defaultDurationMs).toBe(1000);
      expect(config?.newestOnTop).toBe(false);
    });
  });
});
