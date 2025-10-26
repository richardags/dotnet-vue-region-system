# Region CRUD Frontend

A Vue.js frontend application for managing regions, built with Vue 3, TypeScript, and Vite.

## Prerequisites

- Node.js (^20.19.0 || >=22.12.0)
- npm or yarn

## Features

- CRUD operations for regions
- Sortable region list
- Confirmation dialogs
- Error handling
- Loading states
- Unit tests
- TypeScript support

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Project Structure

```
src/
├── assets/          # Static assets (CSS, images, etc.)
├── components/      # Vue components
│   ├── common/      # Shared components (ConfirmDialog, ErrorMessage, LoadingSpinner)
│   └── regions/     # Region-specific components
├── composables/     # Vue composables
│   ├── useConfirmDialog.ts    # Confirmation dialog logic
│   └── useSortable.ts        # Sortable list functionality
├── router/          # Vue Router configuration
├── services/        # API services
│   └── RegionService.ts      # Region CRUD operations
├── stores/          # Pinia stores
│   └── RegionStore.ts        # Region state management
├── types/           # TypeScript type definitions
│   └── Region.ts             # Region interface
├── utils/          # Utility functions
└── views/          # Page components
    └── RegionsView.vue       # Main regions page
```

## Dependencies

### Core Dependencies
- Vue.js 3.5
- Vue Router 4.6
- Pinia 3.0

### Development Tools
- Vite 7.1
- TypeScript 5.9
- ESLint 9.37
- Prettier 3.6
- Vitest 3.2
