import { Table } from "aws-cdk-lib/aws-dynamodb";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as iam from "aws-cdk-lib/aws-iam";
import path = require("path");
type userTableProps = {
  userTable: Table;
};

type todoTableProps = {
  todoTable: Table;
};
type UserFunc = (scope: Construct, props: userTableProps) => NodejsFunction;
type TodoFunc = (scope: Construct, props: todoTableProps) => NodejsFunction;
export const createAddUserPostConfirmation: UserFunc = (
  scope: Construct,
  props: userTableProps
) => {
  const addUserFunc = new NodejsFunction(scope, "addUserFunc", {
    functionName: `addUserFunc`,
    runtime: Runtime.NODEJS_16_X,
    handler: "handler",
    entry: path.join(
      __dirname,
      `../functions/AddUserPostConfirmation/index.ts`
    ),
    environment: {
      // pass the DynamoDB table name to the function as an env var
      USER_TABLE_NAME: props.userTable.tableName,
    },
  });

  addUserFunc.addToRolePolicy(
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["dynamodb:PutItem"],
      resources: [props.userTable.tableArn],
    })
  );
  return addUserFunc;
};

export const listTodos: TodoFunc = (
  scope: Construct,
  props: todoTableProps
) => {
  const listTodoFunc = new NodejsFunction(scope, "listTodoFunc", {
    functionName: `listTodoFunc`,
    runtime: Runtime.NODEJS_16_X,
    handler: "handler",
    entry: path.join(__dirname, `../functions/QueryListTodo/index.ts`),
    environment: {
      // pass the DynamoDB table name to the function as an env var
      TODO_TABLE_NAME: props.todoTable.tableName,
    },
  });

  listTodoFunc.addToRolePolicy(
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["dynamodb:Query"],
      resources: [props.todoTable.tableArn],
    })
  );

  return listTodoFunc;
};

export const createTodo: TodoFunc = (
  scope: Construct,
  props: todoTableProps
) => {
  const createTodoFunc = new NodejsFunction(scope, "createTodoFunc", {
    functionName: `createTodoFunc`,
    runtime: Runtime.NODEJS_16_X,
    handler: "handler",
    entry: path.join(__dirname, `../functions/MutationCreateTodo/index.ts`),
    environment: {
      TODO_TABLE_NAME: props.todoTable.tableName,
    },
  });

  createTodoFunc.addToRolePolicy(
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["dynamodb:PutItem"],
      resources: [props.todoTable.tableArn],
    })
  );

  return createTodoFunc;
};

export const updateTodo: TodoFunc = (
  scope: Construct,
  props: todoTableProps
) => {
  const updateTodoFunc = new NodejsFunction(scope, "updateTodoFunc", {
    functionName: `updateTodoFunc`,
    runtime: Runtime.NODEJS_16_X,
    handler: "handler",
    entry: path.join(__dirname, `../functions/MutationUpdateTodo/index.ts`),
    environment: {
      TODO_TABLE_NAME: props.todoTable.tableName,
    },
  });

  updateTodoFunc.addToRolePolicy(
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["dynamodb:UpdateItem"],
      resources: [props.todoTable.tableArn],
    })
  );

  return updateTodoFunc;
};

export const deleteTodo: TodoFunc = (
  scope: Construct,
  props: todoTableProps
) => {
  const deleteTodoFunc = new NodejsFunction(scope, "deleteTodoFunc", {
    functionName: `deleteTodoFunc`,
    runtime: Runtime.NODEJS_16_X,
    handler: "handler",
    entry: path.join(__dirname, `../functions/MutationDeleteTodo/index.ts`),
    environment: {
      TODO_TABLE_NAME: props.todoTable.tableName,
    },
  });

  deleteTodoFunc.addToRolePolicy(
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["dynamodb:DeleteItem"],
      resources: [props.todoTable.tableArn],
    })
  );

  return deleteTodoFunc;
};
