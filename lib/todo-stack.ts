import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { CDKContext } from "../cdk.context";
import { CreateTodoTable, createUserTable } from "../constructs/table";
import { createAddUserPostConfirmation } from "../functions/AddUserPostConfirmation/construct";
import { createTodoUserPool } from "../constructs/auth";
import { createTodoAppAPI } from "../constructs/api/appsync";
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

    const todoDB = CreateTodoTable(this, {
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

    const api = createTodoAppAPI(this, {
      appName: context.appName,
      env: context.environment,
      userpool: cognitoAuth.userPool,
      TodoDB: todoDB,
      userDB: userDB,
    });

    new cdk.CfnOutput(this, "User pool", {
      value: cognitoAuth.userPool.userPoolId,
      description: "User pool",
    });
    new cdk.CfnOutput(this, "User pool Client", {
      value: cognitoAuth.userPoolClient.userPoolClientId,
      description: "client Id",
    });

    new cdk.CfnOutput(this, "Identity Pool", {
      value: cognitoAuth.identityPool.identityPoolId,
      description: "Identity Pool id",
    });

    // output api url
    new cdk.CfnOutput(this, "API URL", {
      value: api.graphqlUrl,
      description: "API URL",
    });
  }
}
