/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import * as path from 'path';

export default defineConfig({
  test: {
    globals: true, // schematic tests use describe/it/expect
    environment: 'node', // schematic tests run in Node environment
    include: ['projects/ng-toastly/schematics/**/*.spec.ts'],
    deps: {
      interopDefault: true,
    },
    // We need to resolve @angular-devkit/schematics/testing correctly
  },
  resolve: {
    alias: {
      // Add any necessary aliases here
    }
  }
});
