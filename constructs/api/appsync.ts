import { envNameContext } from "../../cdk.context";
import { Construct } from "constructs";
import * as awsAppsync from "aws-cdk-lib/aws-appsync";
import * as path from "path";
import { UserPool } from "aws-cdk-lib/aws-cognito";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { IRole } from "aws-cdk-lib/aws-iam";
import { PrimaryKey, AttributeValues } from "aws-cdk-lib/aws-appsync";
import { createTodo, listTodos } from "../compute";
interface AppSyncApiProps {
  userpool: UserPool;
  TodoDB: Table;
  userDB: Table;
}

export function createTodoAppAPI(scope: Construct, props: AppSyncApiProps) {
  const api = new awsAppsync.GraphqlApi(scope, "TodoAPi", {
    name: `TodoAPI`,
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

  const listTodoResolver = api
    .addLambdaDataSource(
      "List Todo Data Source",
      listTodos(scope, {
        todoTable: props.TodoDB,
      })
    )
    .createResolver("ListTodosLambdaResolver", {
      typeName: "Query",
      fieldName: "listTodos",
    });

  const createTodoResolver = api
    .addLambdaDataSource(
      "Create Todo Data Source",
      createTodo(scope, {
        todoTable: props.TodoDB,
      })
    )
    .createResolver("CreateTodoLambdaResolver", {
      typeName: "Mutation",
      fieldName: "createTodo",
    });

  // const updateTodoResolver = TodoDataSource.createResolver(
  //   "Update Todo Data Source Resolver",
  //   {
  //     typeName: "Mutation",
  //     fieldName: "updateTodo",
  //     requestMappingTemplate: awsAppsync.MappingTemplate.fromFile(
  //       path.join(
  //         __dirname,
  //         "./ResolverFunctions/Mutations/updateTodo/request.vtl"
  //       )
  //     ),
  //     responseMappingTemplate: awsAppsync.MappingTemplate.fromFile(
  //       path.join(
  //         __dirname,
  //         "./ResolverFunctions/Mutations/updateTodo/response.vtl"
  //       )
  //     ),
  //   }
  // );

  // const deleteTodoResolver = TodoDataSource.createResolver(
  //   "Delete Todo Data Source Resolver",
  //   {
  //     typeName: "Mutation",
  //     fieldName: "deleteTodo",
  //     requestMappingTemplate: awsAppsync.MappingTemplate.fromFile(
  //       path.join(
  //         __dirname,
  //         "./ResolverFunctions/Mutations/deleteTodo/request.vtl"
  //       )
  //     ),
  //     responseMappingTemplate: awsAppsync.MappingTemplate.fromFile(
  //       path.join(
  //         __dirname,
  //         "./ResolverFunctions/Mutations/deleteTodo/response.vtl"
  //       )
  //     ),
  //   }
  // );

  return api;
}
