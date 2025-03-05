#!/usr/bin/env bash

set -e

# Set the CWD to the site directory
cd "$(dirname "$0")/.."

# Ensure tooling is installed
npm install
# Build the client and server bundles
NODE_ENV=production npx react-router build
cp package.json run.sh build/server/

# Set the CWD to the project root directory
cd "$(git rev-parse --show-toplevel)"

# Package the dependencies for the server
npm ci --omit dev --workspace=site
find node_modules -depth 1 -type l -exec rm {} \;
cp -R node_modules site/build/server/
# Re-install tooling
npm ci
