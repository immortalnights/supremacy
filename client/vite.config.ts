import { defineConfig } from "vite"
import { resolve } from "path"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": resolve(__dirname, "src"),
            "@server": resolve(__dirname, "..", "server", "src"),
        },
    },
    server: {
        proxy: {
            "/ws": {
                target: "http://127.0.0.1:3010/ws",
                ws: true,
                secure: false,
            },
        },
    },
})
