"use strict";
/**
 * Container addition utilities for Angular schematics.
 *
 * Adds <toastly-container /> to the AppComponent template.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.addContainer = addContainer;
const schematics_1 = require("@angular-devkit/schematics");
/**
 * Adds <toastly-container /> to the AppComponent.
 *
 * Handles both inline templates and external template files.
 */
function addContainer(tree, detection) {
    const componentPath = detection.appComponentPath;
    if (!tree.exists(componentPath)) {
        throw new schematics_1.SchematicsException(`Could not find AppComponent at ${componentPath}. ` +
            'Please add <toastly-container /> to your app template manually.');
    }
    const content = tree.read(componentPath);
    if (!content) {
        throw new schematics_1.SchematicsException(`Could not read ${componentPath}`);
    }
    const text = content.toString('utf-8');
    // Check if container already exists
    if (text.includes('toastly-container')) {
        return; // Already present, skip
    }
    // Check for external template
    const templateUrlMatch = text.match(/templateUrl\s*:\s*['"]([^'"]+)['"]/);
    if (templateUrlMatch) {
        addContainerToExternalTemplate(tree, componentPath, templateUrlMatch[1]);
        addImportToComponent(tree, componentPath);
        return;
    }
    // Handle inline template
    addContainerToInlineTemplate(tree, componentPath, text);
}
/**
 * Adds <toastly-container /> to an external template file.
 */
function addContainerToExternalTemplate(tree, componentPath, templateUrl) {
    const dir = componentPath.substring(0, componentPath.lastIndexOf('/'));
    const templatePath = `${dir}/${templateUrl}`;
    if (!tree.exists(templatePath)) {
        throw new schematics_1.SchematicsException(`Could not find template at ${templatePath}. ` +
            'Please add <toastly-container /> to your app template manually.');
    }
    const content = tree.read(templatePath);
    if (!content) {
        throw new schematics_1.SchematicsException(`Could not read ${templatePath}`);
    }
    let text = content.toString('utf-8');
    // Check if already present
    if (text.includes('toastly-container')) {
        return;
    }
    // Add container at the end of the template
    text = text.trim() + '\n\n<!-- Toast notifications -->\n<toastly-container />\n';
    tree.overwrite(templatePath, text);
}
/**
 * Adds <toastly-container /> to an inline template.
 */
function addContainerToInlineTemplate(tree, componentPath, text) {
    // Find inline template
    const templateMatch = text.match(/template\s*:\s*`([^`]*)`/s);
    if (!templateMatch) {
        throw new schematics_1.SchematicsException('Could not find template in AppComponent. ' +
            'Please add <toastly-container /> to your app template manually.');
    }
    const originalTemplate = templateMatch[1];
    const containerHtml = '\n\n<!-- Toast notifications -->\n<toastly-container />';
    const newTemplate = originalTemplate.trimEnd() + containerHtml + '\n  ';
    let newText = text.replace(templateMatch[0], `template: \`${newTemplate}\``);
    // Add import to component
    newText = addToastlyImport(newText);
    tree.overwrite(componentPath, newText);
}
/**
 * Adds ToastContainerComponent import to a component file.
 */
function addImportToComponent(tree, componentPath) {
    const content = tree.read(componentPath);
    if (!content)
        return;
    let text = content.toString('utf-8');
    // Check if already imported
    if (text.includes('ToastContainerComponent')) {
        return;
    }
    text = addToastlyImport(text);
    tree.overwrite(componentPath, text);
}
/**
 * Adds the ng-toastly import and updates the imports array.
 */
function addToastlyImport(text) {
    // Check if already imported
    if (text.includes('ToastContainerComponent')) {
        return text;
    }
    // Add import statement
    const importStatement = `import { ToastContainerComponent } from 'ng-toastly';\n`;
    const lastImportIndex = findLastImportIndex(text);
    if (lastImportIndex !== -1) {
        text = text.slice(0, lastImportIndex) + importStatement + text.slice(lastImportIndex);
    }
    else {
        text = importStatement + text;
    }
    // Add to component imports array
    const importsMatch = text.match(/imports\s*:\s*\[/);
    if (importsMatch && importsMatch.index !== undefined) {
        const insertIndex = text.indexOf('[', importsMatch.index) + 1;
        const afterBracket = text.slice(insertIndex).trim();
        if (afterBracket.startsWith(']')) {
            // Empty imports array
            text = text.slice(0, insertIndex) + 'ToastContainerComponent' + text.slice(insertIndex);
        }
        else {
            // Existing imports
            text = text.slice(0, insertIndex) + ' ToastContainerComponent,' + text.slice(insertIndex);
        }
    }
    return text;
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
//# sourceMappingURL=add-container.js.map