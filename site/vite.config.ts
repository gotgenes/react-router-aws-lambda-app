import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    {
      name: "react-router-lambda-web-adapter",
      apply(_config, env): boolean {
        return env.command === "build" && env?.isSsrBuild === true;
      },
      config: async () => {
        return { build: { ssr: "app.ts" } };
      },
    },
  ],
});
