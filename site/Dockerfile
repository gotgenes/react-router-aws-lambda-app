ARG NODE_VERSION="20"
ARG NODE_BASE="public.ecr.aws/docker/library/node:${NODE_VERSION}-slim"

FROM ${NODE_BASE} AS app-build
WORKDIR "/build"
COPY site ./site/
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm install --workspace=site
RUN npm run build --workspace=site
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit dev --workspace=site

FROM ${NODE_BASE} AS app
WORKDIR "/app"
COPY --from=app-build /build/site/package.json ./
COPY --from=app-build /build/node_modules node_modules/
COPY --from=app-build /build/site/build build/
COPY site/public ./
CMD ["npm", "run", "start"]

FROM ${NODE_BASE} AS lambda-web-adapter
WORKDIR "/var/task"
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.9.0 /lambda-adapter /opt/extensions/lambda-adapter
COPY --from=app-build /build/site/package.json ./
COPY --from=app-build /build/node_modules node_modules/
COPY --from=app-build /build/site/build/server build/server/
ENV AWS_LWA_READINESS_CHECK_PATH="/health-check"
CMD ["npm", "run", "start"]
