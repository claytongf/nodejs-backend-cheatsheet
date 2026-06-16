/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts', '**/*.spec.ts'],
  // Loads .env.test before any test module (and the Prisma client) is imported.
  setupFiles: ['<rootDir>/src/tests/setup-env.ts'],
  moduleNameMapper: {
    // Allow ESM-style `./foo.js` imports to resolve to `./foo.ts` in tests.
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.ts$': ['ts-jest', { useESM: true }],
  },
  clearMocks: true,
};
