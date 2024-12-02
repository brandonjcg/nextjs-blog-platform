module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['@testing-library/jest-dom'],
    transform: {
        '^.+\\.tsx?$': ['babel-jest', { configFile: './jest.babel.config.js' }],
    },
    moduleNameMapper: {
        "^@/components/(.*)$": "<rootDir>/components/$1",
        "^@/pages/(.*)$": "<rootDir>/pages/$1",
        "^@/utils/(.*)$": "<rootDir>/utils/$1",
    },
    testPathIgnorePatterns: [
        "/node_modules/",
        "/.next/",
    ]
}