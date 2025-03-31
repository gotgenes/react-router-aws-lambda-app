# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [6.0.0](https://github.com/gotgenes/react-router-aws-lambda-app/compare/v5.1.0...v6.0.0) (2025-03-31)

### ⚠ BREAKING CHANGES

- Major version upgrade of dependencies.
- Upgrade to Node v22.

### Features

- Major version upgrade of dependencies. ([cdb76bb](https://github.com/gotgenes/react-router-aws-lambda-app/commit/cdb76bb09dcdf4123341f178bb632a450aa8ddf9))
- Upgrade to Node v22. ([a2435bb](https://github.com/gotgenes/react-router-aws-lambda-app/commit/a2435bb8a9c50f4b58bb1cf5507ab64c8e860777))

## [5.1.0](https://github.com/gotgenes/react-router-aws-lambda-app/compare/v5.0.0...v5.1.0) (2025-03-30)

### Features

- **app:** Add a suspense route. ([3de091f](https://github.com/gotgenes/react-router-aws-lambda-app/commit/3de091f9ae1645777f89055c7c78d4c5d35824da))
- **app:** Increase the stream timeout. ([ec6a0d9](https://github.com/gotgenes/react-router-aws-lambda-app/commit/ec6a0d9e009ee0e11f776270f7ee3c909f85bccf))
- **cdk:** Increase the memory size and duration. ([bfa7bb9](https://github.com/gotgenes/react-router-aws-lambda-app/commit/bfa7bb9cd413839e620cdac2f3c0f6df7e4ead37))

### Bug Fixes

- **app:** Allow streaming to Amazon CloudFront. ([d61b584](https://github.com/gotgenes/react-router-aws-lambda-app/commit/d61b584a1be890b8f7f578cb4344a246369238e8))
- **cdk:** Update image digest at deployment time. ([9e6f6b3](https://github.com/gotgenes/react-router-aws-lambda-app/commit/9e6f6b3535e280056cc7e5618c9500fa4a0d1e85))
- **cdk:** Use the image digest to ensure new image gets deployed. ([43003df](https://github.com/gotgenes/react-router-aws-lambda-app/commit/43003dfd39650e0950610f328a463757ca4fe33a))
- **dev:** Get AWS region from profile, if unset. ([6b57e07](https://github.com/gotgenes/react-router-aws-lambda-app/commit/6b57e07d7fdd67052e5a179a23f2a64f7387cf9e))
- **test:** Don't check for suspended state. ([35591b3](https://github.com/gotgenes/react-router-aws-lambda-app/commit/35591b3060b529dfa5863c9afe1ec9fe73ec96a9))

## v5.0.0 (2025-03-11)

Separate building and publishing the Docker image to Amazon Elastic Container Registry (ECR) from deploying the backend stack.

## v4.1.0 (2025-03-11)

Add a route `/health-check` for readiness checks.

## v4.0.0 (2025-03-09)

Switch to a Docker container image for distribution to AWS Lambda.

## v3.0.0 (2025-03-05)

Switch to using [AWS Lambda Web Adapter](https://github.com/awslabs/aws-lambda-web-adapter/).

## v2.0.0 (2025-02-11)

Upgrade from Remix to [React Router Framework](https://reactrouter.com/home).

## v1.0.0 (2025-02-04)

Final release using [Remix](https://remix.run/).
