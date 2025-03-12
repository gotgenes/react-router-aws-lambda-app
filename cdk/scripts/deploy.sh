#!/usr/bin/env bash

set -e

cd "$(dirname "$0")/.."

if aws sts get-caller-identity >/dev/null; then
    npx cdk deploy "$@"
else
    echo 'Not logged in to AWS. Try "npm run login"' 1>&2
fi
