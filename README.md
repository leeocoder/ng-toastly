<div align="center">
  <img src="https://raw.githubusercontent.com/leeocoder/toastly/main/docs/assets/toastly-logo.png" alt="Toastly Logo" width="120" />
  <h1>Toastly</h1>
  <p><strong>Modern, Lightweight, and Type-Safe Toast Notifications for Angular.</strong></p>

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Angular](https://img.shields.io/badge/Angular-17%2B-DD0031.svg)](https://angular.io)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

</div>

---

## 📖 About The Project

**Toastly** is an open-source Angular library designed to provide a developer-friendly and accessible way to display toast notifications. Unlike many existing solutions, Toastly takes full advantage of **Angular 17+** features, utilizing **Signals** for reactive state management and **Standalone Components** for ease of use.

This repository serves as a monorepo containing:

1.  **The Library**: The core `@toastly/toastly` package.
2.  **The Documentation**: A static site showcasing features and usage examples.

### Key Features

- 🚀 **Modern Architecture**: Built with Signals and Standalone Components.
- 📐 **Multi-Positioning**: Support for multiple independent toast containers.
- 🎨 **Themable**: Native dark mode support and extensive CSS variable customization.
- ♿ **Accessible**: ARIA-compliant and keyboard navigable.
- 📦 **Lightweight**: Zero 3rd-party dependencies.

---

## 📂 Repository Structure

```
toastly/
├── docs/                 # Documentation & Landing Page (Static Site)
├── projects/
│   └── toastly/          # The Core Angular Library Source
├── angular.json          # Workspace Configuration
└── package.json          # Root Dependencies
```

---

## 🛠️ Development

If you want to contribute to Toastly or run it locally, follow these steps.

### Prerequisites

- Node.js (v18 or higher)
- npm
- Angular CLI

### Installation

1.  **Clone the repo**

    ```bash
    git clone https://github.com/leeocoder/toastly.git
    cd toastly
    ```

2.  **Install dependencies**
    ```bash
    npm install ng-toastly
    ```

### Running the Library (Watch Mode)

To develop the library with hot reload:

```bash
ng build toastly --watch
```

### Building the Library

To generate a production build of the library (outputs to `dist/toastly`):

```bash
ng build toastly
```

### Running the Tests

To execute unit tests via Vitest/Karma:

```bash
ng test toastly
```

---

## 🚀 Publishing

To clean, build, and publish the library to npm:

```bash
# 1. Build the library
ng build toastly --configuration production

# 2. Navigate to dist
cd dist/toastly

# 3. Publish
npm publish
```

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  Made with ❤️ by <strong>Leonardo Albuquerque</strong>
</div>
