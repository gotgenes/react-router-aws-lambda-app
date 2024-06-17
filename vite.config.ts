import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

installGlobals();

export default defineConfig({
	plugins: [
		remix(),
		tsconfigPaths(),
		{
			name: "remix-apigatewayv2-adapter",
			apply(_config, env): boolean {
				return env.command === "build" && env?.isSsrBuild === true;
			},
			config: async (_config, _env) => {
				return {
					build: {
						ssr: "handler.ts",
					},
				};
			},
		},
	],
});
