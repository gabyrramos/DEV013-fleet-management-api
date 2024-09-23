module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
      '^@prisma/client$': '<rootDir>/src/test/mocks/prisma.ts', // Ruta correcta al mock
    },
  };
  