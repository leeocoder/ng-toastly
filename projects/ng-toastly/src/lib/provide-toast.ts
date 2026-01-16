/**
 * Provider function for global toast configuration.
 *
 * Provides a convenient way to configure Toastly at the application level.
 *
 * @example
 * ```typescript
 * // app.config.ts
 * import { provideToastly } from 'ng-toastly';
 *
 * export const appConfig = {
 *   providers: [
 *     provideToastly({
 *       position: 'top-right',
 *       theme: 'dark',
 *       defaultDurationMs: 3000,
 *     }),
 *   ],
 * };
 * ```
 */

import { Provider } from '@angular/core';
import { TOAST_GLOBAL_CONFIG, ToastGlobalConfigPartial } from './types/toast-config.type';

/**
 * Provides global configuration for Toastly notifications.
 *
 * @param config - Partial configuration to override defaults
 * @returns Provider to be added to application providers array
 */
export function provideToastly(config: ToastGlobalConfigPartial = {}): Provider {
  return {
    provide: TOAST_GLOBAL_CONFIG,
    useValue: config,
  };
}
