#!/usr/bin/env bash
set -e
set -x

npm run build --workspace=site
docker compose build
npm run build --workspace=cdk
