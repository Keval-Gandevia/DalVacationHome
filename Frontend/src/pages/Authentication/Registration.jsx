import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppContext } from "../../context/AppContext";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const registrationSchema = z.object({
  firstName: z.string().min(1, { message: "First Name is required." }),
  lastName: z.string().min(1, { message: "Last Name is required." }),
  email: z.string().email({ message: "Invalid email." }),
  password: z
    .string()
    .min(8, { message: "Password must be a length of at least 8." }),
  role: z.enum(["customer", "property-agent"], {
    message: "Role is required.",
  }),
  securityQuestion: z
    .string()
    .min(1, { message: "Answer of security question is required." }),
  key: z.preprocess(
    (val) => Number(val),
    z
      .number()
      .min(1, { message: "Key is required and must be between 1 and 25." })
      .max(25, { message: "Key is required and must be between 1 and 25." })
  ),
});

const confirmationSchema = z.object({
  email: z.string().min(1, { message: "Email is required." }),
  confirmationCode: z.string().min(1, { message: "Code is required." }),
});

const Registration = () => {
  const { isRegistered, isConfirmed, handleConfiramtionCodeRegistration, handleRegistration } = useAppContext();

  const navigate = useNavigate();

  const registrationForm = useForm({
    resolver: zodResolver(registrationSchema),
  });

  const confirmationForm = useForm({
    resolver: zodResolver(confirmationSchema),
  });

  useEffect(() => {
    if (isConfirmed) {
      navigate("/login");
    }
  }, [isConfirmed, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 w-full max-w-md mx-auto">
        {!isRegistered ? (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
            <form onSubmit={registrationForm.handleSubmit(handleRegistration)}>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      placeholder="Enter first name"
                      // {...register("firstName")}
                      {...registrationForm.register("firstName")}
                      className={`mt-1 block w-full border ${
                        registrationForm.formState.errors.firstName ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    />
                    {registrationForm.formState.errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">
                        {registrationForm.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      placeholder="Enter last name"
                      // {...register("lastName")}
                      {...registrationForm.register("lastName")}
                      className={`mt-1 block w-full border ${
                        registrationForm.formState.errors.lastName ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    />
                    {registrationForm.formState.errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">
                        {registrationForm.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter email"
                    // {...register("email")}
                    {...registrationForm.register("email")}
                    className={`mt-1 block w-full border ${
                      registrationForm.formState.errors.email ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  />
                  {registrationForm.formState.errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {registrationForm.formState.errors.email.message}
                    </p>
                  )}
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
                    // {...register("password")}
                    {...registrationForm.register("password")}
                    className={`mt-1 block w-full border ${
                      registrationForm.formState.errors.password ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  />
                  {registrationForm.formState.errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {registrationForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Role
                  </label>
                  <select
                    id="role"
                    // {...register("role")}
                    {...registrationForm.register("role")}
                    className={`mt-1 block w-full border ${
                      registrationForm.formState.errors.role ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  >
                    <option value="customer">Customer</option>
                    <option value="property-agent">Property Agent</option>
                  </select>
                  {registrationForm.formState.errors.role && (
                    <p className="text-red-500 text-sm mt-1">
                      {registrationForm.formState.errors.role.message}
                    </p>
                  )}
                </div>
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
                    // {...register("securityQuestion")}
                    {...registrationForm.register("securityQuestion")}
                    className={`mt-1 block w-full border ${
                      registrationForm.formState.errors.securityQuestion
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  />
                  {registrationForm.formState.errors.securityQuestion && (
                    <p className="text-red-500 text-sm mt-1">
                      {registrationForm.formState.errors.securityQuestion.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="key"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Key
                  </label>
                  <input
                    type="number"
                    id="key"
                    // {...register("key")}
                    {...registrationForm.register("key")}
                    className={`mt-1 block w-full border ${
                      registrationForm.formState.errors.key ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  />
                  {registrationForm.formState.errors.key && (
                    <p className="text-red-500 text-sm mt-1">
                      {registrationForm.formState.errors.key.message}
                    </p>
                  )}
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Register
                  </button>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-500 hover:underline">
                      Login
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </>
        ): (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">Confirm User Registration</h2>
            <form onSubmit={confirmationForm.handleSubmit(handleConfiramtionCodeRegistration)}>
            <div className="grid gap-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter email"
                    // {...register("email")}
                    {...confirmationForm.register("email")}
                    className={`mt-1 block w-full border ${
                      confirmationForm.formState.errors.email ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  />
                  {confirmationForm.formState.errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {confirmationForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="confirmationCode"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirmation Code
                  </label>
                  <input
                    type="text"
                    id="confirmationCode"
                    placeholder="Enter confirmation code"
                    // {...register("password")}
                    {...confirmationForm.register("confirmationCode")}
                    className={`mt-1 block w-full border ${
                      confirmationForm.formState.errors.confirmationCode ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  />
                  {confirmationForm.formState.errors.confirmationCode && (
                    <p className="text-red-500 text-sm mt-1">
                      {confirmationForm.formState.errors.confirmationCode.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <button
                    type="submit"
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </form>
          </>
        )}
        
      </div>
    </div>
  );
};

export default Registration;
