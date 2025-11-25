import js from '@eslint/js'
import prettierConfig from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier'
import pluginReact from 'eslint-plugin-react'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/*.config.*',
      '**/build/**',
      '**/dist/**',
      '**/.expo/**',
      '**/metro.config.js',
      '**/babel.config.js',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      prettier: prettierPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...pluginReact.configs.flat.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      ...prettierConfig.rules,
      'react/react-in-jsx-scope': 'off', // React 17+ JSX transform
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-require-imports': 'off', // Allow require() for assets
      'no-unused-vars': 'off', // Turn off base rule as it conflicts with TypeScript version
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_', // Allow unused function parameters that start with underscore
          varsIgnorePattern: '^_', // Allow unused variables that start with underscore
          caughtErrorsIgnorePattern: '^_', // Allow unused catch clause variables that start with underscore
        },
      ],
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],
      'max-len': [
        'warn',
        {
          code: 100,
          tabWidth: 2,
          ignoreComments: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreUrls: true,
          ignoreRegExpLiterals: true,
        },
      ],
    },
  }
)
