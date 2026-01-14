import oclifConfig from 'eslint-config-oclif';

export default [
  ...oclifConfig,
  {
    ignores: ['**/dist/**', '**/lib/**', '**/node_modules/**'],
  },
  {
    files: ['test/**/*.ts', 'test/**/*.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      'n/no-extraneous-require': 'off',
      'n/no-missing-require': 'off',
      'unicorn/prefer-module': 'off',
    },
  },
];
