#!/usr/bin/env bash
# Authenticates local Docker cilent to the Amazon ECR registry.

set -e
set -x

ecr_uri=$(aws ecr describe-repositories --output text --query 'repositories[?repositoryName==`react-router`] | [0].repositoryUri')
registry_url=${ecr_uri%/*}
aws ecr get-login-password --region "$CDK_DEFAULT_REGION" | docker login --username AWS --password-stdin "$registry_url"
