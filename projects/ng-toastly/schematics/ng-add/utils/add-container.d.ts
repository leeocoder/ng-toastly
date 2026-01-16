/**
 * Container addition utilities for Angular schematics.
 *
 * Adds <toastly-container /> to the AppComponent template.
 */
import { Tree } from '@angular-devkit/schematics';
import { ProjectDetectionResult } from './project-detection';
/**
 * Adds <toastly-container /> to the AppComponent.
 *
 * Handles both inline templates and external template files.
 */
export declare function addContainer(tree: Tree, detection: ProjectDetectionResult): void;
