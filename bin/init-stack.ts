import { CDKContext, TEnvironment } from "../cdk.context";
import * as cdk from "aws-cdk-lib";
import * as gitBranch from "git-branch";

const getCurrentBranch = (): string => {
  const currentBranch = gitBranch.sync();
  return currentBranch;
};

/*
 Next, we'll want to get our branch, and based on that create an object that matches our CDKContext types
 */

const getEnvironmentContext = (app: cdk.App): CDKContext => {
  const currentBranch = getCurrentBranch();
  const environments = app.node.tryGetContext("environments"); // from cdk.context.json
  const environment = environments.find(
    (env: TEnvironment) => env.branchName === currentBranch
  );
  const globals = app.node.tryGetContext("globals"); // from cdk.context.json File

  return { ...globals, ...environment };
};

// Initialize the stack
export const initStack = () => {
  const app = new cdk.App();
  const context = getEnvironmentContext(app) as CDKContext;
  const stackName = `${context.appName}-stack-${context.environment}`;

  // tag resources in AWS to find the easier
  const tags = {
    Environment: context.environment,
    AppName: `${context.appName}`,
  };

  // Provide required properties to our Stack
  const stackProps: cdk.StackProps = {
    env: {
      region: context.region,
      account: context.account,
    },
    stackName: stackName,
    description: context.appDescription,
    tags,
  };

  return {
    app,
    stackNameWithEnv: stackName,
    stackProps,
    context,
  };
};
