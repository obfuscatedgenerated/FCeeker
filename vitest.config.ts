import {defineConfig} from "vitest/config";

export default defineConfig({
    test: {
        projects: [
            {
                test: {
                    name: "core",
                    include: ["packages/core/test/**/*.test.ts"],
                    environment: "node",
                },
            },
            {
                test: {
                    name: "parser-antlr",
                    include: ["packages/parser-antlr/test/**/*.test.ts"],
                    environment: "node",
                },
            },
            {
                test: {
                    name: "integration",
                    include: ["test/**/*.test.ts"],
                    environment: "node",
                },
            },
        ],
        coverage: {
            provider: "v8",
            include: ["packages/*/src/**/*.ts"],
            exclude: ["**/*.d.ts", "**/types.ts", "**/generated/**"],
            reporter: ["text", "lcov", "json-summary"],
        },
    },
});