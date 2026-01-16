/**
 * ng-add schematic for ng-toastly.
 *
 * Automatically configures ng-toastly in an Angular application:
 * 1. Detects project type (standalone vs NgModule)
 * 2. Adds provideToastly() to app configuration
 * 3. Adds <toastly-container /> to AppComponent
 */
import { Rule } from '@angular-devkit/schematics';
import { Schema } from './schema';
/**
 * Main ng-add schematic entry point.
 */
export declare function ngAdd(options: Schema): Rule;
