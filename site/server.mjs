#!/usr/bin/env node

// Short-circuit the type-checking of the built output.
const BUILD_PATH = process.argv[2] || "./build/server/index.mjs";
const PORT = Number.parseInt(process.env.PORT || "3000");

const app = await import(BUILD_PATH).then((mod) => mod.app);
app.disable("x-powered-by");

console.log("Starting production server");
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
