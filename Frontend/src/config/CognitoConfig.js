import { CognitoUserPool } from "amazon-cognito-identity-js";

const userPoolData = {
  UserPoolId: `${import.meta.env.VITE_COGNITO_USER_POOL}`,
  ClientId: `${import.meta.env.VITE_COGNITO_CLIENT_ID}`,
};

export const getUserPool = () => {
    return new CognitoUserPool(userPoolData);
}


