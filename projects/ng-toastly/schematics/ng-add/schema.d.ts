/**
 * Schema interface for ng-add schematic options.
 */
export interface Schema {
  /**
   * The name of the project to add ng-toastly to.
   */
  project?: string;

  /**
   * Default position for toasts.
   * @default 'bottom-right'
   */
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

  /**
   * Skip adding the ToastContainerComponent to AppComponent.
   * @default false
   */
  skipContainer?: boolean;
}
