/**
 * Project detection utilities for Angular schematics.
 *
 * Detects whether the project uses standalone (bootstrapApplication)
 * or NgModule (bootstrapModule) architecture.
 */

import { Tree } from '@angular-devkit/schematics';
import { workspaces } from '@angular-devkit/core';
import { getSourceRoot } from './workspace';

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
export function detectProjectType(
  tree: Tree,
  project: workspaces.ProjectDefinition
): ProjectDetectionResult {
  const sourceRoot = getSourceRoot(project);
  const mainFilePath = `${sourceRoot}/main.ts`;
  const appConfigPath = `${sourceRoot}/app/app.config.ts`;
  const appModulePath = `${sourceRoot}/app/app.module.ts`;
  const appComponentPath = `${sourceRoot}/app/app.component.ts`;

  // Check if main.ts exists
  const mainContent = tree.read(mainFilePath);
  if (!mainContent) {
    return {
      type: 'unknown',
      mainFilePath,
      appComponentPath,
    };
  }

  const mainText = mainContent.toString('utf-8');

  // Check for standalone (bootstrapApplication)
  if (mainText.includes('bootstrapApplication')) {
    return {
      type: 'standalone',
      mainFilePath,
      appConfigPath: tree.exists(appConfigPath) ? appConfigPath : undefined,
      appComponentPath,
    };
  }

  // Check for NgModule (bootstrapModule)
  if (mainText.includes('bootstrapModule') || mainText.includes('platformBrowserDynamic')) {
    return {
      type: 'ngmodule',
      mainFilePath,
      appModulePath: tree.exists(appModulePath) ? appModulePath : undefined,
      appComponentPath,
    };
  }

  return {
    type: 'unknown',
    mainFilePath,
    appComponentPath,
  };
}

/**
 * Finds the app.config.ts file path.
 * Returns the path from main.ts import if available.
 */
export function findAppConfigPath(tree: Tree, mainFilePath: string): string | undefined {
  const mainContent = tree.read(mainFilePath);
  if (!mainContent) return undefined;

  const mainText = mainContent.toString('utf-8');

  // Look for import from app.config
  const configImportMatch = mainText.match(/import\s*{[^}]*}\s*from\s*['"]\.\/app\/app\.config['"]/);
  if (configImportMatch) {
    const dir = mainFilePath.substring(0, mainFilePath.lastIndexOf('/'));
    return `${dir}/app/app.config.ts`;
  }

  return undefined;
}

/**
 * Checks if provideToastly is already configured.
 */
export function isToastlyConfigured(tree: Tree, filePath: string): boolean {
  const content = tree.read(filePath);
  if (!content) return false;

  const text = content.toString('utf-8');
  return text.includes('provideToastly') || text.includes('TOAST_GLOBAL_CONFIG');
}

/**
 * Checks if ToastContainerComponent is already in a template.
 */
export function isContainerPresent(tree: Tree, componentPath: string): boolean {
  const content = tree.read(componentPath);
  if (!content) return false;

  const text = content.toString('utf-8');

  // Check inline template
  if (text.includes('toastly-container')) {
    return true;
  }

  // Check for external template
  const templateUrlMatch = text.match(/templateUrl:\s*['"]([^'"]+)['"]/);
  if (templateUrlMatch) {
    const templatePath = resolveTemplatePath(componentPath, templateUrlMatch[1]);
    const templateContent = tree.read(templatePath);
    if (templateContent && templateContent.toString('utf-8').includes('toastly-container')) {
      return true;
    }
  }

  return false;
}

/**
 * Resolves a relative template path to an absolute path.
 */
function resolveTemplatePath(componentPath: string, templateUrl: string): string {
  const dir = componentPath.substring(0, componentPath.lastIndexOf('/'));
  return `${dir}/${templateUrl}`;
}
