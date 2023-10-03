import {
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { AppSyncIdentityCognito, AppSyncResolverEvent } from "aws-lambda";
import { ulid } from "ulid";
const client = new DynamoDBClient({ region: "us-east-1" });
const TABLE_NAME = process.env.TODO_TABLE_NAME as string;

export const handler = async (event: AppSyncResolverEvent<any>) => {
  const { userId, title } = event.arguments.input;
  const todoId = ulid();
  const now = new Date().toISOString();

  const params: PutItemCommandInput = {
    TableName: TABLE_NAME,
    Item: marshall({
      userId,
      todoId,
      title,
      completed: false,
      createdAt: now,
      updatedAt: now,
    }),
    ConditionExpression:
      "attribute_not_exists(userId) AND attribute_not_exists(todoId)",
  };

  try {
    await client.send(new PutItemCommand(params));
    return {
      userId,
      todoId,
      title,
      completed: false,
      createdAt: now,
      updatedAt: now,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
