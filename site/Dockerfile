ARG NODE_VERSION="22"
ARG NODE_BASE="public.ecr.aws/docker/library/node:${NODE_VERSION}-slim"

FROM ${NODE_BASE} AS dependencies
WORKDIR "/build"
COPY package*.json ./
COPY site/package.json site/package.json
RUN --mount=type=cache,target=/root/.npm \
    npm install --omit dev --workspace=site

FROM dependencies AS dev-dependencies
RUN --mount=type=cache,target=/root/.npm \
    npm install --workspace=site

FROM dev-dependencies AS app-build
COPY site ./site/
RUN npm run build --workspace=site

FROM ${NODE_BASE} AS app
WORKDIR "/app"
COPY --from=app-build /build/site/package.json ./
COPY --from=dependencies /build/node_modules node_modules/
COPY --from=app-build /build/site/build build/
COPY site/public ./
CMD ["npm", "run", "start"]

FROM ${NODE_BASE} AS lambda-web-adapter
WORKDIR "/var/task"
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.9.0 /lambda-adapter /opt/extensions/lambda-adapter
COPY --from=app-build /build/site/package.json ./
COPY --from=dependencies /build/node_modules node_modules/
COPY --from=app-build /build/site/build/server build/server/
ENV AWS_LWA_READINESS_CHECK_PATH="/health-check"
CMD ["npm", "run", "start"]
