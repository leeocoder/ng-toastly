"use strict";
/**
 * Workspace utilities for Angular schematics.
 *
 * Provides helpers to read and manipulate Angular workspace configuration.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkspace = getWorkspace;
exports.getProject = getProject;
exports.getSourceRoot = getSourceRoot;
exports.validateAngularVersion = validateAngularVersion;
const schematics_1 = require("@angular-devkit/schematics");
const core_1 = require("@angular-devkit/core");
/**
 * Host implementation for reading/writing workspace files.
 */
function createHost(tree) {
    return {
        async readFile(path) {
            const data = tree.read(path);
            if (!data) {
                throw new schematics_1.SchematicsException(`File not found: ${path}`);
            }
            return data.toString('utf-8');
        },
        async writeFile(path, data) {
            tree.overwrite(path, data);
        },
        async isDirectory(path) {
            return !tree.exists(path) && tree.getDir(path).subfiles.length > 0;
        },
        async isFile(path) {
            return tree.exists(path);
        },
    };
}
/**
 * Reads the Angular workspace configuration.
 */
async function getWorkspace(tree) {
    const host = createHost(tree);
    const { workspace } = await core_1.workspaces.readWorkspace('/', host);
    return workspace;
}
/**
 * Gets a project from the workspace by name.
 * If no name provided, returns the default project.
 */
async function getProject(tree, projectName) {
    const workspace = await getWorkspace(tree);
    // If project name is provided, use it
    if (projectName) {
        const project = workspace.projects.get(projectName);
        if (!project) {
            throw new schematics_1.SchematicsException(`Project "${projectName}" not found in workspace.`);
        }
        return { name: projectName, project };
    }
    // Otherwise, find the default project (first application project)
    for (const [name, project] of workspace.projects) {
        if (project.extensions['projectType'] === 'application') {
            return { name, project };
        }
    }
    throw new schematics_1.SchematicsException('Could not find an application project in the workspace. ' +
        'Please specify a project name using the --project option.');
}
/**
 * Gets the source root of a project.
 */
function getSourceRoot(project) {
    return project.sourceRoot ?? `${project.root}/src`;
}
/**
 * Validates that the project is compatible with ng-toastly.
 * Requires Angular 17+.
 */
function validateAngularVersion(tree) {
    const packageJson = tree.read('package.json');
    if (!packageJson) {
        throw new schematics_1.SchematicsException('Could not find package.json');
    }
    const pkg = JSON.parse(packageJson.toString('utf-8'));
    const angularCore = pkg.dependencies?.['@angular/core'] || pkg.devDependencies?.['@angular/core'];
    if (!angularCore) {
        throw new schematics_1.SchematicsException('Could not find @angular/core in package.json');
    }
    // Extract major version (e.g., "^17.0.0" -> 17)
    const versionMatch = angularCore.match(/(\d+)/);
    if (versionMatch) {
        const majorVersion = parseInt(versionMatch[1], 10);
        if (majorVersion < 17) {
            throw new schematics_1.SchematicsException(`ng-toastly requires Angular 17 or higher. Found: Angular ${majorVersion}. ` +
                'Please upgrade your Angular version.');
        }
    }
}
//# sourceMappingURL=workspace.js.map