import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Prevents flashing login page

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            const storedUser = JSON.parse(localStorage.getItem("user"));
            setUser(storedUser);
        }
        setLoading(false); // Finish loading once user data is retrieved
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axios.post("http://localhost:5001/api/auth/login", { email, password });
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify({ userId: res.data.userId, name: res.data.name }));
            setUser({ userId: res.data.userId, name: res.data.name });
        } catch (error) {
            throw error.response.data.message;
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete axios.defaults.headers.common["Authorization"];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
