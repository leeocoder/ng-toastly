/**
 * Project detection utilities for Angular schematics.
 *
 * Detects whether the project uses standalone (bootstrapApplication)
 * or NgModule (bootstrapModule) architecture.
 */
import { Tree } from '@angular-devkit/schematics';
import { workspaces } from '@angular-devkit/core';
/**
 * Project architecture type.
 */
export type ProjectType = 'standalone' | 'ngmodule' | 'unknown';
/**
 * Result of project detection.
 */
export interface ProjectDetectionResult {
    type: ProjectType;
    mainFilePath: string;
    appConfigPath?: string;
    appModulePath?: string;
    appComponentPath: string;
}
/**
 * Detects the project architecture type.
 *
 * Checks for:
 * - bootstrapApplication in main.ts (standalone)
 * - bootstrapModule in main.ts (NgModule)
 */
export declare function detectProjectType(tree: Tree, project: workspaces.ProjectDefinition): ProjectDetectionResult;
/**
 * Finds the app.config.ts file path.
 * Returns the path from main.ts import if available.
 */
export declare function findAppConfigPath(tree: Tree, mainFilePath: string): string | undefined;
/**
 * Checks if provideToastly is already configured.
 */
export declare function isToastlyConfigured(tree: Tree, filePath: string): boolean;
/**
 * Checks if ToastContainerComponent is already in a template.
 */
export declare function isContainerPresent(tree: Tree, componentPath: string): boolean;
