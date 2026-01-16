"use strict";
/**
 * Provider addition utilities for Angular schematics.
 *
 * Adds provideToastly() to the application configuration.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.addProvider = addProvider;
const schematics_1 = require("@angular-devkit/schematics");
/**
 * Adds provideToastly() to the app configuration.
 *
 * For standalone apps: modifies app.config.ts
 * For NgModule apps: modifies app.module.ts
 */
function addProvider(tree, detection, position) {
    if (detection.type === 'standalone') {
        addProviderToStandalone(tree, detection, position);
    }
    else if (detection.type === 'ngmodule') {
        addProviderToNgModule(tree, detection, position);
    }
    else {
        throw new schematics_1.SchematicsException('Could not detect project type. Please add provideToastly() manually to your app configuration.');
    }
}
/**
 * Adds provideToastly() to a standalone app's app.config.ts.
 */
function addProviderToStandalone(tree, detection, position) {
    const configPath = detection.appConfigPath;
    if (!configPath || !tree.exists(configPath)) {
        // Try to add to main.ts directly
        addProviderToMainTs(tree, detection.mainFilePath, position);
        return;
    }
    const content = tree.read(configPath);
    if (!content) {
        throw new schematics_1.SchematicsException(`Could not read ${configPath}`);
    }
    let text = content.toString('utf-8');
    // Check if already imported
    if (text.includes('provideToastly')) {
        return;
    }
    // Check if needs animations
    const needsAnimations = !text.includes('provideAnimations');
    // Add import statement
    let importStatement = `import { provideToastly } from 'ng-toastly';\n`;
    if (needsAnimations) {
        importStatement += `import { provideAnimations } from '@angular/platform-browser/animations';\n`;
    }
    // Find the last import statement and add after it
    const lastImportIndex = findLastImportIndex(text);
    if (lastImportIndex !== -1) {
        text = text.slice(0, lastImportIndex) + importStatement + text.slice(lastImportIndex);
    }
    else {
        text = importStatement + text;
    }
    // Add provider to providers array
    let providerCode = `provideToastly({ position: '${position}' })`;
    if (needsAnimations) {
        providerCode += `,\n    provideAnimations()`;
    }
    text = addToProvidersArray(text, providerCode);
    tree.overwrite(configPath, text);
}
/**
 * Adds provideToastly() to main.ts for standalone apps without app.config.ts.
 */
function addProviderToMainTs(tree, mainFilePath, position) {
    const content = tree.read(mainFilePath);
    if (!content) {
        throw new schematics_1.SchematicsException(`Could not read ${mainFilePath}`);
    }
    let text = content.toString('utf-8');
    // Check if already imported
    if (text.includes('provideToastly')) {
        return; // Already configured, skip
    }
    // Add import statement
    const importStatement = `import { provideToastly } from 'ng-toastly';\n`;
    const lastImportIndex = findLastImportIndex(text);
    if (lastImportIndex !== -1) {
        text = text.slice(0, lastImportIndex) + importStatement + text.slice(lastImportIndex);
    }
    else {
        text = importStatement + text;
    }
    // Add provider to bootstrapApplication call
    const providerCode = `provideToastly({ position: '${position}' })`;
    // Find bootstrapApplication and add provider
    const bootstrapMatch = text.match(/bootstrapApplication\s*\(\s*\w+\s*,\s*{/);
    if (bootstrapMatch) {
        const providersMatch = text.match(/providers\s*:\s*\[/);
        if (providersMatch) {
            // Add to existing providers array
            const insertIndex = text.indexOf('[', text.indexOf('providers'));
            text = text.slice(0, insertIndex + 1) + `\n    ${providerCode},` + text.slice(insertIndex + 1);
        }
        else {
            // Add providers array
            const insertIndex = text.indexOf('{', text.indexOf('bootstrapApplication'));
            text = text.slice(0, insertIndex + 1) + `\n  providers: [${providerCode}],` + text.slice(insertIndex + 1);
        }
    }
    tree.overwrite(mainFilePath, text);
}
/**
 * Adds provideToastly() to an NgModule app's app.module.ts.
 */
function addProviderToNgModule(tree, detection, position) {
    const modulePath = detection.appModulePath;
    if (!modulePath || !tree.exists(modulePath)) {
        throw new schematics_1.SchematicsException('Could not find app.module.ts. Please add provideToastly() manually to your providers array.');
    }
    const content = tree.read(modulePath);
    if (!content) {
        throw new schematics_1.SchematicsException(`Could not read ${modulePath}`);
    }
    let text = content.toString('utf-8');
    // Check if already imported
    if (text.includes('provideToastly')) {
        return; // Already configured, skip
    }
    // Add import statement
    const importStatement = `import { provideToastly } from 'ng-toastly';\n`;
    const lastImportIndex = findLastImportIndex(text);
    if (lastImportIndex !== -1) {
        text = text.slice(0, lastImportIndex) + importStatement + text.slice(lastImportIndex);
    }
    else {
        text = importStatement + text;
    }
    // Add provider to providers array
    const providerCode = `provideToastly({ position: '${position}' })`;
    text = addToProvidersArray(text, providerCode);
    tree.overwrite(modulePath, text);
}
/**
 * Finds the index after the last import statement.
 */
function findLastImportIndex(text) {
    const importRegex = /import\s+.*?from\s+['"][^'"]+['"];?\s*\n/g;
    let lastMatch = null;
    let match;
    while ((match = importRegex.exec(text)) !== null) {
        lastMatch = match;
    }
    if (lastMatch) {
        return lastMatch.index + lastMatch[0].length;
    }
    return -1;
}
/**
 * Adds a provider to the providers array in the text.
 */
function addToProvidersArray(text, providerCode) {
    // Find providers array
    const providersMatch = text.match(/providers\s*:\s*\[/);
    if (providersMatch && providersMatch.index !== undefined) {
        const insertIndex = text.indexOf('[', providersMatch.index) + 1;
        const afterBracket = text.slice(insertIndex).trim();
        if (afterBracket.startsWith(']')) {
            // Empty providers array
            return text.slice(0, insertIndex) + `\n    ${providerCode},\n  ` + text.slice(insertIndex);
        }
        else {
            // Existing providers
            return text.slice(0, insertIndex) + `\n    ${providerCode},` + text.slice(insertIndex);
        }
    }
    // No providers array found, might need to add it
    // This is a fallback - in most cases the array exists
    return text;
}
//# sourceMappingURL=add-provider.js.map