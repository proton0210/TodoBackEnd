import { envNameContext } from "../../cdk.context";
import { Construct } from "constructs";
import * as awsAppsync from "aws-cdk-lib/aws-appsync";
import * as path from "path";
import { UserPool } from "aws-cdk-lib/aws-cognito";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { IRole } from "aws-cdk-lib/aws-iam";
import { PrimaryKey, AttributeValues } from "aws-cdk-lib/aws-appsync";
interface AppSyncApiProps {
  appName: string;
  env: envNameContext;
  userpool: UserPool;
  TodoDB: Table;
  userDB: Table;
}

export function createTodoAppAPI(scope: Construct, props: AppSyncApiProps) {
  const api = new awsAppsync.GraphqlApi(scope, "TodoAPi", {
    name: `${props.appName}-${props.env}-TodoAPI`,
    schema: awsAppsync.SchemaFile.fromAsset(
      path.join(__dirname, "./graphql/schema.graphql")
    ),
    authorizationConfig: {
      defaultAuthorization: {
        authorizationType: awsAppsync.AuthorizationType.USER_POOL,
        userPoolConfig: {
          userPool: props.userpool,
        },
      },
      additionalAuthorizationModes: [
        {
          authorizationType: awsAppsync.AuthorizationType.IAM,
        },
      ],
    },
    logConfig: {
      fieldLogLevel: awsAppsync.FieldLogLevel.ALL,
    },
  });

  const TodoDataSource = api.addDynamoDbDataSource(
    `${props.appName}-${props.env}-TodoDataSouce`,
    props.TodoDB
  );

  const createTodoResolver = TodoDataSource.createResolver(
    "Create Todo Data Source Resolver",
    {
      typeName: "Mutation",
      fieldName: "createTodo",
      requestMappingTemplate: awsAppsync.MappingTemplate.fromFile(
        path.join(
          __dirname,
          "./ResolverFunctions/Mutations/createTodo/request.vtl"
        )
      ),
      responseMappingTemplate: awsAppsync.MappingTemplate.fromFile(
        path.join(
          __dirname,
          "./ResolverFunctions/Mutations/createTodo/response.vtl"
        )
      ),
    }
  );

  const createListTodosResolver = TodoDataSource.createResolver(
    "Create List Todos Data Source Resolver",
    {
      typeName: "Query",
      fieldName: "listTodos",
      requestMappingTemplate: awsAppsync.MappingTemplate.fromFile(
        path.join(__dirname, "./ResolverFunctions/Query/listTodos/request.vtl")
      ),
      responseMappingTemplate: awsAppsync.MappingTemplate.fromFile(
        path.join(__dirname, "./ResolverFunctions/Query/listTodos/response.vtl")
      ),
    }
  );

  return api;
}
