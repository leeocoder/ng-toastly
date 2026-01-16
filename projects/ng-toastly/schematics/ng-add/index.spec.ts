import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';

function getFileContent(tree: UnitTestTree, filePath: string): string {
  const buffer = tree.read(filePath);
  if (!buffer) {
    throw new Error(`File ${filePath} not found`);
  }
  return buffer.toString();
}

import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

describe('ng-add', () => {
  let runner: SchematicTestRunner;
  let tree: UnitTestTree;

  beforeEach(async () => {
    runner = new SchematicTestRunner('ng-toastly', collectionPath);
    tree = await runner.runExternalSchematic(
      '@schematics/angular',
      'workspace',
      {
        name: 'workspace',
        version: '17.0.0',
        newProjectRoot: 'projects',
      }
    );

    // Create a default application
    await runner.runExternalSchematic(
      '@schematics/angular',
      'application',
      {
        name: 'demo',
        inlineStyle: false,
        inlineTemplate: false,
        routing: false,
        style: 'css',
        skipTests: false,
        skipPackageJson: false,
        standalone: true,
      },
      tree
    );
    
    // Fix: Rename app.ts to app.component.ts as the test runner seems to generate it as app.ts
    if (tree.exists('/projects/demo/src/app/app.ts')) {
      tree.rename('/projects/demo/src/app/app.ts', '/projects/demo/src/app/app.component.ts');
    }

    if (!tree.exists('/projects/demo/src/app/app.component.ts')) {
        console.error('Files in tree:', tree.files);
        throw new Error('Missing app.component.ts. Available files: ' + JSON.stringify(tree.files.slice(0, 50), null, 2));
    }
  });

  it('should schedule npm install', async () => {
    // Check that a task was scheduled
    expect(runner.tasks.some(task => task.name === 'node-package')).toBe(true);
  });

  describe('standalone application', () => {
    it('should add provideToastly to app.config.ts', async () => {
      const newTree = await runner.runSchematic('ng-add', { project: 'demo' }, tree);
      const appConfig = getFileContent(newTree, '/projects/demo/src/app/app.config.ts');
      
      expect(appConfig).toContain('provideToastly');
      expect(appConfig).toContain("position: 'bottom-right'");
    });

    it('should add keys to imports', async () => {
       const newTree = await runner.runSchematic('ng-add', { project: 'demo' }, tree);
       const appConfig = getFileContent(newTree, '/projects/demo/src/app/app.config.ts');
       expect(appConfig).toContain('provideAnimations'); // Now explicitly added
       expect(appConfig).toContain('provideToastly');
    });
  });

  describe('parameter validation', () => {
    it('should respect custom position', async () => {
        // We need to re-run the schematic with options
        const newTree = await runner.runSchematic('ng-add', { project: 'demo', position: 'bottom-left' }, tree);
        const appConfig = getFileContent(newTree, '/projects/demo/src/app/app.config.ts');
        expect(appConfig).toContain("position: 'bottom-left'");
    });
  });
});
