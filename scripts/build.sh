#!/usr/bin/env bash
set -e
set -x

npm run build --workspace=site
# Lambda doesn't support provenance attestations and multi-platform builds
# https://github.com/aws/aws-cdk/issues/30258
# https://github.com/aws/aws-cdk/issues/31548
docker buildx bake --provenance=false
npm run build --workspace=cdk
