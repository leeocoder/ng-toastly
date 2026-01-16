"use strict";
/**
 * ng-add schematic for ng-toastly.
 *
 * Automatically configures ng-toastly in an Angular application:
 * 1. Detects project type (standalone vs NgModule)
 * 2. Adds provideToastly() to app configuration
 * 3. Adds <toastly-container /> to AppComponent
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ngAdd = ngAdd;
const tasks_1 = require("@angular-devkit/schematics/tasks");
const workspace_1 = require("./utils/workspace");
const project_detection_1 = require("./utils/project-detection");
const add_provider_1 = require("./utils/add-provider");
const add_container_1 = require("./utils/add-container");
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
function logSuccess(context, message) {
    context.logger.info(`${colors.green}✔${colors.reset} ${message}`);
}
/**
 * Logs an info message to the console.
 */
function logInfo(context, message) {
    context.logger.info(`${colors.cyan}ℹ${colors.reset} ${message}`);
}
/**
 * Logs a warning message to the console.
 */
function logWarning(context, message) {
    context.logger.warn(`${colors.yellow}⚠${colors.reset} ${message}`);
}
/**
 * Main ng-add schematic entry point.
 */
function ngAdd(options) {
    return async (tree, context) => {
        // Validate Angular version
        (0, workspace_1.validateAngularVersion)(tree);
        // Get the target project
        const { name: projectName, project } = await (0, workspace_1.getProject)(tree, options.project);
        logInfo(context, `Configuring ng-toastly for project: ${projectName}`);
        // Detect project type
        const detection = (0, project_detection_1.detectProjectType)(tree, project);
        logProjectType(context, detection);
        // Determine position (default: bottom-right)
        const position = options.position ?? 'bottom-right';
        // Step 1: Add provideToastly()
        const configPath = detection.appConfigPath ?? detection.appModulePath ?? detection.mainFilePath;
        if ((0, project_detection_1.isToastlyConfigured)(tree, configPath)) {
            logInfo(context, 'provideToastly() already configured, skipping...');
        }
        else {
            (0, add_provider_1.addProvider)(tree, detection, position);
            logSuccess(context, `Added provideToastly({ position: '${position}' })`);
        }
        // Step 2: Add <toastly-container /> (unless skipped)
        if (options.skipContainer) {
            logInfo(context, 'Skipping container addition (--skipContainer flag)');
        }
        else if ((0, project_detection_1.isContainerPresent)(tree, detection.appComponentPath)) {
            logInfo(context, '<toastly-container /> already present, skipping...');
        }
        else {
            (0, add_container_1.addContainer)(tree, detection);
            logSuccess(context, 'Added <toastly-container /> to AppComponent');
        }
        // Schedule npm install
        context.addTask(new tasks_1.NodePackageInstallTask());
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
function logProjectType(context, detection) {
    switch (detection.type) {
        case 'standalone':
            logSuccess(context, 'Detected: Standalone application (modern)');
            break;
        case 'ngmodule':
            logWarning(context, 'Detected: NgModule application (legacy). Consider migrating to standalone.');
            break;
        default:
            logWarning(context, 'Could not detect project type. Will attempt configuration anyway.');
    }
}
//# sourceMappingURL=index.js.map