/**
 * Tests for workspace utilities
 *
 * Verifies:
 * - Workspace reading
 * - Project retrieval
 * - Angular version validation
 */

import { Tree } from '@angular-devkit/schematics';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { getWorkspace, getProject, validateAngularVersion, getSourceRoot } from './workspace';
import { workspaces } from '@angular-devkit/core';

describe('workspace utilities', () => {
  let tree: UnitTestTree;

  beforeEach(() => {
    tree = new UnitTestTree(Tree.empty());
  });

  // ==========================================================================
  // getWorkspace Tests
  // ==========================================================================

  describe('getWorkspace', () => {
    it('should read workspace from angular.json', async () => {
      tree.create(
        '/angular.json',
        JSON.stringify({
          version: 1,
          projects: {
            'my-app': {
              projectType: 'application',
              root: '',
              sourceRoot: 'src',
            },
          },
        })
      );

      const workspace = await getWorkspace(tree);

      expect(workspace).toBeDefined();
      expect(workspace.projects.get('my-app')).toBeDefined();
    });
  });

  // ==========================================================================
  // getProject Tests
  // ==========================================================================

  describe('getProject', () => {
    beforeEach(() => {
      tree.create(
        '/angular.json',
        JSON.stringify({
          version: 1,
          projects: {
            'my-app': {
              projectType: 'application',
              root: '',
              sourceRoot: 'src',
            },
            'my-lib': {
              projectType: 'library',
              root: 'projects/my-lib',
              sourceRoot: 'projects/my-lib/src',
            },
          },
        })
      );
    });

    it('should return project by name', async () => {
      const { name, project } = await getProject(tree, 'my-app');

      expect(name).toBe('my-app');
      expect(project).toBeDefined();
    });

    it('should return first application project when no name provided', async () => {
      const { name } = await getProject(tree);

      expect(name).toBe('my-app');
    });

    it('should throw for non-existent project', async () => {
      await expect(getProject(tree, 'nonexistent')).rejects.toThrow(/not found/);
    });
  });

  // ==========================================================================
  // validateAngularVersion Tests
  // ==========================================================================

  describe('validateAngularVersion', () => {
    it('should pass for Angular 17', () => {
      tree.create(
        '/package.json',
        JSON.stringify({
          dependencies: { '@angular/core': '^17.0.0' },
        })
      );

      expect(() => validateAngularVersion(tree)).not.toThrow();
    });

    it('should pass for Angular 18', () => {
      tree.create(
        '/package.json',
        JSON.stringify({
          dependencies: { '@angular/core': '~18.1.0' },
        })
      );

      expect(() => validateAngularVersion(tree)).not.toThrow();
    });

    it('should pass for Angular 21', () => {
      tree.create(
        '/package.json',
        JSON.stringify({
          dependencies: { '@angular/core': '^21.0.0' },
        })
      );

      expect(() => validateAngularVersion(tree)).not.toThrow();
    });

    it('should throw for Angular 16', () => {
      tree.create(
        '/package.json',
        JSON.stringify({
          dependencies: { '@angular/core': '^16.0.0' },
        })
      );

      expect(() => validateAngularVersion(tree)).toThrow(/Angular 17/);
    });

    it('should throw for Angular 15', () => {
      tree.create(
        '/package.json',
        JSON.stringify({
          dependencies: { '@angular/core': '^15.0.0' },
        })
      );

      expect(() => validateAngularVersion(tree)).toThrow(/Angular 17/);
    });

    it('should throw if package.json not found', () => {
      expect(() => validateAngularVersion(tree)).toThrow(/package.json/);
    });

    it('should throw if @angular/core not found', () => {
      tree.create(
        '/package.json',
        JSON.stringify({
          dependencies: { lodash: '^4.0.0' },
        })
      );

      expect(() => validateAngularVersion(tree)).toThrow(/@angular\/core/);
    });

    it('should check devDependencies if dependencies not present', () => {
      tree.create(
        '/package.json',
        JSON.stringify({
          devDependencies: { '@angular/core': '^17.0.0' },
        })
      );

      expect(() => validateAngularVersion(tree)).not.toThrow();
    });
  });

  // ==========================================================================
  // getSourceRoot Tests
  // ==========================================================================

  describe('getSourceRoot', () => {
    it('should return sourceRoot when defined', () => {
      const project = {
        root: '',
        sourceRoot: 'src',
        extensions: {},
        targets: new Map(),
      } as workspaces.ProjectDefinition;

      expect(getSourceRoot(project)).toBe('src');
    });

    it('should return root/src when sourceRoot not defined', () => {
      const project = {
        root: 'projects/my-app',
        sourceRoot: undefined,
        extensions: {},
        targets: new Map(),
      } as workspaces.ProjectDefinition;

      expect(getSourceRoot(project)).toBe('projects/my-app/src');
    });
  });
});
