#!/usr/bin/env bash
# Publishes the Docker image to Amazon ECR.

set -e
set -x

REPOSITORY_NAME="react-router"
IMAGE_PARAMETER_NAME="/react-router/image-digest"
APP_TAG="ReactRouterApp"

query="repositories[?repositoryName==\`$REPOSITORY_NAME\`] | [0].repositoryUri"
ecr_uri=$(aws ecr describe-repositories --output text --query "$query")
docker tag react-router-aws-lambda-lambda:latest "$ecr_uri"
docker push "$ecr_uri:latest"
image_digest=$(docker inspect --format='{{range .RepoDigests}}{{println .}}{{end}}' "${ecr_uri}:latest" | grep amazonaws.com | cut -d '@' -f 2)

if current_parameter_value="$(aws ssm get-parameter --output text --name "$IMAGE_PARAMETER_NAME" --query Parameter.Value 2>/dev/null)"; then
    if [[ $image_digest != $current_parameter_value ]]; then
        aws ssm put-parameter --name "$IMAGE_PARAMETER_NAME" --type String --overwrite --value "$image_digest"
    else
        echo "Image digest unchanged. Skipping update of SSM parameter."
    fi
else
    aws ssm put-parameter --name "$IMAGE_PARAMETER_NAME" --tags "Key=app,Value=$APP_TAG" --type String --value "$image_digest"
fi
