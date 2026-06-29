const rnConfig = require('@dawn/config/eslint/react-native');

module.exports = [
  ...rnConfig,
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'no-console': 'error',
    },
  },
  {
    files: ['src/services/logger/Logger.ts'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    files: ['src/features/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features/*/**'],
              message: 'Features must not import other features. Use services or shared packages.',
            },
          ],
        },
      ],
    },
  },
];
