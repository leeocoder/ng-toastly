# Toastly

A fully customizable, dependency-free toast notification library for **Angular 17–21**.

## Features

- ✅ **Zero dependencies** - Only Angular peer dependencies
- ✅ **Signal-based state** - Modern reactive architecture
- ✅ **Fully typed** - TypeScript strict mode, no `any`
- ✅ **Memory safe** - Automatic timer cleanup via `DestroyRef`
- ✅ **Accessible** - ARIA live regions, reduced-motion support
- ✅ **Customizable** - CSS variables, class inputs, custom templates
- ✅ **Two themes** - Light and dark, matching the reference design
- ✅ **Framework agnostic styling** - Works with Tailwind, PrimeFlex, or vanilla CSS

## Installation

```bash
npm install toastly
```

## Quick Start

### 1. Add the container to your app

```typescript
// app.component.ts
import { Component } from '@angular/core';
import { ToastContainerComponent } from 'toastly';

@Component({
  selector: 'app-root',
  imports: [ToastContainerComponent],
  template: `
    <router-outlet />
    <toastly-container />
  `,
})
export class AppComponent {}
```

### 2. Import styles (optional - for default styling)

```css
/* styles.css */
@import 'toastly/styles/toastly.css';
```

### 3. Show toasts

```typescript
import { inject } from '@angular/core';
import { ToastService } from 'toastly';

export class MyComponent {
  private readonly toastService = inject(ToastService);

  showSuccess(): void {
    this.toastService.success('Changes saved successfully!');
  }

  showWithOptions(): void {
    this.toastService.show({
      type: 'info',
      theme: 'dark',
      title: 'New update available',
      message: 'Version 4.2 includes performance improvements.',
      durationMs: 8000,
      actions: [
        { label: 'Skip', variant: 'secondary', onClick: () => this.skip() },
        { label: 'Install now', variant: 'primary', onClick: () => this.install() },
      ],
    });
  }
}
```

## API

### ToastService Methods

| Method                             | Description                    |
| ---------------------------------- | ------------------------------ |
| `show(payload)`                    | Show a toast with full options |
| `info(message, options?)`          | Show an info toast             |
| `success(message, options?)`       | Show a success toast           |
| `warning(message, options?)`       | Show a warning toast           |
| `danger(message, options?)`        | Show a danger/error toast      |
| `dismiss(toastId)`                 | Dismiss a specific toast       |
| `dismissAll()`                     | Dismiss all toasts             |
| `updateProgress(toastId, percent)` | Update progress bar value      |

### ToastPayload Options

| Property          | Type                                           | Default   | Description                              |
| ----------------- | ---------------------------------------------- | --------- | ---------------------------------------- |
| `message`         | `string`                                       | required  | Main toast message                       |
| `title`           | `string`                                       | -         | Optional title                           |
| `type`            | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'`  | Toast type                               |
| `theme`           | `'light' \| 'dark'`                            | `'light'` | Visual theme                             |
| `durationMs`      | `number`                                       | `5000`    | Auto-dismiss delay (0 = no auto-dismiss) |
| `dismissible`     | `boolean`                                      | `true`    | Show close button                        |
| `actions`         | `ToastAction[]`                                | `[]`      | Action buttons                           |
| `progressPercent` | `number`                                       | -         | Progress bar value (0-100)               |
| `avatarUrl`       | `string`                                       | -         | Avatar image URL                         |
| `iconTemplate`    | `TemplateRef`                                  | -         | Custom icon template                     |
| `styleClass`      | `string`                                       | -         | Custom CSS class                         |

## Global Configuration

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { TOAST_GLOBAL_CONFIG } from 'toastly';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: TOAST_GLOBAL_CONFIG,
      useValue: {
        position: 'top-right',
        theme: 'dark',
        defaultDurationMs: 4000,
        maximumVisibleToasts: 3,
      },
    },
  ],
};
```

## Customization

### CSS Variables

```css
:root {
  --toastly-bg: #ffffff;
  --toastly-text: #18181b;
  --toastly-text-muted: #71717a;
  --toastly-border: #e4e4e7;
  --toastly-radius: 12px;
  --toastly-padding: 16px;
  --toastly-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  --toastly-success: #16a34a;
  --toastly-warning: #f59e0b;
  --toastly-danger: #dc2626;
  --toastly-info: #7c3aed;
}
```

### With Tailwind CSS

```typescript
this.toastService.success('Saved!', {
  styleClass: 'shadow-xl rounded-2xl',
});
```

## License

MIT
