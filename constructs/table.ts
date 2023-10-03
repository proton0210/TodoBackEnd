import { Construct } from "constructs";
import * as awsDynamodb from "aws-cdk-lib/aws-dynamodb";
import { RemovalPolicy } from "aws-cdk-lib";
import { envNameContext } from "../cdk.context";

export function createUserTable(scope: Construct): awsDynamodb.Table {
  const userTable = new awsDynamodb.Table(scope, "UserTable", {
    tableName: `UserTable`,
    removalPolicy: RemovalPolicy.DESTROY,
    billingMode: awsDynamodb.BillingMode.PAY_PER_REQUEST,
    partitionKey: { name: "id", type: awsDynamodb.AttributeType.STRING },
  });

  return userTable;
}

export function CreateTodoTable(scope: Construct): awsDynamodb.Table {
  const todoTable = new awsDynamodb.Table(scope, "TodoTable", {
    tableName: `TodoTable`,
    removalPolicy: RemovalPolicy.DESTROY,
    billingMode: awsDynamodb.BillingMode.PAY_PER_REQUEST,
    partitionKey: { name: "userId", type: awsDynamodb.AttributeType.STRING },
    sortKey: { name: "todoId", type: awsDynamodb.AttributeType.STRING },
  });

  return todoTable;
}
