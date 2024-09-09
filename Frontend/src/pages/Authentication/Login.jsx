import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAppContext } from "../../context/AppContext";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const generateRandomCaptcha = () => {
  const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const length = 6;
  let str = "";

  for (let i = 0; i < length; i++) {
    str += alphabets.charAt(Math.floor(Math.random() * alphabets.length));
  }
  return str;
};

const emailPasswordSchema = z.object({
  email: z.string().min(1, { message: "Email is required." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const securityQuestionSchema = z.object({
  securityQuestion: z.string().min(1, { message: "Answer is required." }),
});

const caesarCipherKeySchema = z.object({
  cipherText: z.string().min(1, { message: "Cipher Text is required." }),
});

const Login = () => {
  const {
    user,
    loginStage,
    isLoggedIn,
    handleLoginCaesarCipher,
    handleLoginSecurityQuestionAnswer,
    handleLoginEmailPassword,
  } = useAppContext();

  const [randomString, setRandomString] = useState("");

  const navigate = useNavigate();

  const emailPasswordForm = useForm({
    resolver: zodResolver(emailPasswordSchema),
  });

  const securityQuestionForm = useForm({
    resolver: zodResolver(securityQuestionSchema),
  });

  const caesarCipherKeyForm = useForm({
    resolver: zodResolver(caesarCipherKeySchema),
  });

  useEffect(() => {
    if (loginStage === 3) {
      setRandomString(generateRandomCaptcha());
    }
  }, [loginStage]);

  useEffect(() => {
    if (user != null) {
      if (isLoggedIn && user["role"] === "customer") {
        navigate("/");
      } else if (isLoggedIn && user["role"] === "property-agent") {
        navigate("/property-agent-dashboard");
      }
    }
  }, [isLoggedIn, user, navigate]);

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="bg-white p-8 w-full max-w-md mx-auto">
          {loginStage === 1 && (
            <>
              <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
              <form
                onSubmit={emailPasswordForm.handleSubmit(
                  handleLoginEmailPassword
                )}
              >
                <div className="grid gap-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Email
                    </label>
                    <div className="mt-2">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter email"
                        {...emailPasswordForm.register("email")}
                        className={`mt-1 block w-full border ${
                          emailPasswordForm.formState.errors.email
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      />
                      {emailPasswordForm.formState.errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {emailPasswordForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      placeholder="Enter password"
                      {...emailPasswordForm.register("password")}
                      className={`mt-1 block w-full border ${
                        emailPasswordForm.formState.errors.password
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    />
                    {emailPasswordForm.formState.errors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {emailPasswordForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Next
                    </button>
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-sm">
                      Don&apos;t have an account?{" "}
                      <Link
                        to="/register"
                        className="text-blue-500 hover:underline"
                      >
                        Register
                      </Link>
                    </p>
                  </div>
                </div>
              </form>
            </>
          )}
          {loginStage === 2 && (
            <>
              <h2 className="text-2xl font-bold mb-6 text-center">
                Security Question
              </h2>
              <form
                onSubmit={securityQuestionForm.handleSubmit(
                  handleLoginSecurityQuestionAnswer
                )}
              >
                <div className="grid gap-4">
                  <div>
                    <label
                      htmlFor="securityQuestion"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Security Question: What is your favorite food?
                    </label>
                    <input
                      type="text"
                      id="securityQuestion"
                      placeholder="Enter answer"
                      {...securityQuestionForm.register("securityQuestion")}
                      className={`mt-1 block w-full border ${
                        securityQuestionForm.formState.errors.securityAnswer
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    />
                    {securityQuestionForm.formState.errors.securityQuestion && (
                      <p className="text-red-500 text-sm mt-1">
                        {
                          securityQuestionForm.formState.errors.securityQuestion
                            .message
                        }
                      </p>
                    )}
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </form>
            </>
          )}
          {loginStage === 3 && (
            <>
              <h2 className="text-2xl font-bold mb-6 text-center">
                Caesar Cipher
              </h2>
              <form
                onSubmit={caesarCipherKeyForm.handleSubmit((data) =>
                  handleLoginCaesarCipher({
                    cipherText: data.cipherText,
                    randomString: randomString,
                  })
                )}
              >
                <div className="grid gap-4">
                  <div>
                    <label
                      htmlFor="caesarCipher"
                      className="inline-block text-sm font-medium text-gray-700"
                    >
                      Enter following text with caesar cipher key:{" "}
                      <span className="font-bold">{randomString}</span>
                    </label>
                    <input
                      type="text"
                      id="cipherText"
                      placeholder="Enter cipher text"
                      {...caesarCipherKeyForm.register("cipherText")}
                      className={`mt-1 block w-full border ${
                        caesarCipherKeyForm.formState.errors.cipherText
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    />
                    {caesarCipherKeyForm.formState.errors.cipherText && (
                      <p className="text-red-500 text-sm mt-1">
                        {
                          caesarCipherKeyForm.formState.errors.cipherText
                            .message
                        }
                      </p>
                    )}
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Login
                    </button>
                  </div>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Login;
