import { Construct } from "constructs";
import * as awsCognito from "aws-cdk-lib/aws-cognito";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { envNameContext } from "../cdk.context";
import {
  IdentityPool,
  UserPoolAuthenticationProvider,
} from "@aws-cdk/aws-cognito-identitypool-alpha";

/*
When a user signs up for an application using Cognito, a unique ID is generated for them, 
along with their email and username. While custom attributes can be added, they are generally expected to remain unchanged. 
This is because that information is stored in the JSON Web Token (JWT) provided by Cognito. 
To avoid users having to log out and log in to update their information, it's best to store user data in a User table.
*/

type TodoUserPool = {
  appName: string;
  env: envNameContext;
  addUserPostConfirmation: NodejsFunction;
};
export function createTodoUserPool(scope: Construct, props: TodoUserPool) {
  // the L2 Construct for a userpool
  const userPool = new awsCognito.UserPool(
    scope,
    `${props.appName}-${props.env}-userpool`,
    {
      userPoolName: `${props.appName}-${props.env}-userpool`,
      selfSignUpEnabled: true,
      accountRecovery: awsCognito.AccountRecovery.EMAIL_ONLY,
      userVerification: {
        emailStyle: awsCognito.VerificationEmailStyle.CODE,
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
      },
      lambdaTriggers: {
        postConfirmation: props.addUserPostConfirmation,
      },
    }
  );

  const userPoolClient = new awsCognito.UserPoolClient(
    scope,
    `${props.appName}-${props.env}-userpoolClient`,
    {
      userPool,
    }
  );

  const identityPool = new IdentityPool(
    scope,
    `${props.appName}-${props.env}-identityPool`,
    {
      identityPoolName: `${props.appName}-${props.env}IdentityPool`,
      allowUnauthenticatedIdentities: true,
      authenticationProviders: {
        userPools: [
          new UserPoolAuthenticationProvider({
            userPool: userPool,
            userPoolClient: userPoolClient,
          }),
        ],
      },
    }
  );

  return { userPool, userPoolClient, identityPool };
}
