/**
 * Workspace utilities for Angular schematics.
 *
 * Provides helpers to read and manipulate Angular workspace configuration.
 */
import { Tree } from '@angular-devkit/schematics';
import { workspaces } from '@angular-devkit/core';
/**
 * Reads the Angular workspace configuration.
 */
export declare function getWorkspace(tree: Tree): Promise<workspaces.WorkspaceDefinition>;
/**
 * Gets a project from the workspace by name.
 * If no name provided, returns the default project.
 */
export declare function getProject(tree: Tree, projectName?: string): Promise<{
    name: string;
    project: workspaces.ProjectDefinition;
}>;
/**
 * Gets the source root of a project.
 */
export declare function getSourceRoot(project: workspaces.ProjectDefinition): string;
/**
 * Validates that the project is compatible with ng-toastly.
 * Requires Angular 17+.
 */
export declare function validateAngularVersion(tree: Tree): void;
