import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { builtinModules as builtin } from "node:module";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    {
      name: "react-router-apigatewayv2-adapter",
      apply(_config, env): boolean {
        return env.command === "build" && env?.isSsrBuild === true;
      },
      config: async (_config, _env) => {
        return {
          build: {
            ssr: true,
            rollupOptions: {
              input: { index: "handler.ts" },
              output: {
                entryFileNames: "[name].mjs",
              },
            },
          },
        };
      },
    },
  ],
  ssr: {
    noExternal: true,
    external: builtin,
  },
});
