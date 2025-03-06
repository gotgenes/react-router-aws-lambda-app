FROM public.ecr.aws/docker/library/node:20-slim AS app-build
WORKDIR "/build"
COPY site /build/site/
COPY package*.json /build/
RUN --mount=type=cache,target=/root/.npm \
    npm install
RUN npm run build --workspace=site
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit dev --workspace=site

FROM public.ecr.aws/docker/library/node:20-slim AS app
WORKDIR "/app"
COPY --from=app-build /build/site/package.json ./
COPY --from=app-build /build/node_modules ./node_modules/
COPY --from=app-build /build/site/build ./build/
ENV PORT=8080
EXPOSE 8080

CMD ["npm", "run", "start"]
