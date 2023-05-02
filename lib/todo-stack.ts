import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { CDKContext } from "../cdk.context";
import { createUserTable } from "../constructs/table";
import { createAddUserPostConfirmation } from "../functions/AddUserPostConfirmation/construct";
import { createTodoUserPool } from "../constructs/auth";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class TodoStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    context: CDKContext,
    props?: cdk.StackProps
  ) {
    super(scope, id, props);

    const userDB = createUserTable(this, {
      appName: context.appName,
      env: context.environment,
    });

    const addUserFunc = createAddUserPostConfirmation(this, {
      appName: context.appName,
      env: context.environment,
      userTable: userDB,
    });

    const cognitoAuth = createTodoUserPool(this, {
      appName: context.appName,
      env: context.environment,
      addUserPostConfirmation: addUserFunc,
    });
  }

  // create AWS Cognito
}
