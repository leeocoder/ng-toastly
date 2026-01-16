<div align="center">
  <img src="https://raw.githubusercontent.com/toastly/toastly/main/docs/assets/toastly-logo.png" alt="Toastly Logo" width="120" />
  <h1>Toastly</h1>
  <p><strong>Toast notifications for Angular, done right.</strong></p>
  
  [![npm version](https://img.shields.io/npm/v/toastly.svg)](https://www.npmjs.com/package/toastly)
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
  [![Angular](https://img.shields.io/badge/Angular-17%2B-DD0031.svg)](https://angular.io)
</div>

---

## 🚀 Introduction

**Toastly** is a modern, lightweight, and type-safe toast notification library designed specifically for **Angular 17+**.

Built from the ground up to leverage the power of **Signals** and **Standalone Components**, Toastly provides a developer experience that feels native to the modern Angular ecosystem. It solves the problem of displaying non-intrusive alerts without the bloat of legacy dependencies or heavy UI frameworks.

Whether you need simple success messages or complex notifications with actions and progress bars, Toastly delivers performance and accessibility out of the box.

## 💡 Why Toastly?

Unlike traditional toast libraries that rely on global state hacks or legacy module systems, Toastly embraces Angular's modern reactivity primitives.

- **Values Signals**: State management is reactive and predictable.
- **Zero Magic**: No hidden `z-index` wars or global DOM pollution. You control the container.
- **Micro-Sized**: Only ~3KB gzipped.
- **Clean Architecture**: Separation of concerns between Service (State) and Component (UI).

## ✨ Features

- **Angular 17-21 Ready**: Built for the latest versions.
- **Type-Safe**: Full TypeScript support with strict types.
- **Multi-Position**: Support for multiple independently positioned containers (e.g., Top-Left and Bottom-Right simultaneously).
- **A11y First**: ARIA live regions, keyboard navigation, and reduced motion support.
- **Dark Mode**: Native dark mode support with CSS variables.
- **Customizable**: extensive CSS variables and template support for custom content.
- **Interactive**: Support for action buttons and hover-pause behavior.

## 📦 Installation

Install Toastly via npm:

```bash
npm install toastly
```

## ⚡ Quick Start

### 1. Register the Service

Toastly is standalone. You don't need to import a generic module. Just add the container to your root component.

```typescript
// app.component.ts
import { Component, inject } from '@angular/core';
import { ToastContainerComponent, ToastService } from 'ng-toastly';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ToastContainerComponent],
  template: `
    <button (click)="showToast()">Show Toast</button>

    <!-- The Stage for your Toasts -->
    <toastly-container />
  `,
})
export class AppComponent {
  private toastService = inject(ToastService);

  showToast() {
    this.toastService.success('Hello, World! 🚀');
  }
}
```

### 2. Configure (Optional)

You can provide global configuration in your `app.config.ts`:

```typescript
// app.config.ts
import { provideToastly } from 'ng-toastly';

export const appConfig = {
  providers: [
    provideToastly({
      position: 'bottom-right',
      theme: 'dark',
      defaultDurationMs: 5000,
    }),
  ],
};
```

## 🎨 Customization

### Positioning

Toastly supports multiple containers for different notification streams.

```html
<!-- Main notifications at the bottom -->
<toastly-container position="bottom-right" />

<!-- Critical alerts at the top -->
<toastly-container position="top-center" />
```

When creating a toast, you can target specific positions:

```typescript
this.toastService.info('Update available', {
  position: 'bottom-right',
});

this.toastService.danger('Connection Lost', {
  position: 'top-center',
});
```

### Styling

Toastly uses CSS variables for easy customization. Override them in your global styles:

```css
:root {
  --toastly-radius: 8px;
  --toastly-font-family: 'Inter', sans-serif;
  --toastly-success: #10b981;
}

[data-theme='dark'] {
  --toastly-bg: #1f2937;
  --toastly-text: #f9fafb;
}
```

## 🧠 Design & Philosophy

We believe simple problems deserve simple solutions.
Toastly was architected to be **readable** and **maintainable**.

- **No `any`**: Every type is defined.
- **No Side Effects**: The service doesn't implicitly inject DOM elements. You place the `<toastly-container>`, keeping architecture explicit.
- **Memory Safe**: Timers are automatically cleaned up using Angular's `DestroyRef`.

## ♿ Accessibility

Accessibility isn't an afterthought.

- Containers use `role="alert"` or `role="status"` depending on message type.
- Updates trigger `aria-live` regions appropriately.
- Animations respect `prefers-reduced-motion`.

## 🔄 Versioning

Toastly follows [Semantic Versioning](https://semver.org/).

- **v1.x**: Angular 17+

## 🤝 Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to set up the dev environment and submit PRs.

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  Made with ❤️ by <strong>Leonardo Albuquerque</strong>
</div>
