# React Router on AWS Lambda

This project demonstrates a way to run [React Router Framework](https://reactrouter.com/) on [AWS Lambda](https://aws.amazon.com/lambda/).

## Architecture

The project uses the following AWS resources:

- **CloudFront**: Provides the public URL, serves the static assets, and routes requests to the Lambda function.
- **Lambda**: Runs the React Router application (the backend bundle).
- **S3**: Stores the static assets (the frontend bundle, files in `assets`, and files in `public`).

## Usage

### Prerequisites

#### AWS CLI

You need to have the [AWS CLI](https://aws.amazon.com/cli/) installed and configured with your AWS account.

#### IAM Identity Center (Recommended)

[AWS recommends](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-authentication.html) using [IAM Identity Center](https://docs.aws.amazon.com/singlesignon/latest/userguide/what-is.html) to access short-term credentials programmatic access to AWS services (e.g., AWS CLI, or using the CDK locally).
Refer to [AWS's documentation on configuring authentication with IAM Identity Center](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html) if you have not yet set it up.
The `npm run login` script uses this method of authentication.

#### CDK and AWS CLI environment variables

This project uses the [AWS Cloud Development Kit (CDK)](https://aws.amazon.com/cdk/) to deploy the AWS resources.
It will install the CDK CLI as a development dependency, so you don't need to install it globally, however, you will want to set the following environment variables:

```sh
export CDK_DEFAULT_ACCOUNT=123456789012  # your AWS account number
export CDK_DEFAULT_REGION=us-east-1      # or your preferred region
export AWS_PROFILE=admin                 # or your preferred profile
```

You can use the `aws sts get-caller-identity` command to get your account number.
Alternatively, your account number can be found in the AWS Management Console under "My Account" in the upper right corner.

It is important that the AWS profile you use has the necessary permissions to create the resources in the stack.
Specifically, it will need enough permissions to create new IAM roles—at least on first deployment.
Typically this is an administrator role.
Once the roles have been created, you can use a profile with fewer permissions for subsequent deployments.

### Deployment

#### Install dependencies

```sh
npm install
```

This will download the necessary dependencies for CDK and the React Router application.

#### Log in to AWS (IAM Identity Center)

If you are using IAM Identity Center as recommended above, you can log in with the following command:

```sh
npm run login
```

Follow the prompts in your browser to log in.

#### Bootstrap the CDK (first time only)

If you have not used the CDK in your Amazon account before, you will need to bootstrap the CDK:

```sh
npm run cdk bootstrap --workspace=cdk
```

Refer to the [CDK bootstrapping documentation](https://docs.aws.amazon.com/cdk/latest/guide/bootstrapping.html) for more information.

#### Authenticate the Docker client to Amazon Elastic Container Registry (ECR) (first time only)

Your local Docker client will need to authenticate with Amazon ECR prior to publishing Docker images used for the Lambda function.
You can authenticate with the following command:

```sh
npm run login-docker
```

#### Build the site

```sh
npm run build
```

#### Publish the Docker image

```sh
npm run publish-docker
```

#### Deploy the stack

```sh
npm run deploy
```

#### Build, publish, and deploy in one command

Alternatively, you can use the following command to run the build, publish, and deploy steps in one command:

```sh
npm run build-publish-deploy
```

### Testing

This project contains some end-to-end tests via [Playwright](https://playwright.dev/).

Execute them against a local server with:

```sh
npm run test
```

You can also execute them against the deployed stack with:

```sh
BASE_URL=$CLOUDFRONT_URL_OUTPUT_BY_CDK npm run test
```

## Features of this solution

### Vite-based builds

This project outputs the React Router build directly to the Lambda interface using Vite—the foundation of React Router, itself.
It takes advantage of Vite virtual modules provided by React Router (see [the `import` in `app.ts`](https://github.com/gotgenes/react-router-aws-lambda-app/blob/main/site/app.ts#L6)), so that Vite manages the entire build pipeline.
Other solutions use a second build step to convert the React Router build output to the Lambda interface, creating intermediate build artifacts and multi-step builds.

### Lambda integration through AWS Lambda Web Adapter

This solution uses [AWS Lambda Web Adapter](https://github.com/awslabs/aws-lambda-web-adapter) to bridge the gap between the Lambda interface and the React Router application.

### Minimal architecture

Only the necessary AWS resources are created, and the CDK stack is kept as simple as possible.
CloudFront handles both the serving of static assets through its CDN, and routing requests to the Lambda function, with no API gateway intermediary to add extra expenses.

### CDK

This project uses CDK for deployment, which has first-party support from AWS.

## Other resources

- A [GitHub discussion on updating the `@remix-run/architect` package to use the Vite version of Remix](https://github.com/remix-run/remix/discussions/8836).
- A [GitHub discussion on deploying Remix to Lambda](https://github.com/remix-run/remix/discussions/4678).
- [aws-lambda-web-adapter](https://github.com/awslabs/aws-lambda-web-adapter)'s [Remix example](https://github.com/awslabs/aws-lambda-web-adapter/tree/main/examples/remix-zip).
- [remix-starter-serverless](https://github.com/shamsup/remix-starter-serverless) if you'd rather use [Serverless Framework](https://www.serverless.com/framework).
- ["Remix & CDK fun"](https://serverlessup.com/ramblings/remix-&-cdk-fun-08-11-2022) showing an alternative architecture with API Gateway and authorizer functions.
- ["Deploying Remix-Vite on Lambda using Pulumi"](https://dev.to/gautierblandin/deploying-remix-vite-on-lambda-using-pulumi-41oj).
