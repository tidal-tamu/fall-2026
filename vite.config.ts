import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    // React Three Fiber pulls its own React through the dep graph; dedupe so the
    // whole app shares a single React instance (avoids "Invalid hook call").
    resolve: {
        dedupe: ["react", "react-dom"],
    },
    optimizeDeps: {
        include: ["react", "react-dom"],
    },
});
