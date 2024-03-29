import * as AWS from "aws-sdk";
const docClient = new AWS.DynamoDB.DocumentClient();
import { PostConfirmationConfirmSignUpTriggerEvent } from "aws-lambda";

exports.handler = async (event: PostConfirmationConfirmSignUpTriggerEvent) => {
  const date = new Date();
  const isoDate = date.toISOString();

  //construct the param
  const params = {
    TableName: process.env.USER_TABLE_NAME as string,
    Item: {
      __typename: "User",
      id: event.request.userAttributes.sub,
      createdAt: isoDate, // ex) 2023-02-16T16:07:14.189Z
      updatedAt: isoDate,
      username: event.userName,
      email: event.request.userAttributes.email,
      name: event.request.userAttributes.given_name,
    },
  };

  //try to add to the DB, otherwise throw an error
  try {
    await docClient.put(params).promise();
    return event;
  } catch (err: any) {
    console.log(err);
    return event;
  }
};
