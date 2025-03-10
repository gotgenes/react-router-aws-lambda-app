import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("health-check", "routes/health-check.tsx"),
] satisfies RouteConfig;
