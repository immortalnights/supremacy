/// <reference types="vitest" />
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import tsconfigPaths from "vite-tsconfig-paths"
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    build: {
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, "index.html"),
                supremacy: path.resolve(__dirname, "src", "Supremacy", "index.ts"),
            },
        },
    },
    test: {
        globals: true,
        environment: "happy-dom",
    },
})
