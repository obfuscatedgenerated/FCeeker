const {createDefaultPreset} = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
    testEnvironment: "node",
    testMatch: ["<rootDir>/tests/**/*.test.ts"],
    transform: {
        ...tsJestTransformCfg,
    },
    collectCoverageFrom: [
        "src/**/*.{ts,js}",
        "!src/**/*.d.ts",
        "!src/**/types.ts",
    ],
    coverageReporters: [
        "text",
        "lcov",
        "json-summary"
    ]
};
