/**
 * ng-add schematic for ng-toastly.
 *
 * Automatically configures ng-toastly in an Angular application:
 * 1. Detects project type (standalone vs NgModule)
 * 2. Adds provideToastly() to app configuration
 * 3. Adds <toastly-container /> to AppComponent
 */

import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { Schema } from './schema';
import { getProject, validateAngularVersion } from './utils/workspace';
import {
  detectProjectType,
  isToastlyConfigured,
  isContainerPresent,
  ProjectDetectionResult,
} from './utils/project-detection';
import { addProvider } from './utils/add-provider';
import { addContainer } from './utils/add-container';

/**
 * Console output colors for terminal messages.
 */
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
};

/**
 * Logs a success message to the console.
 */
function logSuccess(context: SchematicContext, message: string): void {
  context.logger.info(`${colors.green}✔${colors.reset} ${message}`);
}

/**
 * Logs an info message to the console.
 */
function logInfo(context: SchematicContext, message: string): void {
  context.logger.info(`${colors.cyan}ℹ${colors.reset} ${message}`);
}

/**
 * Logs a warning message to the console.
 */
function logWarning(context: SchematicContext, message: string): void {
  context.logger.warn(`${colors.yellow}⚠${colors.reset} ${message}`);
}

/**
 * Main ng-add schematic entry point.
 */
export function ngAdd(options: Schema): Rule {
  return async (tree: Tree, context: SchematicContext) => {
    // Validate Angular version
    validateAngularVersion(tree);

    // Get the target project
    const { name: projectName, project } = await getProject(tree, options.project);
    logInfo(context, `Configuring ng-toastly for project: ${projectName}`);

    // Detect project type
    const detection: ProjectDetectionResult = detectProjectType(tree, project);
    logProjectType(context, detection);

    // Determine position (default: bottom-right)
    const position = options.position ?? 'bottom-right';

    // Step 1: Add provideToastly()
    const configPath = detection.appConfigPath ?? detection.appModulePath ?? detection.mainFilePath;
    if (isToastlyConfigured(tree, configPath)) {
      logInfo(context, 'provideToastly() already configured, skipping...');
    } else {
      addProvider(tree, detection, position);
      logSuccess(context, `Added provideToastly({ position: '${position}' })`);
    }

    // Step 2: Add <toastly-container /> (unless skipped)
    if (options.skipContainer) {
      logInfo(context, 'Skipping container addition (--skipContainer flag)');
    } else if (isContainerPresent(tree, detection.appComponentPath)) {
      logInfo(context, '<toastly-container /> already present, skipping...');
    } else {
      addContainer(tree, detection);
      logSuccess(context, 'Added <toastly-container /> to AppComponent');
    }

    // Schedule npm install
    context.addTask(new NodePackageInstallTask());

    // Final success message
    logSuccess(context, 'ng-toastly configured successfully!');
    logInfo(context, '');
    logInfo(context, 'Quick start:');
    logInfo(context, '  import { inject } from \'@angular/core\';');
    logInfo(context, '  import { ToastService } from \'ng-toastly\';');
    logInfo(context, '');
    logInfo(context, '  private toastService = inject(ToastService);');
    logInfo(context, '  this.toastService.success(\'Hello, World!\');');
    logInfo(context, '');

    return tree;
  };
}

/**
 * Logs the detected project type.
 */
function logProjectType(context: SchematicContext, detection: ProjectDetectionResult): void {
  switch (detection.type) {
    case 'standalone':
      logSuccess(context, 'Detected: Standalone application (modern)');
      break;
    case 'ngmodule':
      logWarning(
        context,
        'Detected: NgModule application (legacy). Consider migrating to standalone.'
      );
      break;
    default:
      logWarning(
        context,
        'Could not detect project type. Will attempt configuration anyway.'
      );
  }
}
