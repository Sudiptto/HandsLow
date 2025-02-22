import React, { useState } from "react";
import { AppContext, AppState } from "./appContext";
import httpClient from "../httpClient";

const AppProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  // Initialize state with values from sessionStorage (for persistence across refreshes)
  const [state, setState] = useState<AppState>({
    token: sessionStorage.getItem("token") || null,
    email: sessionStorage.getItem("email") || null,
    username: sessionStorage.getItem("username") || null,
  });

  const setToken = (token: string) => {
    setState((prevState) => ({ ...prevState, token }));
    sessionStorage.setItem("token", token);
  };

  const setEmail = (email: string) => {
    setState((prevState) => ({ ...prevState, email }));
    sessionStorage.setItem("email", email);
  };

  const setUsername = (username: string) => {
    setState((prevState) => ({ ...prevState, username }));
    sessionStorage.setItem("username", username); // Fixed this line
  };

  const getToken = () => {
    return state.token;
  };

  const getUsername = () => {
    return state.username;
  };

  const logout = () => {
    setState({ token: null, email: null, username: null });
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("username");
  };

  const getMessage = async () => {
    const response = await httpClient.get("//127.0.0.1:5000/message", {
      headers: {
        Authorization: "Bearer " + state.token,
      },
    });
    return response.data.hello;
  };

  // Context value to provide to children
  const contextValue = {
    state,
    actions: {
      setToken,
      setEmail,
      setUsername,
      getToken, // Added getToken
      getUsername, // Added getUsername
      logout,
      getMessage,
    },
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export default AppProvider;