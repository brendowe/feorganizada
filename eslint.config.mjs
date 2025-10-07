import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
    },
    extends: ['airbnb-base', 'plugin:prettier/recommended'],
  },
]);
