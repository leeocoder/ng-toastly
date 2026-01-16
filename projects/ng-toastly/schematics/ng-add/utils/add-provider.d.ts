/**
 * Provider addition utilities for Angular schematics.
 *
 * Adds provideToastly() to the application configuration.
 */
import { Tree } from '@angular-devkit/schematics';
import { ProjectDetectionResult } from './project-detection';
/**
 * Position type for toast notifications.
 */
type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
/**
 * Adds provideToastly() to the app configuration.
 *
 * For standalone apps: modifies app.config.ts
 * For NgModule apps: modifies app.module.ts
 */
export declare function addProvider(tree: Tree, detection: ProjectDetectionResult, position: ToastPosition): void;
export {};
