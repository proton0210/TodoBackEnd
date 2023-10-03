import { Construct } from "constructs";
import * as awsCognito from "aws-cdk-lib/aws-cognito";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import {
  IdentityPool,
  UserPoolAuthenticationProvider,
} from "@aws-cdk/aws-cognito-identitypool-alpha";

type TodoUserPool = {
  addUserPostConfirmation: NodejsFunction;
};
export function createTodoUserPool(scope: Construct, props: TodoUserPool) {
  const userPool = new awsCognito.UserPool(scope, `UserPool`, {
    userPoolName: `TodoUserPool`,
    selfSignUpEnabled: true,
    accountRecovery: awsCognito.AccountRecovery.EMAIL_ONLY,
    autoVerify: {
      email: true,
    },
    passwordPolicy: {
      minLength: 8,
      requireLowercase: false,
      requireUppercase: false,
      requireDigits: false,
      requireSymbols: false,
    },
    standardAttributes: {
      email: {
        required: true,
        mutable: true,
      },
      givenName: {
        required: true,
        mutable: false,
      },
    },

    lambdaTriggers: {
      postConfirmation: props.addUserPostConfirmation,
    },
  });

  const userPoolClient = new awsCognito.UserPoolClient(
    scope,
    `userpoolClient`,
    {
      userPool,
    }
  );

  const identityPool = new IdentityPool(scope, `identityPool`, {
    identityPoolName: `TodoIdentityPool`,
    allowUnauthenticatedIdentities: true,
    authenticationProviders: {
      userPools: [
        new UserPoolAuthenticationProvider({
          userPool: userPool,
          userPoolClient: userPoolClient,
        }),
      ],
    },
  });

  return { userPool, userPoolClient, identityPool };
}
