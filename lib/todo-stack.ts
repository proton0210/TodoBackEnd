import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { CreateTodoTable, createUserTable } from "../constructs/table";
import { createAddUserPostConfirmation } from "../constructs/compute";
import { createTodoUserPool } from "../constructs/auth";
import { createTodoAppAPI } from "../constructs/api/appsync";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class TodoStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const userDB = createUserTable(this);

    const todoDB = CreateTodoTable(this);

    const addUserFunc = createAddUserPostConfirmation(this, {
      userTable: userDB,
    });

    const cognitoAuth = createTodoUserPool(this, {
      addUserPostConfirmation: addUserFunc,
    });

    const api = createTodoAppAPI(this, {
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
