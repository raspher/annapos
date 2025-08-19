import React, {createContext, useContext, useEffect, useState} from "react";

interface User {
    id: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    useEffect(() => {
        fetch("/auth/me", {credentials: "include"})
            .then(res => {
                if (!res.ok) throw new Error("Not logged in");
                return res.json();
            })
            .then(data => {
                setUser(data.user);
                setAccessToken(data.accessToken);
            })
            .catch(() => {
                setUser(null);
                setAccessToken(null);
            })
    }, []);

    const login = async (email: string, password: string) => {
        const res = await fetch("/auth/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, password}),
        });

        if (!res.ok) throw new Error("Login failed");
        const data = await res.json();
        setUser(data.user);
        setAccessToken(data.accessToken);
    }

    const logout = async () => {
        await fetch("/auth/logout", {
            method: "POST",
            credentials: "include",
        });
        setUser(null);
        setAccessToken(null);
    };

    return (
        <AuthContext.Provider value={{user, accessToken, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}