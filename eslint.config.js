import eslint from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  // Базовые настройки
  {
    files: ['**/*.{js,jsx,mjs,cjs}'], // Применяется к этим файлам
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        browser: true,
        es2021: true,
        node: true,
        fetch: 'readonly',
        console: 'readonly',
      },
    },
    settings: {
      react: { version: '18.2' },
    },
    ignores: ['dist', '.eslintrc.cjs', 'node_modules', 'notes.jsx'],
  },
  // Рекомендованные правила ESLint
  eslint.configs.recommended,
  // Правила для React
  {
    plugins: {
      react: reactPlugin,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs['jsx-runtime'].rules, // Для plugin:react/jsx-runtime
      'react/jsx-no-target-blank': 'off',
    },
  },
  // Правила для React Hooks
  {
    plugins: {
      'react-hooks': reactHooksPlugin,
    },
    rules: reactHooksPlugin.configs.recommended.rules,
  },
  // Правила для React Refresh
  {
    plugins: {
      'react-refresh': reactRefreshPlugin,
    },
    rules: {
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'no-console': 'warn', // Предупреждение при использовании console
    },
  },
  // Правила для Prettier
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      ...prettierConfig.rules, // Для plugin:prettier/recommended
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],
    },
  },
  // Правило для одинарных кавычек
  {
    rules: {
      quotes: [
        'error',
        'single',
        {
          avoidEscape: true,
          allowTemplateLiterals: true,
        },
      ],
    },
  },
];
