module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js'],
    rootDir: '.',
    testMatch: ['<rootDir>/src/**/*.spec.ts'], // UNIQUEMENT les tests unitaires
    coverageDirectory: './coverage',
    collectCoverageFrom: ['src/**/*.(t|j)s'],
    coverageReporters: ['json', 'lcov', 'text'],
};
