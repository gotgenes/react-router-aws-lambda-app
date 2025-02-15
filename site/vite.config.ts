import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ command, isSsrBuild }) => {
  return {
    plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
    build:
      command === "build" && isSsrBuild
        ? { rollupOptions: { input: "app.ts" } }
        : {},
    ssr: command === "build" ? { noExternal: true, target: "node" } : {},
  };
});
