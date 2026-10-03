import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

/**
 * Flat ESLint config.
 *
 * `eslint-config-next` v16 ships native flat configs (no `FlatCompat`
 * translation layer), so we compose them directly.
 */
const eslintConfig = [
  {
    ignores: ['.next/**', 'node_modules/**', 'out/**', 'next-env.d.ts', 'coverage/**', 'public/**'],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'smart'],
      'prefer-const': 'error',
      'object-shorthand': 'warn',
    },
  },
  {
    // Editorial copy is authored as JSX text, where curly quotes and
    // apostrophes are correct typography rather than escaping bugs.
    files: ['src/content/post-bodies/**/*.tsx'],
    rules: {
      'react/no-unescaped-entities': 'off',
    },
  },
  {
    // Images in blog/article bodies are authored by hand and always decorative
    // or already described in the surrounding prose.
    files: ['src/content/post-bodies/**/*.tsx'],
    rules: {
      '@next/next/no-img-element': 'off',
    },
  },
]

export default eslintConfig
