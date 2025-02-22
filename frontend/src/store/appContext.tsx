import { createContext } from "react";

export interface AppState {
    token: string | null;
    email: string | null;
    username: string | null;
}

interface AppContextType {
    state: AppState;
    actions: {
        setToken: (token: string) => void;
        setUsername: (username: string) => void;
        setEmail: (email: string) => void;
        getToken: () => string | null; // Getter for token
        getUsername: () => string | null; // Getter for username
        logout: () => void;
        getMessage: () => Promise<string>;
    };
}

const defaultContextValue: AppContextType = {
    state: { token: null, email: null, username: null },
    actions: {
        setToken: () => {},
        setUsername: () => {},
        setEmail: () => {},
        getToken: () => null, // Default getter for token
        getUsername: () => null, // Default getter for username
        logout: () => {},
        getMessage: async () => {
            return "blank"; // Default message
        },
    },
};

export const AppContext = createContext<AppContextType>(defaultContextValue);