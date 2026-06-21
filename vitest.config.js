import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    test: {
        environment: "jsdom",
        setupFiles: "./src/test/setup.js",
        globals: true,
        exclude: ["e2e/**", "node_modules/**"],
        coverage: {
            provider: "v8",
            reporter: ["text", "html"],
            include: ["src/**/*.{js,jsx}"],
            exclude: ["src/test/**", "**/*.test.{js,jsx}"],
        },
    },
    resolve: {
        alias: {
            "@": "/src",
        },
    },
});
