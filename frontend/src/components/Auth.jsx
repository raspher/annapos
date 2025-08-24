import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    useMemo,
} from "react";
import PropTypes from "prop-types";
import {AuthAPI} from "../services/api.js";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true); // global loading

    // Check session on mount
    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const data = await AuthAPI.cookie();
                setUser(data.user);
                setAccessToken(data.accessToken);
            } catch (err) {
                console.error("Fetch error:", err);
                setUser(null);
                setAccessToken(null);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const data = await AuthAPI.login(email, password);
            setUser(data.user);
            setAccessToken(data.accessToken);
            return true;
        } catch (err) {
            console.error("Login failed:", err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await AuthAPI.logout();
        } finally {
            setUser(null);
            setAccessToken(null);
            setLoading(false);
        }
    };

    const value = useMemo(
        () => ({ user, accessToken, login, logout, loading }),
        [user, accessToken, loading]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
};
