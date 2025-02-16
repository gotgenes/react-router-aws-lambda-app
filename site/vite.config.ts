import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ command }) => {
  return {
    plugins: [
      tailwindcss(),
      reactRouter(),
      tsconfigPaths(),
      {
        name: "react-router-apigatewayv2-adapter",
        apply(_config, env): boolean {
          return env.command === "build" && env?.isSsrBuild === true;
        },
        config: async () => {
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
    ssr: command === "build" ? { noExternal: true, target: "node" } : {},
  };
});
