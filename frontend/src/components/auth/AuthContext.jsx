import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useMemo
} from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
} from "../../services/auth";


const STORAGE_KEYS = {
    ACCESS_TOKEN: "codity_access_token",
    REFRESH_TOKEN: "codity_refresh_token"
};


const resolveErrorMessage = (error, fallback) => {
    return (
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        fallback
    );
};

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(
        () => localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) || null
    );
    const [refreshToken, setRefreshToken] = useState(
        () => localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) || null
    );


    const [loading, setLoading] = useState(true);


    const persistTokens = useCallback((tokens) => {
        if (!tokens?.access_token || !tokens?.refresh_token) {
            throw new Error("Invalid token payload received from server.");
        }

        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.access_token);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refresh_token);

        setAccessToken(tokens.access_token);
        setRefreshToken(tokens.refresh_token);
    }, []);


    const clearSession = useCallback(() => {
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);

        setUser(null);
        setAccessToken(null);
        setRefreshToken(null);
    }, []);


    const fetchCurrentUser = useCallback(async () => {
        try {
            const response = await getCurrentUser();
            setUser(response.data.data.user);
            return response.data.data.user;
        } catch (error) {
          
            if (error?.response?.status === 401) {
                clearSession();
            }
            throw error;
        }
    }, [clearSession]);

    /**
     * On application startup, if a token is already present in
     * localStorage, attempt to hydrate the session by loading the
     * current user. This runs exactly once on mount.
     */
    useEffect(() => {
        let isMounted = true;

        const hydrateSession = async () => {
            const storedAccessToken = localStorage.getItem(
                STORAGE_KEYS.ACCESS_TOKEN
            );

            if (!storedAccessToken) {
                if (isMounted) setLoading(false);
                return;
            }

            try {
                await fetchCurrentUser();
            } catch (error) {
                // Session could not be restored; state has already been
                // cleared inside fetchCurrentUser when applicable.
                console.error("Failed to restore session:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        hydrateSession();

        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * Authenticates a user with email/password credentials, persists
     * the returned tokens, hydrates user state, and redirects to the
     * dashboard.
     */
    const login = useCallback(
        async (credentials) => {
            try {
                const response = await loginUser(credentials);
                const { user: loggedInUser, tokens } = response.data.data;

                persistTokens(tokens);
                setUser(loggedInUser);

                toast.success(response.data.message || "Login successful.");
                navigate("/dashboard", { replace: true });

                return loggedInUser;
            } catch (error) {
                const message = resolveErrorMessage(
                    error,
                    "Unable to log in. Please check your credentials and try again."
                );
                toast.error(message);
                throw error;
            }
        },
        [navigate, persistTokens]
    );


    const register = useCallback(
        async (payload) => {
            try {
                const response = await registerUser(payload);
                const { user: registeredUser, tokens } = response.data.data;

                persistTokens(tokens);
                setUser(registeredUser);

                toast.success(response.data.message || "Account created successfully.");
                navigate("/dashboard", { replace: true });

                return registeredUser;
            } catch (error) {
                const message = resolveErrorMessage(
                    error,
                    "Unable to create your account. Please try again."
                );
                toast.error(message);
                throw error;
            }
        },
        [navigate, persistTokens]
    );


    const logout = useCallback(async () => {
        try {
            await logoutUser();
        } catch (error) {
            console.error("Logout request failed, clearing session locally:", error);
        } finally {
            clearSession();
            navigate("/login", { replace: true });
            toast.success("You have been logged out.");
        }
    }, [clearSession, navigate]);

    const isAuthenticated = Boolean(accessToken && user);


    const value = useMemo(
        () => ({
            user,
            accessToken,
            refreshToken,
            loading,
            isAuthenticated,
            login,
            register,
            logout,
            fetchCurrentUser
        }),
        [
            user,
            accessToken,
            refreshToken,
            loading,
            isAuthenticated,
            login,
            register,
            logout,
            fetchCurrentUser
        ]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


export function useAuth() {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider.");
    }

    return context;
}
