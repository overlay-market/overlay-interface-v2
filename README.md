# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list


# Local SDK Integration Setup

This guide explains how to set up your frontend project to use the local Overlay SDK.

## Prerequisites

- PNPM installed on your system
- Frontend project (`overlay-interface-v2`) and SDK project (`overlay-sdk`) in the same parent directory

## Setup Steps

1. Navigate to your frontend project directory:

   ```
   cd path/to/overlay-interface-v2
   ```

2. Create a `pnpm-workspace.yaml` file in the frontend project root:

   ```
   touch pnpm-workspace.yaml
   ```

3. Add the following content to `pnpm-workspace.yaml`:

   ```yaml
   packages:
     - '.'
     - '../overlay-sdk/packages/overlay-sdk'
   ```

   This configuration includes your frontend project and the local SDK in the workspace.

4. Build the SDK:
  Navigate to the SDK directory and build it

5. Run PNPM install in your frontend project directory:

   ```
   pnpm install
   ```

## Usage

You can now import and use the SDK in your frontend code:

```typescript
import { OverlaySDK } from 'overlay-sdk';
```

## Development Workflow

1. Make changes to the SDK in the `overlay-sdk` directory.
2. Rebuild the SDK:
   ```
   cd ../overlay-sdk/packages/overlay-sdk
   pnpm run build
   ```
