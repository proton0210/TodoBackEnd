import { Construct } from "constructs";
import * as awsDynamodb from "aws-cdk-lib/aws-dynamodb";
import { RemovalPolicy } from "aws-cdk-lib";
import { envNameContext } from "../cdk.context";

type BaseTableProps = {
  appName: string;
  env: envNameContext;
};

// Higher order function patterns!
// CPS -- Usual pattern in scope id props

type CreateUserTableProps = BaseTableProps & {};
export function createUserTable(
  scope: Construct,
  props: CreateUserTableProps
): awsDynamodb.Table {
  const userTable = new awsDynamodb.Table(scope, "UserTable", {
    tableName: `${props.appName}-${props.env}-UserTable`,
    removalPolicy:
      props.env === "develop" ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN,
    billingMode: awsDynamodb.BillingMode.PAY_PER_REQUEST,
    partitionKey: { name: "id", type: awsDynamodb.AttributeType.STRING },
  });

  return userTable;
}
