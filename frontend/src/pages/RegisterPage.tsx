import React, { useContext, useState } from "react";
import httpClient from "../httpClient";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../store/appContext";

import { Box, Button, Input, Stack, Heading } from "@chakra-ui/react";

const RegisterPage: React.FC = () => {
    const { state, actions } = useContext(AppContext);
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const navigate = useNavigate();
    
    const registerUser = async () => {
        const response = await httpClient.post('//127.0.0.1:5000/register', {
            username,
            email,
            password,
        })

        if (response.status == 200) {
            console.log(response.data.access_token);
            console.log(email)
            sessionStorage.setItem("token", response.data.access_token);
            sessionStorage.setItem("email", email)
            sessionStorage.setItem("username", username)
            actions.setUsername(username);
            actions.setToken(response.data.access_token);
            console.log("Token" + state.token);
            actions.setEmail(email);
            console.log("Email"+ state.email);
            navigate("/");
        } else if (response.status == 401) {
            console.log("Register not working")
            console.log("invalid credentials");
        }
    };

    return (
            <section className="bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Create an account
          </h1>
          <form className="space-y-4 md:space-y-6">
            <div>
              <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Your email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
            <button
                type="submit"
                onClick={registerUser}
                className="w-full text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-300"
                >
                Create an account
                </button>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
              <a href="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                Login here
              </a>
            </p>
          </form>
        </div>
      </div>
    </section>
    );
  
  
};

export default RegisterPage;