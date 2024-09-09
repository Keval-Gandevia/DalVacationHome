import { useReducer } from "react";
import { createContext, useContext } from "react";
import axios from "axios";
import {
  CONFIRM_USER,
  LOGIN_CAESAR_CIPHER,
  LOGIN_SECURITY_QUESTION_ANSWER,
  LOGIN_USER,
  LOGOUT,
  REGISTER_USER,
  SET_TOKEN,
} from "./actions";
import reducer from "./reducer";
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
} from "amazon-cognito-identity-js";
import { jwtDecode } from "jwt-decode";
import { getUserPool } from "../config/CognitoConfig";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  isRegistered: localStorage.getItem("isRegistered") || false,
  isConfirmed: localStorage.getItem("isConfirmed") || false,
  loginStage: 1,
  accessToken: localStorage.getItem("accessToken") || "",
  idToken: localStorage.getItem("idToken") || "",
  refreshToken: localStorage.getItem("refreshToken") || "",
  securityQuestionAnswer: "",
  caesarCipherKey: "",
  isLoggedIn: localStorage.getItem("isLoggedIn") || false,
};

const AppContext = createContext();

const getUserDetailsLambdaFunctionURL = `${
  import.meta.env.VITE_GET_USER_DETAIL_URL
}`;
const sendEmailPostLoginLambdaFunctionURL = `${
  import.meta.env.VITE_SEND_EMAIL_POST_LOGIN_URL
}`;

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // function to handle the user registration
  const handleRegistration = async (data) => {
    const attributeList = [
      new CognitoUserAttribute({
        Name: "email",
        Value: data.email,
      }),
      new CognitoUserAttribute({
        Name: "custom:firstName",
        Value: data.firstName,
      }),
      new CognitoUserAttribute({
        Name: "custom:lastName",
        Value: data.lastName,
      }),
      new CognitoUserAttribute({
        Name: "custom:role",
        Value: data.role,
      }),
      new CognitoUserAttribute({
        Name: "custom:caesarCipherKey",
        Value: String(data.key),
      }),
      new CognitoUserAttribute({
        Name: "custom:securityQueAns",
        Value: data.securityQuestion,
      }),
    ];

    const userpool = getUserPool();

    userpool.signUp(
      data.email,
      data.password,
      attributeList,
      null,
      (err, res) => {
        if (err) {
          console.error(err);
          alert("Registration error: " + err.message);
          return;
        }
        dispatch({ type: REGISTER_USER, payload: data });
        // console.log("User registered:", res.user.getUsername());
      }
    );
  };

  // function to handle the confirm the code after registration
  const handleConfiramtionCodeRegistration = async (data) => {
    const user = new CognitoUser({
      Username: data.email,
      Pool: getUserPool(),
    });

    user.confirmRegistration(data.confirmationCode, true, (err, res) => {
      if (err) {
        console.error("Error confirming registration:", err);
        alert("Error cofirming code: " + err.message);
        return;
      }
      alert("User registeted successfully!");
      dispatch({ type: CONFIRM_USER, payload: data });
    });
  };

  // function to get the security question answer and caesar cipher key using lambda in backend
  const getUserDetails = async (email) => {
    try {
      const response = await axios.get(getUserDetailsLambdaFunctionURL, {
        params: {
          email: email,
        },
      });
      return response.data;
    } catch (err) {
      alert("Error fetching user details!");
      console.error("Error fetching user details:", err);
      throw err;
    }
  };

  // function to send email upon successful sign-in
  const sendEmailAfterLogin = async (email) => {
    try {
      const response = await axios.get(sendEmailPostLoginLambdaFunctionURL, {
        params: {
          email: email,
        },
      });
      return response.data;
    } catch (err) {
      console.error("Error sending email: ", err);
      throw err;
    }
  };

  // function to handle the user login
  const handleLoginEmailPassword = async (data) => {
    const user = new CognitoUser({
      Username: data.email,
      Pool: getUserPool(),
    });

    const authenticationDetails = new AuthenticationDetails({
      Username: data.email,
      Password: data.password,
    });

    user.authenticateUser(authenticationDetails, {
      onSuccess: async (res) => {
        const tokens = {
          accessToken: res.getAccessToken().getJwtToken(),
          idToken: res.getIdToken().getJwtToken(),
          refreshToken: res.getRefreshToken().getToken(),
        };

        const decoded = jwtDecode(tokens["idToken"]);
        // console.log(decoded)

        const user = {
          username: decoded["cognito:username"],
          email: decoded["email"],
          firstName: decoded["custom:firstName"],
          lastName: decoded["custom:lastName"],
          role: decoded["custom:role"],
          securityQueAns: decoded["custom:securityQueAns"],
          caesarCipherKey: decoded["custom:caesarCipherKey"],
        };

        dispatch({ type: SET_TOKEN, payload: { tokens, user } });

        // get the user details such as caesar cipher key and security question answer
        try {
          const userDetails = await getUserDetails(data.email);
          dispatch({ type: LOGIN_USER, payload: userDetails });
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      },
      onFailure: (err) => {
        console.error("Login failed:", err);
        alert("Invalid credentials!");
      },
    });
  };

  // function to match the security question answer
  const handleLoginSecurityQuestionAnswer = async (data) => {
    if (state.securityQuestionAnswer === data.securityQuestion) {
      dispatch({ type: LOGIN_SECURITY_QUESTION_ANSWER, payload: data });
    } else {
      alert("Security Question Answer does not match!");
    }
  };

  // function to perform 3rd factor authentication using caesar cipher key
  const handleLoginCaesarCipher = async (data) => {
    const { cipherText, randomString } = data;

    const caesarCipher = (text, key) => {
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const shift = key % 26;

      const shiftedAlphabet = alphabet.slice(shift) + alphabet.slice(0, shift);

      return text
        .split("")
        .map((char) => {
          const uppercase = char === char.toUpperCase();
          const index = alphabet.indexOf(char.toUpperCase());
          if (index === -1) return char;
          const shiftedChar = shiftedAlphabet[index];
          return uppercase ? shiftedChar : shiftedChar.toLowerCase();
        })
        .join("");
    };

    const expectedCipherText = caesarCipher(
      randomString,
      state.caesarCipherKey
    );

    if (expectedCipherText === cipherText) {
      dispatch({ type: LOGIN_CAESAR_CIPHER, payload: data });

      // send email on successful login
      const email = state.user.email;
      await sendEmailAfterLogin(email);
    } else {
      alert("Wrong cipher text!");
    }
  };

  const handleLogout = () => {
    dispatch({ type: LOGOUT });
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        handleRegistration,
        handleConfiramtionCodeRegistration,
        handleLoginEmailPassword,
        handleLoginSecurityQuestionAnswer,
        handleLoginCaesarCipher,
        handleLogout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider, useAppContext };
