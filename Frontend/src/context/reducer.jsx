import {
  CONFIRM_USER,
  LOGIN_CAESAR_CIPHER,
  LOGIN_SECURITY_QUESTION_ANSWER,
  LOGIN_USER,
  LOGOUT,
  REGISTER_USER,
  SET_TOKEN,
} from "./actions";

const reducer = (state, action) => {
  if (action.type === REGISTER_USER) {
    localStorage.setItem("isRegistered", true);
    return { ...state, user: action.payload, isRegistered: true };
  }
  if (action.type === CONFIRM_USER) {
    localStorage.setItem("isConfirmed", true);
    return { ...state, isConfirmed: true };
  }
  if (action.type === LOGIN_USER) {
    return {
      ...state,
      securityQuestionAnswer: action.payload.securityQuestionAnswer,
      caesarCipherKey: action.payload.caesarCipherKey,
      loginStage: 2,
    };
  }
  if (action.type === SET_TOKEN) {
    localStorage.setItem("accessToken", action.payload.tokens.accessToken);
    localStorage.setItem("idToken", action.payload.tokens.idToken);
    localStorage.setItem("refreshToken", action.payload.tokens.refreshToken);
    localStorage.setItem("userEmail", action.payload.user.email);
    localStorage.setItem("user", JSON.stringify(action.payload.user));
    localStorage.setItem("role", action.payload.user.role);
    return {
      ...state,
      user: action.payload.user,
      accessToken: action.payload.tokens.accessToken,
      idToken: action.payload.tokens.idToken,
      refreshToken: action.payload.tokens.refreshToken,
    };
  }
  if (action.type === LOGIN_SECURITY_QUESTION_ANSWER) {
    return { ...state, loginStage: 3 };
  }
  if (action.type === LOGIN_CAESAR_CIPHER) {
    localStorage.setItem("isLoggedIn", true);
    return { ...state, isLoggedIn: true };
  }
  if (action.type === LOGOUT) {
    localStorage.clear();
    return { ...state, isLoggedIn: false };
  }
};

export default reducer;
