/**
 * Tests for project-detection utilities
 *
 * Verifies:
 * - Standalone project detection
 * - NgModule project detection
 * - Toastly configuration detection
 * - Container presence detection
 */

import { Tree } from '@angular-devkit/schematics';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import {
  detectProjectType,
  isToastlyConfigured,
  isContainerPresent,
} from './project-detection';
import { workspaces } from '@angular-devkit/core';

/**
 * Creates a mock project definition.
 */
function createMockProject(sourceRoot: string = 'src'): workspaces.ProjectDefinition {
  return {
    root: '',
    sourceRoot,
    extensions: {},
    targets: new Map(),
  };
}

describe('project-detection utilities', () => {
  let tree: UnitTestTree;

  beforeEach(() => {
    tree = new UnitTestTree(Tree.empty());
  });

  // ==========================================================================
  // detectProjectType Tests
  // ==========================================================================

  describe('detectProjectType', () => {
    it('should detect standalone project', () => {
      tree.create(
        '/src/main.ts',
        `
        import { bootstrapApplication } from '@angular/platform-browser';
        bootstrapApplication(AppComponent);
        `
      );
      tree.create('/src/app/app.component.ts', 'export class AppComponent {}');

      const result = detectProjectType(tree, createMockProject());

      expect(result.type).toBe('standalone');
    });

    it('should detect NgModule project', () => {
      tree.create(
        '/src/main.ts',
        `
        import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
        platformBrowserDynamic().bootstrapModule(AppModule);
        `
      );
      tree.create('/src/app/app.component.ts', 'export class AppComponent {}');

      const result = detectProjectType(tree, createMockProject());

      expect(result.type).toBe('ngmodule');
    });

    it('should return unknown for unrecognized project', () => {
      tree.create('/src/main.ts', 'console.log("Hello");');
      tree.create('/src/app/app.component.ts', 'export class AppComponent {}');

      const result = detectProjectType(tree, createMockProject());

      expect(result.type).toBe('unknown');
    });

    it('should detect app.config.ts for standalone', () => {
      tree.create(
        '/src/main.ts',
        `
        import { bootstrapApplication } from '@angular/platform-browser';
        bootstrapApplication(AppComponent, appConfig);
        `
      );
      tree.create('/src/app/app.config.ts', 'export const appConfig = {};');
      tree.create('/src/app/app.component.ts', 'export class AppComponent {}');

      const result = detectProjectType(tree, createMockProject());

      expect(result.appConfigPath).toBe('src/app/app.config.ts');
    });

    it('should detect app.module.ts for NgModule', () => {
      tree.create(
        '/src/main.ts',
        `
        import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
        platformBrowserDynamic().bootstrapModule(AppModule);
        `
      );
      tree.create('/src/app/app.module.ts', 'export class AppModule {}');
      tree.create('/src/app/app.component.ts', 'export class AppComponent {}');

      const result = detectProjectType(tree, createMockProject());

      expect(result.appModulePath).toBe('src/app/app.module.ts');
    });

    it('should return mainFilePath', () => {
      tree.create('/src/main.ts', 'bootstrapApplication()');
      tree.create('/src/app/app.component.ts', 'export class AppComponent {}');

      const result = detectProjectType(tree, createMockProject());

      expect(result.mainFilePath).toBe('src/main.ts');
    });

    it('should return appComponentPath', () => {
      tree.create('/src/main.ts', 'bootstrapApplication()');
      tree.create('/src/app/app.component.ts', 'export class AppComponent {}');

      const result = detectProjectType(tree, createMockProject());

      expect(result.appComponentPath).toBe('src/app/app.component.ts');
    });
  });

  // ==========================================================================
  // isToastlyConfigured Tests
  // ==========================================================================

  describe('isToastlyConfigured', () => {
    it('should return true if provideToastly is present', () => {
      tree.create('/src/app/app.config.ts', `provideToastly({ position: 'top-right' })`);

      expect(isToastlyConfigured(tree, '/src/app/app.config.ts')).toBe(true);
    });

    it('should return true if TOAST_GLOBAL_CONFIG is present', () => {
      tree.create(
        '/src/app/app.config.ts',
        `{ provide: TOAST_GLOBAL_CONFIG, useValue: {} }`
      );

      expect(isToastlyConfigured(tree, '/src/app/app.config.ts')).toBe(true);
    });

    it('should return false if toastly is not configured', () => {
      tree.create('/src/app/app.config.ts', `export const appConfig = { providers: [] };`);

      expect(isToastlyConfigured(tree, '/src/app/app.config.ts')).toBe(false);
    });

    it('should return false for non-existent file', () => {
      expect(isToastlyConfigured(tree, '/src/app/nonexistent.ts')).toBe(false);
    });
  });

  // ==========================================================================
  // isContainerPresent Tests
  // ==========================================================================

  describe('isContainerPresent', () => {
    it('should return true if toastly-container is in inline template', () => {
      tree.create(
        '/src/app/app.component.ts',
        `
        @Component({
          template: \`<toastly-container />\`
        })
        export class AppComponent {}
        `
      );

      expect(isContainerPresent(tree, '/src/app/app.component.ts')).toBe(true);
    });

    it('should return true if toastly-container is in external template', () => {
      tree.create(
        '/src/app/app.component.ts',
        `
        @Component({
          templateUrl: './app.component.html'
        })
        export class AppComponent {}
        `
      );
      tree.create('/src/app/app.component.html', '<toastly-container />');

      expect(isContainerPresent(tree, '/src/app/app.component.ts')).toBe(true);
    });

    it('should return false if container is not present', () => {
      tree.create(
        '/src/app/app.component.ts',
        `
        @Component({
          template: \`<h1>Hello</h1>\`
        })
        export class AppComponent {}
        `
      );

      expect(isContainerPresent(tree, '/src/app/app.component.ts')).toBe(false);
    });

    it('should return false for non-existent file', () => {
      expect(isContainerPresent(tree, '/src/app/nonexistent.ts')).toBe(false);
    });
  });
});
