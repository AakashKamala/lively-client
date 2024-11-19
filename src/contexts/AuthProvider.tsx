import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
    authToken: string | null;
    setAuthToken: React.Dispatch<React.SetStateAction<string | null>>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = (props: { children: ReactNode }) => {
    const navigate = useNavigate();

    const [authToken, setAuthToken] = useState(() => {
        return localStorage.getItem("token");
    });

    useEffect(() => {
        if (authToken) {
            localStorage.setItem("token", authToken);
        } else {
            localStorage.removeItem("token");
        }
    }, [authToken]);

    const logout = () => {
        setAuthToken(null);
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ authToken, setAuthToken, logout }}>
            {props.children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export default AuthProvider;
