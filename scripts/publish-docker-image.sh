#!/usr/bin/env bash
# Publishes the Docker image to Amazon ECR.

set -e
set -x

ecr_uri=$(aws ecr describe-repositories --output text --query 'repositories[?repositoryName==`react-router`] | [0].repositoryUri')
docker tag react-router-aws-lambda-lambda:latest "$ecr_uri"
docker push "$ecr_uri:latest"
